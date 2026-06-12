import Link from "next/link";
import { deleteProductAction } from "./product-actions";
import type { AdminProductListItem } from "./product-form.type";

type Props = {
  products: AdminProductListItem[];
};

function formatPrice(value: string) {
  if (!value) return "—";
  return Number(value).toLocaleString("vi-VN") + "đ";
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "PUBLISHED"
      ? "border-green-200 bg-green-50 text-green-700"
      : status === "ARCHIVED"
        ? "border-slate-200 bg-slate-50 text-slate-600"
        : "border-amber-200 bg-amber-50 text-amber-700";

  const label =
    status === "PUBLISHED"
      ? "Đã xuất bản"
      : status === "ARCHIVED"
        ? "Lưu trữ"
        : "Bản nháp";

  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

export function ProductsTable({ products }: Props) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="text-base font-semibold text-slate-900">
          Chưa có sản phẩm nào
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Tạo sản phẩm đầu tiên cho website.
        </p>

        <Link
          href="/admin/products/create"
          className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Thêm sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Sản phẩm</th>
              <th className="px-5 py-3">SKU</th>
              <th className="px-5 py-3">Danh mục</th>
              <th className="px-5 py-3">Giá</th>
              <th className="px-5 py-3">Trạng thái</th>
              <th className="px-5 py-3">Nổi bật</th>
              <th className="px-5 py-3 text-right">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-xl border bg-slate-50">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div>
                      <div className="font-medium text-slate-900">
                        {product.title}
                      </div>
                      {product.slug && (
                        <code className="mt-1 block text-xs text-slate-500">
                          {product.slug}
                        </code>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {product.sku || "—"}
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {product.categoryName || "—"}
                </td>

                <td className="px-5 py-4 text-slate-700">
                  <div>{formatPrice(product.price)}</div>
                  {product.salePrice && (
                    <div className="text-xs text-red-600">
                      Sale: {formatPrice(product.salePrice)}
                    </div>
                  )}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={product.status} />
                </td>

                <td className="px-5 py-4">
                  {product.isFeatured ? "Có" : "—"}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Sửa
                    </Link>

                    <Link
                      href={`/admin/products/${product.id}/edit?locale=en`}
                      className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50"
                    >
                      EN
                    </Link>

                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Xoá
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}