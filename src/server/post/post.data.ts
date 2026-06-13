import { prisma } from "@/lib/prisma";
import { Locale as PrismaLocale } from "@prisma/client";
import type {
  Locale,
  PostCardItem,
  PostDetailItem,
  PostTagItem,
} from "./post.type";

const DEFAULT_POST_IMAGE = "/assets/images/blog/blog-1-1.jpg";

type CategoryWithTranslations = {
  id: string;
  slug: string;
  translations: {
    locale: PrismaLocale;
    name: string;
    slug: string | null;
  }[];
} | null;

type TagBaseWithTranslations = {
  id: string;
  slug: string;
  translations: {
    locale: PrismaLocale;
    name: string;
    slug: string | null;
  }[];
};

type TagWithTranslations = TagBaseWithTranslations & {
  posts: {
    postId: string;
  }[];
};

function toPrismaLocale(locale: Locale): PrismaLocale {
  return locale === "en" ? PrismaLocale.en : PrismaLocale.vi;
}

function getFallbackLocales(locale: Locale): PrismaLocale[] {
  const currentLocale = toPrismaLocale(locale);

  return Array.from(new Set([currentLocale, PrismaLocale.vi]));
}

function getLocalizedItem<T extends { locale: PrismaLocale }>(
  items: T[] | undefined,
  locale: Locale
): T | undefined {
  if (!items?.length) return undefined;

  const currentLocale = toPrismaLocale(locale);

  return (
    items.find((item) => item.locale === currentLocale) ||
    items.find((item) => item.locale === PrismaLocale.vi) ||
    items[0]
  );
}

function getCategoryName(locale: Locale, category?: CategoryWithTranslations) {
  if (!category) return "";

  const translation = getLocalizedItem(category.translations, locale);

  return translation?.name || category.slug || "";
}

function getTagName(locale: Locale, tag: TagBaseWithTranslations) {
  const translation = getLocalizedItem(tag.translations, locale);

  return translation?.name || tag.slug;
}

function getTagSlug(locale: Locale, tag: TagBaseWithTranslations) {
  const translation = getLocalizedItem(tag.translations, locale);

  return translation?.slug || tag.slug;
}

const postCardSelect = (locale: Locale) =>
  ({
    id: true,
    thumbnail: true,
    isFeatured: true,
    publishedAt: true,
    category: {
      select: {
        id: true,
        slug: true,
        translations: {
          where: {
            locale: {
              in: getFallbackLocales(locale),
            },
          },
          select: {
            locale: true,
            name: true,
            slug: true,
          },
        },
      },
    },
    tags: {
      orderBy: {
        sortOrder: "asc",
      },
      select: {
        tag: {
          select: {
            id: true,
            slug: true,
            translations: {
              where: {
                locale: {
                  in: getFallbackLocales(locale),
                },
              },
              select: {
                locale: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    },
    translations: {
      where: {
        locale: toPrismaLocale(locale),
      },
      take: 1,
      select: {
        title: true,
        slug: true,
        excerpt: true,
      },
    },
  }) as const;

function mapPostCard(
  locale: Locale,
  post: {
    id: string;
    thumbnail: string | null;
    isFeatured: boolean;
    publishedAt: Date | null;
    category: CategoryWithTranslations;
    tags: {
      tag: TagBaseWithTranslations;
    }[];
    translations: {
      title: string;
      slug: string;
      excerpt: string | null;
    }[];
  }
): PostCardItem | null {
  const translation = post.translations[0];

  if (!translation) return null;

  return {
    id: post.id,
    title: translation.title,
    slug: translation.slug,
    excerpt: translation.excerpt || "",
    image: post.thumbnail || DEFAULT_POST_IMAGE,
    category: getCategoryName(locale, post.category),
    publishedAt: post.publishedAt,
    isFeatured: post.isFeatured,
    tags: post.tags.map((item) => ({
      id: item.tag.id,
      name: getTagName(locale, item.tag),
      slug: getTagSlug(locale, item.tag),
      postCount: 0,
    })),
  };
}

export async function getPostsPage(
  locale: Locale = "vi"
): Promise<PostCardItem[]> {
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      translations: {
        some: {
          locale: toPrismaLocale(locale),
        },
      },
    },
    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        updatedAt: "desc",
      },
    ],
    select: postCardSelect(locale),
  });

  return posts
    .map((post) => mapPostCard(locale, post))
    .filter((post): post is PostCardItem => Boolean(post));
}

