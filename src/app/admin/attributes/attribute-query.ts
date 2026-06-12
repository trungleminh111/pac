import { prisma } from "@/lib/prisma";
import { Locale } from "@prisma/client";
import type { AdminAttributeDetail, AdminAttributeItem } from "./attribute.type";

function getTranslationName<
  T extends {
    locale: Locale;
    name: string;
  },
>(translations: T[], locale: Locale) {
  return (
    translations.find((item) => item.locale === locale)?.name ||
    translations.find((item) => item.locale === Locale.vi)?.name ||
    translations[0]?.name ||
    ""
  );
}

export async function getAdminAttributes(
  locale: Locale = Locale.vi
): Promise<AdminAttributeItem[]> {
  const attributes = await prisma.attribute.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
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
      _count: {
        select: {
          values: true,
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
    valuesCount: attribute._count.values,
  }));
}

export async function getAdminAttributeById(
  id: string
): Promise<AdminAttributeDetail | null> {
  const attribute = await prisma.attribute.findUnique({
    where: { id },
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
      values: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          code: true,
          colorHex: true,
          image: true,
          sortOrder: true,
          translations: {
            select: {
              locale: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!attribute) return null;

  return {
    id: attribute.id,
    code: attribute.code,
    type: attribute.type,
    isFilter: attribute.isFilter,
    isVariantOption: attribute.isVariantOption,
    sortOrder: attribute.sortOrder,
    nameVi: getTranslationName(attribute.translations, Locale.vi),
    nameEn: getTranslationName(attribute.translations, Locale.en),
    values: attribute.values.map((value) => ({
      id: value.id,
      code: value.code,
      colorHex: value.colorHex,
      image: value.image,
      sortOrder: value.sortOrder,
      nameVi: getTranslationName(value.translations, Locale.vi),
      nameEn: getTranslationName(value.translations, Locale.en),
    })),
  };
}