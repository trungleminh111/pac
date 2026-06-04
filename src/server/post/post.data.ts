import { prisma } from "@/lib/prisma";
import type { Locale, PostCardItem, PostDetailItem } from "./post.type";

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
    select: {
      id: true,
      thumbnail: true,
      isFeatured: true,
      publishedAt: true,
      category: {
        select: {
          nameVi: true,
          nameEn: true,
        },
      },
      translations: {
        where: {
          locale,
        },
        select: {
          title: true,
          slug: true,
          excerpt: true,
        },
      },
    },
  });

  return posts
    .map((post) => {
      const translation = post.translations[0];

      if (!translation) return null;

      return {
        id: post.id,
        title: translation.title,
        slug: translation.slug,
        excerpt: translation.excerpt || "",
        image: post.thumbnail || "/assets/images/blog/blog-1-1.jpg",
        category:
          locale === "en"
            ? post.category?.nameEn || post.category?.nameVi || ""
            : post.category?.nameVi || "",
        publishedAt: post.publishedAt,
        isFeatured: post.isFeatured,
      };
    })
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
    select: {
      id: true,
      thumbnail: true,
      isFeatured: true,
      publishedAt: true,
      category: {
        select: {
          nameVi: true,
          nameEn: true,
        },
      },
      translations: {
        where: {
          locale,
        },
        select: {
          title: true,
          slug: true,
          excerpt: true,
        },
      },
    },
  });

  return posts
    .map((post) => {
      const translation = post.translations[0];

      if (!translation) return null;

      return {
        id: post.id,
        title: translation.title,
        slug: translation.slug,
        excerpt: translation.excerpt || "",
        image: post.thumbnail || "/assets/images/blog/blog-1-1.jpg",
        category:
          locale === "en"
            ? post.category?.nameEn || post.category?.nameVi || ""
            : post.category?.nameVi || "",
        publishedAt: post.publishedAt,
        isFeatured: post.isFeatured,
      };
    })
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
          nameVi: true,
          nameEn: true,
        },
      },
      translations: {
        where: {
          locale,
          slug,
        },
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
    categoryName:
      locale === "en"
        ? post.category?.nameEn || post.category?.nameVi || ""
        : post.category?.nameVi || "",
  };
}