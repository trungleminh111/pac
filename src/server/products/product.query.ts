import { prisma } from "@/lib/prisma";
import { ContentType, Locale as PrismaLocale } from "@prisma/client";
import type {
  Locale,
  ProductAttributeItem,
  ProductCardItem,
  ProductCategoryItem,
  ProductDetailItem,
  ProductStyleConfig,
  ProductsPageData,
  PublishStatus,
} from "./product.type";

const DEFAULT_PAGE_SIZE = 12;

type AttributeInputTypeValue =
  | "SELECT"
  | "MULTI_SELECT"
  | "TEXT"
  | "NUMBER"
  | "BOOLEAN"
  | "COLOR";

type TranslationLike = {
  locale: PrismaLocale;
  name?: string;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: unknown;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

function toPrismaLocale(locale: Locale): PrismaLocale {
  return locale === "en" ? PrismaLocale.en : PrismaLocale.vi;
}

function getLocalizedName(
  translations: { locale: PrismaLocale; name: string }[],
  locale: Locale
) {
  const prismaLocale = toPrismaLocale(locale);

  return translations.find((item) => item.locale === prismaLocale)?.name || "";
}

function getLocalizedTranslation<T extends TranslationLike>(
  translations: T[],
  locale: Locale
) {
  const prismaLocale = toPrismaLocale(locale);

  return translations.find((item) => item.locale === prismaLocale) || null;
}

function normalizeContent(value: unknown): ProductDetailItem["content"] {
  if (value === null || value === undefined) {
    return "" as ProductDetailItem["content"];
  }

  return value as ProductDetailItem["content"];
}

function numberFromMoney(value: unknown): number | null {
  if (value === null || value === undefined) return null;

  const raw = String(value).trim();

  if (!raw) return null;

  const number = Number(raw);

  if (Number.isFinite(number)) return number;

  const clean = raw.replace(/[^\d.-]/g, "");
  const fallback = Number(clean);

  return Number.isFinite(fallback) ? fallback : null;
}

function formatMoney(value: unknown, locale: Locale = "vi") {
  const number = numberFromMoney(value);

  if (number === null) return "";

  if (locale === "en") {
    return `${new Intl.NumberFormat("en-US").format(number)} VND`;
  }

  return `${new Intl.NumberFormat("vi-VN").format(number)} ₫`;
}

type ProductImageCropConfig = {
  url: string;
  imageLeftPct: number;
  imageTopPct: number;
  imageWidthPct: number;
  imageHeightPct: number;
};

type ProductStyleConfigWithCrop = ProductStyleConfig & {
  thumbnailCrop?: ProductImageCropConfig | null;
};

function toRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function parseJsonObject(value: unknown): Record<string, unknown> | null {
  if (!value) return null;

  if (typeof value === "string") {
    try {
      return toRecord(JSON.parse(value));
    } catch {
      return null;
    }
  }

  return toRecord(value);
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const number = Number(value);

    return Number.isFinite(number) ? number : null;
  }

  return null;
}

function normalizeThumbnailCrop(value: unknown): ProductImageCropConfig | null {
  const crop = toRecord(value);

  if (!crop) return null;

  const url = typeof crop.url === "string" ? crop.url : "";
  const imageLeftPct = toFiniteNumber(crop.imageLeftPct);
  const imageTopPct = toFiniteNumber(crop.imageTopPct);
  const imageWidthPct = toFiniteNumber(crop.imageWidthPct);
  const imageHeightPct = toFiniteNumber(crop.imageHeightPct);

  if (
    !url ||
    imageLeftPct === null ||
    imageTopPct === null ||
    imageWidthPct === null ||
    imageHeightPct === null ||
    imageWidthPct <= 0 ||
    imageHeightPct <= 0
  ) {
    return null;
  }

  return {
    url,
    imageLeftPct,
    imageTopPct,
    imageWidthPct,
    imageHeightPct,
  };
}

function safeStyleConfig(value: unknown): ProductStyleConfig | null {
  const config = parseJsonObject(value);

  if (!config) return null;

  const styleConfig: ProductStyleConfigWithCrop = {
    ...(config as ProductStyleConfig),
  };

  const thumbnailCrop = normalizeThumbnailCrop(config.thumbnailCrop);

  if (thumbnailCrop) {
    styleConfig.thumbnailCrop = thumbnailCrop;
  } else if ("thumbnailCrop" in styleConfig) {
    delete styleConfig.thumbnailCrop;
  }

  return styleConfig as ProductStyleConfig;
}

