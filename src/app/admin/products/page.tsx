import Link from "next/link";
import { getAdminProducts } from "./product-query";
import { ProductsTable } from "./products-table";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  const total = products.length;
  const published = products.filter(
    (item) => item.status === "PUBLISHED"
  ).length;
  const draft = products.filter((item) => item.status === "DRAFT").length;
  const featured = products.filter((item) => item.isFeatured).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý sản phẩm
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý sản phẩm, hình ảnh, giá bán và thông số theo danh mục.
          </p>
        </div>

        <Link
          href="/admin/products/create"
          className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Thêm sản phẩm
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Tổng sản phẩm</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{total}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Đã xuất bản</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {published}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Bản nháp</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{draft}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Nổi bật</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {featured}
          </div>
        </div>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}