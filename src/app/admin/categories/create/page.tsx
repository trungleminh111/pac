import { CategoryForm } from "../category-form";
import { getAdminCategoryFormData } from "../category-query";

export default async function CreateCategoryPage() {
  const data = await getAdminCategoryFormData({});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Thêm category</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tạo category mới. Nếu là category sản phẩm, bạn có thể chọn bộ thông
          số áp dụng.
        </p>
      </div>

      <CategoryForm
        mode="create"
        category={null}
        parents={data.parents}
        attributes={data.attributes}
      />
    </div>
  );
}