import { prisma } from "@/lib/prisma";
import { ContentType, Locale } from "@prisma/client";
import type {
  AdminCategoryAttributeItem,
  AdminCategoryDetail,
  AdminCategoryFormData,
  AdminCategoryListItem,
  AdminCategoryParentItem,
} from "./category.type";

function getTranslationName<
  T extends {
    locale: Locale;
    name: string;
  },
>(translations: T[], locale: Locale = Locale.vi) {
  return (
    translations.find((item) => item.locale === locale)?.name ||
    translations.find((item) => item.locale === Locale.vi)?.name ||
    translations[0]?.name ||
    ""
  );
}

function getTranslationSlug<
  T extends {
    locale: Locale;
    slug: string;
  },
>(translations: T[], locale: Locale = Locale.vi, fallback = "") {
  return (
    translations.find((item) => item.locale === locale)?.slug ||
    translations.find((item) => item.locale === Locale.vi)?.slug ||
    translations[0]?.slug ||
    fallback
  );
}

export async function getAdminCategories(): Promise<AdminCategoryListItem[]> {
  const categories = await prisma.category.findMany({
    orderBy: [{ type: "asc" }, { parentId: "asc" }, { sortOrder: "asc" }],
    select: {
      id: true,
      type: true,
      slug: true,
      detailTemplate: true,
      parentId: true,
      sortOrder: true,
      isActive: true,
      translations: {
        select: {
          locale: true,
          name: true,
          slug: true,
        },
      },
      parent: {
        select: {
          translations: {
            select: {
              locale: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          attributes: true,
          children: true,
          posts: true,
          products: true,
          projects: true,
          services: true,
        },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    type: category.type,
    slug: category.slug,
    detailTemplate: category.detailTemplate,
    parentId: category.parentId,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
    nameVi: getTranslationName(category.translations, Locale.vi),
    nameEn: getTranslationName(category.translations, Locale.en),
    parentName: category.parent
      ? getTranslationName(category.parent.translations, Locale.vi)
      : "",
    attributesCount: category._count.attributes,
    childrenCount: category._count.children,
    contentCount:
      category._count.posts +
      category._count.products +
      category._count.projects +
      category._count.services,
  }));
}

export async function getCategoryParents(
  currentCategoryId?: string
): Promise<AdminCategoryParentItem[]> {
  const categories = await prisma.category.findMany({
    where: currentCategoryId
      ? {
          id: {
            not: currentCategoryId,
          },
        }
      : undefined,
    orderBy: [{ type: "asc" }, { sortOrder: "asc" }],
    select: {
      id: true,
      type: true,
      slug: true,
      translations: {
        select: {
          locale: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    type: category.type,
    slug: category.slug,
    name: getTranslationName(category.translations, Locale.vi) || category.slug,
  }));
}

export async function getProductAttributes(): Promise<
  AdminCategoryAttributeItem[]
> {
  const attributes = await prisma.attribute.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      code: true,
      type: true,
      isFilter: true,
      isVariantOption: true,
      sortOrder: true,
      translations: {
        select: {
          locale: true,
          name: true,
        },
      },
    },
  });

  return attributes.map((attribute) => ({
    id: attribute.id,
    code: attribute.code,
    type: attribute.type,
    isFilter: attribute.isFilter,
    isVariantOption: attribute.isVariantOption,
    sortOrder: attribute.sortOrder,
    nameVi: getTranslationName(attribute.translations, Locale.vi),
    nameEn: getTranslationName(attribute.translations, Locale.en),
  }));
}

export async function getAdminCategoryById(
  id: string
): Promise<AdminCategoryDetail | null> {
  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      type: true,
      slug: true,
      detailTemplate: true,
      parentId: true,
      sortOrder: true,
      isActive: true,
      translations: {
        select: {
          locale: true,
          name: true,
          slug: true,
        },
      },
      attributes: {
        orderBy: [{ sortOrder: "asc" }],
        select: {
          attributeId: true,
          level: true,
          sortOrder: true,
        },
      },
    },
  });

  if (!category) return null;

  return {
    id: category.id,
    type: category.type,
    slug: category.slug,
    detailTemplate: category.detailTemplate,
    parentId: category.parentId,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
    nameVi: getTranslationName(category.translations, Locale.vi),
    slugVi: getTranslationSlug(category.translations, Locale.vi, category.slug),
    nameEn: getTranslationName(category.translations, Locale.en),
    slugEn: getTranslationSlug(category.translations, Locale.en, category.slug),
    selectedAttributes: category.attributes.map((item) => ({
      attributeId: item.attributeId,
      level: item.level,
      sortOrder: item.sortOrder,
    })),
  };
}

export async function getAdminCategoryFormData({
  id,
}: {
  id?: string;
}): Promise<AdminCategoryFormData> {
  const [category, parents, attributes] = await Promise.all([
    id ? getAdminCategoryById(id) : Promise.resolve(null),
    getCategoryParents(id),
    getProductAttributes(),
  ]);

  return {
    category,
    parents,
    attributes,
  };
}

export async function getProductCategoriesForSelect(locale: Locale = Locale.vi) {
  const categories = await prisma.category.findMany({
    where: {
      type: ContentType.PRODUCT,
      isActive: true,
    },
    orderBy: [{ sortOrder: "asc" }],
    select: {
      id: true,
      slug: true,
      translations: {
        select: {
          locale: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    slug: getTranslationSlug(category.translations, locale, category.slug),
    name: getTranslationName(category.translations, locale) || category.slug,
  }));
}