export async function getFeaturedPosts(
  locale: Locale = "vi",
  take = 3
): Promise<PostCardItem[]> {
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      isFeatured: true,
      translations: {
        some: {
          locale: toPrismaLocale(locale),
        },
      },
    },
    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        updatedAt: "desc",
      },
    ],
    take,
    select: postCardSelect(locale),
  });

  return posts
    .map((post) => mapPostCard(locale, post))
    .filter((post): post is PostCardItem => Boolean(post));
}

export async function getPostBySlug(
  locale: Locale,
  slug: string
): Promise<PostDetailItem | null> {
  const post = await prisma.post.findFirst({
    where: {
      status: "PUBLISHED",
      translations: {
        some: {
          locale: toPrismaLocale(locale),
          slug,
        },
      },
    },
    select: {
      id: true,
      status: true,
      thumbnail: true,
      isFeatured: true,
      allowIndex: true,
      authorId: true,
      categoryId: true,
      publishedAt: true,
      category: {
        select: {
          id: true,
          slug: true,
          translations: {
            where: {
              locale: {
                in: getFallbackLocales(locale),
              },
            },
            select: {
              locale: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      tags: {
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          tag: {
            select: {
              id: true,
              slug: true,
              translations: {
                where: {
                  locale: {
                    in: getFallbackLocales(locale),
                  },
                },
                select: {
                  locale: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
      translations: {
        where: {
          locale: toPrismaLocale(locale),
          slug,
        },
        take: 1,
        select: {
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          seoTitle: true,
          seoDescription: true,
        },
      },
    },
  });

  if (!post) return null;

  const translation = post.translations[0];

  if (!translation) return null;

  return {
    id: post.id,
    status: post.status,
    thumbnail: post.thumbnail,
    isFeatured: post.isFeatured,
    allowIndex: post.allowIndex,
    authorId: post.authorId,
    categoryId: post.categoryId,
    publishedAt: post.publishedAt,
    title: translation.title,
    slug: translation.slug,
    excerpt: translation.excerpt || "",
    content: translation.content,
    seoTitle: translation.seoTitle || "",
    seoDescription: translation.seoDescription || "",
    categoryName: getCategoryName(locale, post.category),
    tags: post.tags.map((item) => ({
      id: item.tag.id,
      name: getTagName(locale, item.tag),
      slug: getTagSlug(locale, item.tag),
      postCount: 0,
    })),
  };
}

export async function getAllPostTags(
  locale: Locale = "vi"
): Promise<PostTagItem[]> {
  const tags = await prisma.tag.findMany({
    where: {
      isActive: true,
      posts: {
        some: {
          post: {
            status: "PUBLISHED",
            translations: {
              some: {
                locale: toPrismaLocale(locale),
              },
            },
          },
        },
      },
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    select: {
      id: true,
      slug: true,
      translations: {
        where: {
          locale: {
            in: getFallbackLocales(locale),
          },
        },
        select: {
          locale: true,
          name: true,
          slug: true,
        },
      },
      posts: {
        where: {
          post: {
            status: "PUBLISHED",
            translations: {
              some: {
                locale: toPrismaLocale(locale),
              },
            },
          },
        },
        select: {
          postId: true,
        },
      },
    },
  });

  return tags
    .map((tag: TagWithTranslations) => ({
      id: tag.id,
      name: getTagName(locale, tag),
      slug: getTagSlug(locale, tag),
      postCount: tag.posts.length,
    }))
    .filter((tag) => tag.postCount > 0);
}