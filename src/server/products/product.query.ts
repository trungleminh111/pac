import { prisma } from "@/lib/prisma";
import type { Locale, ProductCardItem, ProductDetailItem } from "./product.type";

function formatPrice(value: unknown) {
  if (!value) return "";

  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return "";

  return numberValue.toLocaleString("vi-VN");
}

function getCategoryName(
  locale: Locale,
  category?: {
    nameVi: string;
    nameEn: string | null;
  } | null
) {
  if (!category) return "";
  return locale === "vi" ? category.nameVi : category.nameEn || category.nameVi;
}

export async function getHomeProducts(
  locale: Locale = "vi"
): Promise<ProductCardItem[]> {
  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      translations: {
        some: { locale },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
    select: {
      id: true,
      price: true,
      thumbnail: true,
      categoryId: true,
      category: {
        select: {
          id: true,
          slug: true,
          nameVi: true,
          nameEn: true,
          detailTemplate: true,
        },
      },
      translations: {
        where: { locale },
        select: {
          title: true,
          slug: true,
          excerpt: true,
        },
      },
    },
  });

  return products
    .map((product) => {
      const translation = product.translations[0];
      if (!translation) return null;

      return {
        id: product.id,
        title: translation.title,
        slug: translation.slug,
        excerpt: translation.excerpt || "",
        image: product.thumbnail || "/assets/images/products/product-1-1.jpg",
        price: formatPrice(product.price),
        categoryId: product.categoryId,
        categoryName: getCategoryName(locale, product.category),
        categorySlug: product.category?.slug || "",
      };
    })
    .filter((product): product is ProductCardItem => product !== null);
}

export async function getProductsPage(
  locale: Locale = "vi"
): Promise<ProductCardItem[]> {
  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      translations: {
        some: { locale },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      price: true,
      thumbnail: true,
      categoryId: true,
      category: {
        select: {
          id: true,
          slug: true,
          nameVi: true,
          nameEn: true,
          detailTemplate: true,
        },
      },
      translations: {
        where: { locale },
        select: {
          title: true,
          slug: true,
          excerpt: true,
        },
      },
    },
  });

  return products
    .map((product) => {
      const translation = product.translations[0];
      if (!translation) return null;

      return {
        id: product.id,
        title: translation.title,
        slug: translation.slug,
        excerpt: translation.excerpt || "",
        image: product.thumbnail || "/assets/images/products/product-1-1.jpg",
        price: formatPrice(product.price),
        categoryId: product.categoryId,
        categoryName: getCategoryName(locale, product.category),
        categorySlug: product.category?.slug || "",
      };
    })
    .filter((product): product is ProductCardItem => product !== null);
}

export async function getProductBySlug(
  locale: Locale,
  slug: string
): Promise<ProductDetailItem | null> {
  const product = await prisma.product.findFirst({
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
      sku: true,
      price: true,
      thumbnail: true,
      gallery: true,
      origin: true,
      size: true,
      material: true,
      color: true,
      isFeatured: true,
      categoryId: true,
      allowIndex: true,
      publishedAt: true,
      category: {
        select: {
          id: true,
          slug: true,
          nameVi: true,
          nameEn: true,
          detailTemplate: true,
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

  if (!product) return null;

  const translation = product.translations[0];
  if (!translation) return null;

  return {
    id: product.id,
    status: product.status,
    sku: product.sku,
    price: formatPrice(product.price),
    thumbnail: product.thumbnail,
    gallery: product.gallery,
    origin: product.origin,
    size: product.size,
    material: product.material,
    color: product.color,
    isFeatured: product.isFeatured,
    categoryId: product.categoryId,
    allowIndex: product.allowIndex,
    publishedAt: product.publishedAt,
    category: product.category,
    title: translation.title,
    slug: translation.slug,
    excerpt: translation.excerpt || "",
    content: translation.content,
    seoTitle: translation.seoTitle || "",
    seoDescription: translation.seoDescription || "",
  };
}

export async function getProductCategories(locale: Locale = "vi") {
  const categories = await prisma.category.findMany({
    where: {
      type: "PRODUCT",
    },
    orderBy: {
      sortOrder: "asc",
    },
    select: {
      id: true,
      slug: true,
      nameVi: true,
      nameEn: true,
    },
  });

  return categories.map((category) => {
    const label =
      locale === "vi" ? category.nameVi : category.nameEn || category.nameVi;

    return {
      id: category.id,
      label,
      href:
        locale === "vi"
          ? `/vi/san-pham?category=${encodeURIComponent(label)}`
          : `/en/products?category=${encodeURIComponent(label)}`,
    };
  });
}