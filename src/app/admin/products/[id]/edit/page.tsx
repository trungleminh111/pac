import { Locale } from "@prisma/client";
import { notFound } from "next/navigation";
import ProductForm from "../../product-form";
import { updateProductAction } from "../../product-actions";
import {
  getAdminProductById,
  getProductFormCategories,
} from "../../product-query";

type Props = {
  params: {
    id: string;
  };
  searchParams?: {
    locale?: string;
  };
};

export default async function EditProductPage({ params, searchParams }: Props) {
  const locale = searchParams?.locale === "en" ? Locale.en : Locale.vi;

  const [product, categories] = await Promise.all([
    getAdminProductById(params.id, locale),
    getProductFormCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <ProductForm
      key={`${params.id}-${locale}`}
      mode="edit"
      action={updateProductAction}
      categories={categories}
      initialData={product}
    />
  );
}