"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";

type Product = {
  id: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  price: any;
  thumbnail: string | null;
  createdAt: Date;
  category: { nameVi: string } | null;
  translations: {
    locale: "vi" | "en";
    title: string;
    slug: string;
  }[];
};

function localeLabel(locale?: string) {
  return locale === "en" ? "EN" : "VI";
}

function localeClass(locale?: string) {
  return locale === "en"
    ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
    : "bg-emerald-50 text-emerald-700 ring-emerald-200";
}

function statusClass(status: string) {
  if (status === "PUBLISHED") return "bg-emerald-50 text-emerald-700";
  if (status === "ARCHIVED") return "bg-slate-100 text-slate-600";
  return "bg-amber-50 text-amber-700";
}

function formatPrice(price: any) {
  if (!price) return "—";
  return Number(price).toLocaleString("vi-VN");
}

export default function ProductsTable({
  products,
  q,
  locale,
  status,
  deleteAction,
}: {
  products: Product[];
  q: string;
  locale: string;
  status: string;
  deleteAction: (formData: FormData) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const allIds = useMemo(() => products.map((item) => item.id), [products]);
  const checkedAll = allIds.length > 0 && selected.length === allIds.length;

  function toggleAll() {
    setSelected(checkedAll ? [] : allIds);
  }

  function toggleOne(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Sản phẩm</h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý sản phẩm đá, giá, hình ảnh và nội dung SEO.
          </p>
        </div>

        <Link
          href="/admin/products/create"
          className="inline-flex items-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white hover:bg-[#195f96]"
        >
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <form className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Tìm theo tên hoặc slug..."
              className="w-full rounded-xl border px-10 py-3 text-sm outline-none focus:border-[#2271b1]"
            />
          </div>

          <select name="locale" defaultValue={locale} className="rounded-xl border px-4 py-3 text-sm">
            <option value="">Tất cả ngôn ngữ</option>
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>

          <select name="status" defaultValue={status} className="rounded-xl border px-4 py-3 text-sm">
            <option value="">Tất cả trạng thái</option>
            <option value="DRAFT">Bản nháp</option>
            <option value="PUBLISHED">Xuất bản</option>
            <option value="ARCHIVED">Lưu trữ</option>
          </select>

          <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            Lọc
          </button>
        </form>
      </div>

      <form action={deleteAction}>
        {selected.map((id) => (
          <input key={id} type="hidden" name="ids" value={id} />
        ))}

        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Đã chọn <strong>{selected.length}</strong> sản phẩm
          </div>

          <button
            type="submit"
            disabled={selected.length === 0}
            onClick={(e) => {
              if (!confirm(`Xóa ${selected.length} sản phẩm đã chọn?`)) {
                e.preventDefault();
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
            Xóa đã chọn
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="w-12 px-5 py-4">
                  <input type="checkbox" checked={checkedAll} onChange={toggleAll} />
                </th>
                <th className="px-5 py-4">Sản phẩm</th>
                <th className="px-5 py-4">Ngôn ngữ</th>
                <th className="px-5 py-4">Giá</th>
                <th className="px-5 py-4">Danh mục</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {products.map((product) => {
                const translation = product.translations[0];

                return (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(product.id)}
                        onChange={() => toggleOne(product.id)}
                      />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt=""
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-slate-100" />
                        )}

                        <div>
                          <div className="font-semibold text-slate-900">
                            {translation?.title || "Chưa có tên"}
                          </div>
                          <div className="text-xs text-slate-500">
                            /{translation?.slug || "no-slug"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${localeClass(translation?.locale)}`}>
                        {localeLabel(translation?.locale)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {formatPrice(product.price)}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {product.category?.nameVi || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(product.status)}`}>
                        {product.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="font-medium text-[#2271b1] hover:underline"
                      >
                        Sửa
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </form>
    </div>
  );
}