function getGallery(product: {
  thumbnail: string | null;
  images: { url: string }[];
}) {
  const gallery = product.images.map((image) => image.url).filter(Boolean);

  if (gallery.length) return gallery;

  return product.thumbnail ? [product.thumbnail] : [];
}

function getCardImage(product: {
  thumbnail: string | null;
  images: { url: string }[];
}) {
  return product.thumbnail || product.images[0]?.url || "";
}

function mapCategory(
  category:
    | {
        id: string;
        slug: string;
        detailTemplate: string;
        translations: { locale: PrismaLocale; name: string }[];
      }
    | null,
  locale: Locale
): ProductCategoryItem | null {
  if (!category) return null;

  const nameVi =
    category.translations.find((item) => item.locale === PrismaLocale.vi)
      ?.name || category.slug;

  const nameEn =
    category.translations.find((item) => item.locale === PrismaLocale.en)
      ?.name || null;

  const localizedName = getLocalizedName(category.translations, locale);

  return {
    id: category.id,
    slug: category.slug,
    nameVi,
    nameEn,
    name: localizedName || category.slug,
    detailTemplate: category.detailTemplate || "default",
  };
}

function mapProductAttributes(
  attributeValues: {
    attributeId: string;
    attributeValueId: string | null;
    valueText: string | null;
    valueNumber: unknown;
    valueBoolean: boolean | null;
    attribute: {
      id: string;
      code: string;
      type: AttributeInputTypeValue;
      sortOrder: number;
      translations: { locale: PrismaLocale; name: string }[];
    };
    attributeValue: {
      id: string;
      code: string;
      colorHex: string | null;
      image: string | null;
      translations: { locale: PrismaLocale; name: string }[];
    } | null;
  }[],
  locale: Locale
): ProductAttributeItem[] {
  const map = new Map<string, ProductAttributeItem>();

  const sorted = [...attributeValues].sort((a, b) => {
    return a.attribute.sortOrder - b.attribute.sortOrder;
  });

  for (const item of sorted) {
    const attributeName =
      getLocalizedName(item.attribute.translations, locale) ||
      item.attribute.code;

    const nameVi =
      item.attribute.translations.find(
        (translation) => translation.locale === PrismaLocale.vi
      )?.name || item.attribute.code;

    const nameEn =
      item.attribute.translations.find(
        (translation) => translation.locale === PrismaLocale.en
      )?.name || "";

    let displayValue = "";
    let colorHex: string | null = null;
    let image: string | null = null;

    if (item.attributeValue) {
      displayValue =
        getLocalizedName(item.attributeValue.translations, locale) ||
        item.attributeValue.code;

      colorHex = item.attributeValue.colorHex;
      image = item.attributeValue.image;
    } else if (item.valueText) {
      displayValue = item.valueText;
    } else if (item.valueNumber !== null && item.valueNumber !== undefined) {
      displayValue = String(item.valueNumber);
    } else if (item.valueBoolean !== null && item.valueBoolean !== undefined) {
      displayValue =
        locale === "en"
          ? item.valueBoolean
            ? "Yes"
            : "No"
          : item.valueBoolean
            ? "Có"
            : "Không";
    }

    if (!displayValue) continue;

    const existed = map.get(item.attributeId);

    if (existed) {
      existed.values.push(displayValue);
      existed.value = existed.values.join(", ");

      if (!existed.colorHex && colorHex) {
        existed.colorHex = colorHex;
      }

      if (!existed.image && image) {
        existed.image = image;
      }

      continue;
    }

    map.set(item.attributeId, {
      id: item.attribute.id,
      code: item.attribute.code,
      type: item.attribute.type,
      name: attributeName,
      nameVi,
      nameEn,
      value: displayValue,
      values: [displayValue],
      colorHex,
      image,
    });
  }

  return Array.from(map.values());
}

function getAttributeText(
  attributes: ProductAttributeItem[],
  code: string
): string | null {
  return attributes.find((item) => item.code === code)?.value || null;
}

