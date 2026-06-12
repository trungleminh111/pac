import { notFound } from "next/navigation";
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

  const template = product.category?.detailTemplate || "default";

  if (template === "page2") {
    return (
      <ProductDetailPage2
        locale={locale}
        product={product}
        relatedProducts={relatedProducts}
      />
    );
  }

  return (
    <ProductDetailDefault
      locale={locale}
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}