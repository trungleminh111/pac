import { prisma } from "@/lib/prisma";
import { ContentType, Locale as PrismaLocale } from "@prisma/client";
import type {
  AdminLocale,
  AdminPostDetail,
  AdminPostItem,
  PostCategoryOption,
  PostTagOption,
} from "./post.type";

function toPrismaLocale(locale: AdminLocale) {
  return locale === "en" ? PrismaLocale.en : PrismaLocale.vi;
}

function formatDate(value: Date | null) {
  if (!value) return "";
  return value.toLocaleDateString("vi-VN");
}

function formatDateTimeLocal(value: Date | null) {
  if (!value) return "";

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  const hour = String(value.getHours()).padStart(2, "0");
  const minute = String(value.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function getName(
  translations: { locale: PrismaLocale; name: string }[],
  locale: AdminLocale = "vi"
) {
  const prismaLocale = toPrismaLocale(locale);

  return (
    translations.find((item) => item.locale === prismaLocale)?.name ||
    translations.find((item) => item.locale === PrismaLocale.vi)?.name ||
    translations[0]?.name ||
    ""
  );
}

function getTagName(
  translations: { locale: PrismaLocale; name: string }[],
  locale: AdminLocale = "vi"
) {
  const prismaLocale = toPrismaLocale(locale);

  return (
    translations.find((item) => item.locale === prismaLocale)?.name ||
    translations.find((item) => item.locale === PrismaLocale.vi)?.name ||
    translations[0]?.name ||
    ""
  );
}

export async function getAdminPosts(): Promise<AdminPostItem[]> {
  const posts = await prisma.post.findMany({
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      status: true,
      thumbnail: true,
      isFeatured: true,
      allowIndex: true,
      publishedAt: true,
      updatedAt: true,
      translations: {
        select: {
          locale: true,
          title: true,
          slug: true,
        },
      },
      category: {
        select: {
          translations: {
            select: {
              locale: true,
              name: true,
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
              translations: {
                select: {
                  locale: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return posts.map((post) => {
    const vi = post.translations.find(
      (item) => item.locale === PrismaLocale.vi
    );
    const en = post.translations.find(
      (item) => item.locale === PrismaLocale.en
    );

    const tags = post.tags
      .map((item) => getTagName(item.tag.translations, "vi"))
      .filter(Boolean);

    return {
      id: post.id,
      status: post.status as AdminPostItem["status"],
      thumbnail: post.thumbnail,
      isFeatured: post.isFeatured,
      allowIndex: post.allowIndex,
      categoryName: post.category
        ? getName(post.category.translations, "vi")
        : "Không chọn",
      titleVi: vi?.title || "Chưa có tiêu đề",
      titleEn: en?.title || "",
      slugVi: vi?.slug || "",
      slugEn: en?.slug || "",
      tags,
      tagsCount: tags.length,
      publishedAt: formatDate(post.publishedAt),
      updatedAt: formatDate(post.updatedAt),
    };
  });
}

export async function getAdminPostById(
  id: string,
  locale: AdminLocale
): Promise<AdminPostDetail | null> {
  const prismaLocale = toPrismaLocale(locale);

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      status: true,
      thumbnail: true,
      isFeatured: true,
      allowIndex: true,
      categoryId: true,
      publishedAt: true,
      translations: {
        where: {
          locale: prismaLocale,
        },
        select: {
          title: true,
          slug: true,
          excerpt: true,
          contentHtml: true,
          content: true,
          seoTitle: true,
          seoDescription: true,
        },
      },
      tags: {
        select: {
          tagId: true,
        },
      },
    },
  });

  if (!post) return null;

  const translation = post.translations[0] || null;

  return {
    id: post.id,
    status: post.status as AdminPostDetail["status"],
    thumbnail: post.thumbnail,
    isFeatured: post.isFeatured,
    allowIndex: post.allowIndex,
    categoryId: post.categoryId,
    publishedAt: formatDateTimeLocal(post.publishedAt),
    activeLocale: locale,
    title: translation?.title || "",
    slug: translation?.slug || "",
    excerpt: translation?.excerpt || "",
    content:
      translation?.contentHtml ||
      ((translation?.content as { html?: string } | null)?.html || ""),
    seoTitle: translation?.seoTitle || "",
    seoDescription: translation?.seoDescription || "",
    selectedTagIds: post.tags.map((item) => item.tagId),
  };
}

export async function getPostFormOptions(
  locale: AdminLocale = "vi"
): Promise<{
  categories: PostCategoryOption[];
  tags: PostTagOption[];
}> {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      where: {
        type: ContentType.POST,
        isActive: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        translations: {
          select: {
            locale: true,
            name: true,
          },
        },
      },
    }),

    prisma.tag.findMany({
      where: {
        isActive: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        translations: {
          select: {
            locale: true,
            name: true,
          },
        },
      },
    }),
  ]);

  return {
    categories: categories.map((category) => ({
      id: category.id,
      name: getName(category.translations, locale) || category.slug,
    })),
    tags: tags.map((tag) => ({
      id: tag.id,
      slug: tag.slug,
      name: getTagName(tag.translations, locale) || tag.slug,
    })),
  };
}