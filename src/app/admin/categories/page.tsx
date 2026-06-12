import Link from "next/link";
import { CategoriesBoard } from "./categories-board";
import { getAdminCategories } from "./category-query";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  const total = categories.length;
  const productCount = categories.filter((item) => item.type === "PRODUCT").length;
  const activeCount = categories.filter((item) => item.isActive).length;
  const withAttributesCount = categories.filter(
    (item) => item.type === "PRODUCT" && item.attributesCount > 0
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý category
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Category được chia theo nhóm để dễ quản lý. Có thể kéo thả để sắp
            xếp thứ tự trong từng nhóm.
          </p>
        </div>

        <Link
          href="/admin/categories/create"
          className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Thêm category
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Tổng category</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{total}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Category sản phẩm</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {productCount}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Đang hoạt động</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {activeCount}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Có bộ thông số</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {withAttributesCount}
          </div>
        </div>
      </div>

      <CategoriesBoard categories={categories} />
    </div>
  );
}