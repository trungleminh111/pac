import { prisma } from "@/lib/prisma";
import { Locale } from "@prisma/client";
import type { AdminTagDetail, AdminTagItem } from "./tag.type";

function getTranslation<
  T extends {
    locale: Locale;
    name: string;
    slug: string | null;
    description: string | null;
  },
>(translations: T[], locale: Locale) {
  return translations.find((item) => item.locale === locale) || null;
}

export async function getAdminTags(): Promise<AdminTagItem[]> {
  const tags = await prisma.tag.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      sortOrder: true,
      isActive: true,
      translations: {
        select: {
          locale: true,
          name: true,
          slug: true,
          description: true,
        },
      },
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  return tags.map((tag) => {
    const vi = getTranslation(tag.translations, Locale.vi);
    const en = getTranslation(tag.translations, Locale.en);

    return {
      id: tag.id,
      slug: tag.slug,
      sortOrder: tag.sortOrder,
      isActive: tag.isActive,
      nameVi: vi?.name || tag.slug,
      nameEn: en?.name || "",
      slugVi: vi?.slug || "",
      slugEn: en?.slug || "",
      descriptionVi: vi?.description || "",
      descriptionEn: en?.description || "",
      postsCount: tag._count.posts,
    };
  });
}

export async function getAdminTagById(
  id: string
): Promise<AdminTagDetail | null> {
  const tag = await prisma.tag.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      slug: true,
      sortOrder: true,
      isActive: true,
      translations: {
        select: {
          locale: true,
          name: true,
          slug: true,
          description: true,
        },
      },
    },
  });

  if (!tag) return null;

  const vi = getTranslation(tag.translations, Locale.vi);
  const en = getTranslation(tag.translations, Locale.en);

  return {
    id: tag.id,
    slug: tag.slug,
    sortOrder: tag.sortOrder,
    isActive: tag.isActive,
    nameVi: vi?.name || "",
    nameEn: en?.name || "",
    slugVi: vi?.slug || "",
    slugEn: en?.slug || "",
    descriptionVi: vi?.description || "",
    descriptionEn: en?.description || "",
  };
}