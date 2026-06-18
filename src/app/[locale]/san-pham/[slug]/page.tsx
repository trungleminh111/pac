import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, absoluteUrl } from "@/lib/seo";
import {
  getProductBySlug,
  getRelatedProductsByCategory,
} from "@/server/products/product.query";
import type { Locale } from "@/server/products/product.type";
import { ProductDetailDefault } from "@/components/site/product-detail/ProductDetailDefault";
import { ProductDetailPage2 } from "@/components/site/product-detail/ProductDetailPage2";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: {
    locale: Locale;
    slug: string;
  };
};

function normalizeLocale(locale: string): Locale {
  return locale === "en" ? "en" : "vi";
}

function productListPath(locale: Locale) {
  return locale === "vi" ? "/vi/san-pham" : "/en/products";
}

function productDetailPath(locale: Locale, slug: string) {
  return locale === "vi"
    ? `/vi/san-pham/${slug}`
    : `/en/products/${slug}`;
}

function getProductImage(product: any) {
  return (
    product.images?.[0]?.url ||
    product.image ||
    product.thumbnail ||
    ""
  );
}

function getProductDescription(product: any) {
  return [
    product.description,
    product.material,
    product.application,
  ]
    .filter(Boolean)
    .join(" ");
}

function getProductAvailability(product: any) {
  if (typeof product.inStock === "boolean") {
    return product.inStock ? "InStock" : "OutOfStock";
  }

  if (typeof product.stock === "number") {
    return product.stock > 0 ? "InStock" : "OutOfStock";
  }

  return "InStock";
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const locale = normalizeLocale(params.locale);
  const slug = decodeURIComponent(params.slug);

  const product = await getProductBySlug(slug, locale);

  if (!product) {
    return {};
  }

  const productAny = product as any;
  const image = getProductImage(productAny);
  const description = getProductDescription(productAny) || productAny.title;
  const price = productAny.price || "Liên hệ";

  return buildMetadata({
    locale,
    path: productDetailPath(locale, slug),
    title: `${productAny.title} - ${price} | P.A.C STONE`,
    description,
    image,
    type: "product",
    alternatePaths: {
      vi: `/vi/san-pham/${slug}`,
      en: `/en/products/${slug}`,
      xDefault: `/vi/san-pham/${slug}`,
    },
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const locale = normalizeLocale(params.locale);
  const slug = decodeURIComponent(params.slug);

  const product = await getProductBySlug(slug, locale);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProductsByCategory({
    categoryId: product.categoryId,
    excludeProductId: product.id,
    locale,
    take: 4,
  });

  const productAny = product as any;
  const productImage = getProductImage(productAny);
  const productDescription = getProductDescription(productAny) || productAny.title;
  const productAvailability = getProductAvailability(productAny);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productAny.title,
    image: absoluteUrl(productImage),
    description: productDescription,
    sku: productAny.sku || productAny.id,
    brand: {
      name: "P.A.C STONE",
    },
    offers: {
      price: productAny.price || "Liên hệ",
      priceCurrency: "VND",
      availability: productAvailability,
    },
  };

  const template = product.category?.detailTemplate || "default";

  if (template === "page2") {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productJsonLd),
          }}
        />

        <ProductDetailPage2
          locale={locale}
          product={product}
          relatedProducts={relatedProducts}
        />
      </>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />

      <ProductDetailDefault
        locale={locale}
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  );
}