function productCardSelect(locale: Locale) {
  return {
    id: true,
    price: true,
    salePrice: true,
    thumbnail: true,
    categoryId: true,
    styleConfig: true,
    translations: {
      where: {
        locale: toPrismaLocale(locale),
      },
      take: 1,
      select: {
        locale: true,
        title: true,
        slug: true,
        excerpt: true,
      },
    },
    category: {
      select: {
        id: true,
        slug: true,
        detailTemplate: true,
        translations: {
          select: {
            locale: true,
            name: true,
          },
        },
      },
    },
    images: {
      orderBy: [{ sortOrder: "asc" as const }],
      take: 1,
      select: {
        url: true,
      },
    },
  };
}

function productDetailSelect(locale: Locale) {
  return {
    id: true,
    status: true,
    sku: true,
    price: true,
    salePrice: true,
    thumbnail: true,
    categoryId: true,
    allowIndex: true,
    publishedAt: true,
    isFeatured: true,
    styleConfig: true,
    translations: {
      where: {
        locale: toPrismaLocale(locale),
      },
      take: 1,
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
    category: {
      select: {
        id: true,
        slug: true,
        detailTemplate: true,
        translations: {
          select: {
            locale: true,
            name: true,
          },
        },
      },
    },
    images: {
      orderBy: [{ sortOrder: "asc" as const }],
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
            id: true,
            code: true,
            type: true,
            sortOrder: true,
            translations: {
              select: {
                locale: true,
                name: true,
              },
            },
          },
        },
        attributeValue: {
          select: {
            id: true,
            code: true,
            colorHex: true,
            image: true,
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
  };
}

function mapProductCard(
  product: {
    id: string;
    price: unknown;
    salePrice: unknown;
    thumbnail: string | null;
    categoryId: string | null;
    styleConfig: unknown;
    translations: {
      locale: PrismaLocale;
      title: string;
      slug: string;
      excerpt: string | null;
    }[];
    category: {
      id: string;
      slug: string;
      detailTemplate: string;
      translations: { locale: PrismaLocale; name: string }[];
    } | null;
    images: { url: string }[];
  },
  locale: Locale
): ProductCardItem {
  const translation = getLocalizedTranslation(product.translations, locale);
  const category = mapCategory(product.category, locale);

  return {
    id: product.id,
    title:
      translation?.title ||
      (locale === "en" ? "Untitled product" : "Chưa có tên"),
    slug: translation?.slug || "",
    excerpt: translation?.excerpt || "",
    image: getCardImage(product),
    price: formatMoney(product.price, locale),
    salePrice: formatMoney(product.salePrice, locale),
    categoryId: product.categoryId,
    categoryName: category?.name || "",
    categorySlug: category?.slug || "",
    styleConfig: safeStyleConfig(product.styleConfig),
  };
}

export async function getProductCategories(
  locale: Locale = "vi"
): Promise<ProductCategoryItem[]> {
  const categories = await prisma.category.findMany({
    where: {
      type: ContentType.PRODUCT,
      isActive: true,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      detailTemplate: true,
      translations: {
        select: {
          locale: true,
          name: true,
        },
      },
    },
  });

  return categories
    .map((category) => mapCategory(category, locale))
    .filter(Boolean) as ProductCategoryItem[];
}

export async function getProductsPage({
  locale = "vi",
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  categorySlug,
}: {
  locale?: Locale;
  page?: number;
  pageSize?: number;
  categorySlug?: string;
} = {}): Promise<ProductsPageData> {
  const prismaLocale = toPrismaLocale(locale);
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const skip = (safePage - 1) * safePageSize;

  const where: any = {
    status: "PUBLISHED",
    translations: {
      some: {
        locale: prismaLocale,
      },
    },
  };

  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    };
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [
        { isFeatured: "desc" },
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      skip,
      take: safePageSize,
      select: productCardSelect(locale),
    }),
    prisma.product.count({ where }),
    getProductCategories(locale),
  ]);

  return {
    products: products.map((product) => mapProductCard(product, locale)),
    categories,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages: Math.ceil(total / safePageSize),
  };
}

export async function getFeaturedProducts(
  locale: Locale = "vi",
  take = 8
): Promise<ProductCardItem[]> {
  const prismaLocale = toPrismaLocale(locale);

  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      isFeatured: true,
      translations: {
        some: {
          locale: prismaLocale,
        },
      },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take,
    select: productCardSelect(locale),
  });

  return products.map((product) => mapProductCard(product, locale));
}

