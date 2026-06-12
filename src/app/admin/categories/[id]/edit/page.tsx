import { notFound } from "next/navigation";
import { CategoryForm } from "../../category-form";
import { getAdminCategoryFormData } from "../../category-query";

type Props = {
  params: {
    id: string;
  };
};

export default async function EditCategoryPage({ params }: Props) {
  const data = await getAdminCategoryFormData({
    id: params.id,
  });

  if (!data.category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sửa category</h1>
        <p className="mt-1 text-sm text-slate-500">
          Cập nhật category và bộ thông số áp dụng cho sản phẩm.
        </p>
      </div>

      <CategoryForm
        mode="edit"
        category={data.category}
        parents={data.parents}
        attributes={data.attributes}
      />
    </div>
  );
}