import { prisma } from "@/lib/prisma";
import { ContentType, Locale } from "@prisma/client";
import type {
  AdminProductListItem,
  ProductEditAttributeValue,
  ProductEditData,
  ProductFormCategoryItem,
} from "./product-form.type";

function getName<T extends { locale: Locale; name: string }>(
  translations: T[],
  locale: Locale
) {
  return (
    translations.find((item) => item.locale === locale)?.name ||
    translations.find((item) => item.locale === Locale.vi)?.name ||
    translations[0]?.name ||
    ""
  );
}

function getProductTranslation<
  T extends {
    locale: Locale;
    title: string;
    slug: string;
    excerpt: string | null;
    content?: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
  },
>(translations: T[], locale: Locale) {
  // Quan trọng: không fallback sang VI ở trang edit.
  // Nếu đang mở ?locale=en mà chưa có bản EN thì trả null để form trống.
  return translations.find((item) => item.locale === locale) || null;
}

function moneyToString(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function mapProductAttributeValues(
  items: {
    attributeId: string;
    attributeValueId: string | null;
    valueText: string | null;
    valueNumber: unknown;
    valueBoolean: boolean | null;
    attribute: {
      type: "SELECT" | "MULTI_SELECT" | "TEXT" | "NUMBER" | "BOOLEAN" | "COLOR";
    };
  }[]
): ProductEditAttributeValue[] {
  const grouped = new Map<string, ProductEditAttributeValue>();

  for (const item of items) {
    if (item.attribute.type === "MULTI_SELECT") {
      const existed = grouped.get(item.attributeId);

      if (existed && Array.isArray(existed.value)) {
        if (item.attributeValueId) {
          existed.value.push(item.attributeValueId);
        }
      } else {
        grouped.set(item.attributeId, {
          attributeId: item.attributeId,
          type: item.attribute.type,
          value: item.attributeValueId ? [item.attributeValueId] : [],
        });
      }

      continue;
    }

    if (item.attribute.type === "SELECT" || item.attribute.type === "COLOR") {
      grouped.set(item.attributeId, {
        attributeId: item.attributeId,
        type: item.attribute.type,
        value: item.attributeValueId || "",
      });

      continue;
    }

    if (item.attribute.type === "BOOLEAN") {
      grouped.set(item.attributeId, {
        attributeId: item.attributeId,
        type: item.attribute.type,
        value:
          item.valueBoolean === null || item.valueBoolean === undefined
            ? ""
            : item.valueBoolean,
      });

      continue;
    }

    if (item.attribute.type === "NUMBER") {
      grouped.set(item.attributeId, {
        attributeId: item.attributeId,
        type: item.attribute.type,
        value:
          item.valueNumber === null || item.valueNumber === undefined
            ? ""
            : String(item.valueNumber),
      });

      continue;
    }

    grouped.set(item.attributeId, {
      attributeId: item.attributeId,
      type: item.attribute.type,
      value: item.valueText || "",
    });
  }

  return Array.from(grouped.values());
}

export async function getProductFormCategories(): Promise<
  ProductFormCategoryItem[]
> {
  const categories = await prisma.category.findMany({
    where: {
      type: ContentType.PRODUCT,
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
      attributes: {
        orderBy: [{ sortOrder: "asc" }],
        select: {
          level: true,
          sortOrder: true,
          attribute: {
            select: {
              id: true,
              code: true,
              type: true,
              translations: {
                select: {
                  locale: true,
                  name: true,
                },
              },
              values: {
                orderBy: [{ sortOrder: "asc" }],
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
          },
        },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    nameVi: getName(category.translations, Locale.vi) || category.slug,
    nameEn: getName(category.translations, Locale.en),
    attributes: category.attributes.map((item) => ({
      id: item.attribute.id,
      code: item.attribute.code,
      type: item.attribute.type,
      nameVi: getName(item.attribute.translations, Locale.vi),
      nameEn: getName(item.attribute.translations, Locale.en),
      level: item.level,
      sortOrder: item.sortOrder,
      values: item.attribute.values.map((value) => ({
        id: value.id,
        code: value.code,
        nameVi: getName(value.translations, Locale.vi),
        nameEn: getName(value.translations, Locale.en),
        colorHex: value.colorHex,
        image: value.image,
        sortOrder: value.sortOrder,
      })),
    })),
  }));
}

export async function getAdminProducts(): Promise<AdminProductListItem[]> {
  const products = await prisma.product.findMany({
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      sku: true,
      price: true,
      salePrice: true,
      thumbnail: true,
      status: true,
      isFeatured: true,
      updatedAt: true,
      translations: {
        where: {
          locale: Locale.vi,
        },
        take: 1,
        select: {
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
      images: {
        orderBy: [{ sortOrder: "asc" }],
        take: 1,
        select: {
          url: true,
        },
      },
    },
  });

  return products.map((product) => {
    const translation = product.translations[0];

    return {
      id: product.id,
      title: translation?.title || product.sku || "Chưa có tên",
      slug: translation?.slug || "",
      sku: product.sku || "",
      price: moneyToString(product.price),
      salePrice: moneyToString(product.salePrice),
      thumbnail: product.thumbnail || product.images[0]?.url || "",
      status: product.status,
      isFeatured: product.isFeatured,
      categoryName: product.category
        ? getName(product.category.translations, Locale.vi)
        : "",
      updatedAt: product.updatedAt,
    };
  });
}

export async function getAdminProductById(
  id: string,
  locale: Locale = Locale.vi
): Promise<ProductEditData | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      sku: true,
      price: true,
      salePrice: true,
      thumbnail: true,
      categoryId: true,
      isFeatured: true,
      allowIndex: true,
      styleConfig: true,
      translations: {
        select: {
          locale: true,
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          seoTitle: true,
          seoDescription: true,
        },
      },
      images: {
        orderBy: [{ sortOrder: "asc" }],
        select: {
          url: true,
        },
      },
      attributeValues: {
        select: {
          attributeId: true,
          attributeValueId: true,
          valueText: true,
          valueNumber: true,
          valueBoolean: true,
          attribute: {
            select: {
              type: true,
            },
          },
        },
      },
    },
  });

  if (!product) return null;

  const translation = getProductTranslation(product.translations, locale);

  return {
    id: product.id,
    status: product.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    sku: product.sku || "",
    price: moneyToString(product.price),
    salePrice: moneyToString(product.salePrice),
    thumbnail: product.thumbnail || "",
    gallery: product.images.map((image) => image.url),
    categoryId: product.categoryId || "",
    isFeatured: product.isFeatured,
    allowIndex: product.allowIndex,
    styleConfig: product.styleConfig || null,
    translation: {
      locale: locale as "vi" | "en",
      title: translation?.title || "",
      slug: translation?.slug || "",
      excerpt: translation?.excerpt || "",
      content: translation?.content || "",
      seoTitle: translation?.seoTitle || "",
      seoDescription: translation?.seoDescription || "",
    },
    attributeValues: mapProductAttributeValues(product.attributeValues),
  };
}