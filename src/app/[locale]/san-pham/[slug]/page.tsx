import { notFound } from "next/navigation";
import {
  getHomeProducts,
  getProductBySlug,
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
  const relatedProducts = await getHomeProducts(locale);
console.log("TEMPLATE:", product.category?.detailTemplate);
  if (!product) notFound();

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