export async function getHomeProducts(
  locale: Locale = "vi",
  take = 4
): Promise<ProductCardItem[]> {
  const prismaLocale = toPrismaLocale(locale);

  const featuredProducts = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      isFeatured: true,
      translations: {
        some: {
          locale: prismaLocale,
        },
      },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take,
    select: productCardSelect(locale),
  });

  if (featuredProducts.length > 0) {
    return featuredProducts.map((product) => mapProductCard(product, locale));
  }

  const latestProducts = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      translations: {
        some: {
          locale: prismaLocale,
        },
      },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take,
    select: productCardSelect(locale),
  });

  return latestProducts.map((product) => mapProductCard(product, locale));
}

export async function getProductBySlug(
  slug: string,
  locale: Locale = "vi"
): Promise<ProductDetailItem | null> {
  const prismaLocale = toPrismaLocale(locale);

  const product = await prisma.product.findFirst({
    where: {
      status: "PUBLISHED",
      translations: {
        some: {
          slug,
          locale: prismaLocale,
        },
      },
    },
    select: productDetailSelect(locale),
  });

  if (!product) return null;

  const translation = getLocalizedTranslation(product.translations, locale);

  if (!translation) return null;

  const category = mapCategory(product.category, locale);
  const gallery = getGallery(product);
  const attributes = mapProductAttributes(product.attributeValues, locale);

  return {
    id: product.id,
    status: product.status as PublishStatus,
    sku: product.sku,
    price: formatMoney(product.price, locale),
    salePrice: formatMoney(product.salePrice, locale),
    thumbnail: product.thumbnail,
    gallery,

    origin: getAttributeText(attributes, "origin"),
    material: getAttributeText(attributes, "material"),
    size: getAttributeText(attributes, "size"),
    thickness: getAttributeText(attributes, "thickness"),
    density: getAttributeText(attributes, "density"),
    hardness: getAttributeText(attributes, "hardness"),
    color: getAttributeText(attributes, "color"),

    attributes,

    styleConfig: safeStyleConfig(product.styleConfig),
    isFeatured: product.isFeatured,
    categoryId: product.categoryId,
    allowIndex: product.allowIndex,
    publishedAt: product.publishedAt,
    category,

    title: translation.title || "",
    slug: translation.slug || "",
    excerpt: translation.excerpt || "",
    content: normalizeContent(translation.content),
    seoTitle: translation.seoTitle || translation.title || "",
    seoDescription: translation.seoDescription || translation.excerpt || "",
  };
}

export async function getRelatedProductsByCategory(
  categoryIdOrOptions:
    | string
    | null
    | undefined
    | {
        categoryId?: string | null;
        excludeProductId?: string;
        productId?: string;
        locale?: Locale;
        take?: number;
      },
  excludeProductIdOrLocale?: string | Locale,
  localeOrTake?: Locale | number,
  takeMaybe?: number
): Promise<ProductCardItem[]> {
  let categoryId: string | null | undefined;
  let excludeProductId = "";
  let locale: Locale = "vi";
  let take = 4;

  if (
    typeof categoryIdOrOptions === "object" &&
    categoryIdOrOptions !== null
  ) {
    categoryId = categoryIdOrOptions.categoryId;
    excludeProductId =
      categoryIdOrOptions.excludeProductId ||
      categoryIdOrOptions.productId ||
      "";
    locale = categoryIdOrOptions.locale || "vi";
    take = categoryIdOrOptions.take || 4;
  } else {
    categoryId = categoryIdOrOptions;

    if (
      excludeProductIdOrLocale === "vi" ||
      excludeProductIdOrLocale === "en"
    ) {
      locale = excludeProductIdOrLocale;
    } else {
      excludeProductId = excludeProductIdOrLocale || "";
    }

    if (localeOrTake === "vi" || localeOrTake === "en") {
      locale = localeOrTake;
    } else if (typeof localeOrTake === "number") {
      take = localeOrTake;
    }

    if (typeof takeMaybe === "number") {
      take = takeMaybe;
    }
  }

  const prismaLocale = toPrismaLocale(locale);

  const where: any = {
    status: "PUBLISHED",
    translations: {
      some: {
        locale: prismaLocale,
      },
    },
  };

  if (excludeProductId) {
    where.id = {
      not: excludeProductId,
    };
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: [
      { isFeatured: "desc" },
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
    take,
    select: productCardSelect(locale),
  });

  return products.map((product) => mapProductCard(product, locale));
}