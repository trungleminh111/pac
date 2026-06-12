import { prisma } from "@/lib/prisma";
import type { Locale, PostCardItem, PostDetailItem } from "./post.type";

const DEFAULT_POST_IMAGE = "/assets/images/blog/blog-1-1.jpg";

type CategoryWithTranslations = {
  slug: string;
  translations: {
    locale: string;
    name: string;
    slug: string | null;
  }[];
} | null;

function getLocalizedItem<T extends { locale: string }>(
  items: T[] | undefined,
  locale: Locale
): T | undefined {
  if (!items?.length) return undefined;

  return (
    items.find((item) => item.locale === locale) ||
    items.find((item) => item.locale === "vi") ||
    items[0]
  );
}

function getCategoryName(locale: Locale, category?: CategoryWithTranslations) {
  if (!category) return "";

  const translation = getLocalizedItem(category.translations, locale);
  return translation?.name || category.slug || "";
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
              in: Array.from(new Set([locale, "vi"])),
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
    translations: {
      where: {
        locale,
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
          locale,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    select: postCardSelect(locale),
  });

  return posts
    .map((post) => mapPostCard(locale, post))
    .filter((post): post is PostCardItem => post !== null);
}

export async function getFeaturedPosts(
  locale: Locale = "vi"
): Promise<PostCardItem[]> {
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      isFeatured: true,
      translations: {
        some: {
          locale,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 3,
    select: postCardSelect(locale),
  });

  return posts
    .map((post) => mapPostCard(locale, post))
    .filter((post): post is PostCardItem => post !== null);
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
          locale,
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
                in: Array.from(new Set([locale, "vi"])),
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
      translations: {
        where: {
          locale,
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
  };
}