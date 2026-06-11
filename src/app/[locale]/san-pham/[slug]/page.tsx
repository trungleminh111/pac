import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProductsByCategory,
} from "@/server/products/product.query";
import type { Locale } from "@/server/products/product.type";
import { ProductDetailDefault } from "@/components/site/product-detail/ProductDetailDefault";
import { ProductDetailPage2 } from "@/components/site/product-detail/ProductDetailPage2";

export default async function ProductDetailPage({
  params,
}: {
  params: {
    locale: Locale;
    slug: string;
  };
}) {
  const { locale, slug } = params;

  const product = await getProductBySlug(locale, slug);

  if (!product) notFound();

  const relatedProducts1 = await getRelatedProductsByCategory(
    locale,
    product.categoryId,
    product.id,
    4
  );

  const template = product.category?.detailTemplate || "default";

  if (template === "page2") {
    return (
      <ProductDetailPage2
        locale={locale}
        product={product}
        relatedProducts={relatedProducts1}
      />
    );
  }

  return (
    <ProductDetailDefault
      locale={locale}
      product={product}
      relatedProducts={relatedProducts1}
    />
  );
}