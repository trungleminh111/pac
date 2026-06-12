import ProductForm from "../product-form";
import { createProductAction } from "../product-actions";
import { getProductFormCategories } from "../product-query";

export default async function CreateProductPage() {
  const categories = await getProductFormCategories();

  return (
    <ProductForm
      mode="create"
      action={createProductAction}
      categories={categories}
      initialData={null}
    />
  );
}