"use client";

import Link from "next/link";
import { FileText, Pencil, Plus, Search } from "lucide-react";
import type { Page, PageTranslation } from "@prisma/client";

type PageWithTranslations = Page & {
  translations: PageTranslation[];
};

function typeLabel(type: string) {
  if (type === "POLICY") return "Chính sách";
  if (type === "LANDING") return "Landing";
  return "Trang thường";
}

function typeBadgeClass(type: string) {
  if (type === "POLICY") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (type === "LANDING") return "bg-violet-50 text-violet-700 ring-violet-200";
  return "bg-slate-50 text-slate-700 ring-slate-200";
}

function statusBadgeClass(status: string) {
  if (status === "PUBLISHED")
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "ARCHIVED") return "bg-red-50 text-red-700 ring-red-200";
  return "bg-orange-50 text-orange-700 ring-orange-200";
}

export function PagesClient({ pages }: { pages: PageWithTranslations[] }) {
  const total = pages.length;
  const published = pages.filter((page) => page.status === "PUBLISHED").length;
  const draft = pages.filter((page) => page.status === "DRAFT").length;
  const policy = pages.filter((page) => page.type === "POLICY").length;
  const landing = pages.filter((page) => page.type === "LANDING").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Quản lý Pages</h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý trang nội dung, chính sách, landing page và SEO.
          </p>
        </div>

        <Link
          href="/admin/pages/new/edit"
          className="inline-flex items-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Thêm page
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Tất cả</div>
          <div className="mt-2 text-2xl font-bold">{total}</div>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Đã publish</div>
          <div className="mt-2 text-2xl font-bold">{published}</div>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Draft</div>
          <div className="mt-2 text-2xl font-bold">{draft}</div>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Chính sách</div>
          <div className="mt-2 text-2xl font-bold">{policy}</div>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Landing</div>
          <div className="mt-2 text-2xl font-bold">{landing}</div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <form className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              placeholder="Tìm theo title hoặc slug..."
              className="w-full rounded-xl border px-10 py-3 text-sm outline-none focus:border-[#2271b1]"
            />
          </div>

          <select
            name="type"
            className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
          >
            <option value="">Tất cả</option>
            <option value="NORMAL">Trang thường</option>
            <option value="POLICY">Chính sách</option>
            <option value="LANDING">Landing</option>
          </select>

          <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            Tìm kiếm
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2271b1]">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-950">Danh sách pages</h2>
              <p className="mt-1 text-sm text-slate-500">
                Đang hiển thị {pages.length} page
              </p>
            </div>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-5 py-4">Tiêu đề</th>
              <th className="px-5 py-4">Loại</th>
              <th className="px-5 py-4">Slug</th>
              <th className="px-5 py-4">Template</th>
              <th className="px-5 py-4">Trạng thái</th>
              <th className="px-5 py-4 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {pages.map((page) => {
              const vi = page.translations.find((item) => item.locale === "vi");
              const en = page.translations.find((item) => item.locale === "en");
              const translation = vi ?? en;

              return (
                <tr key={page.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900">
                      {translation?.title ?? "Untitled"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {translation?.seoTitle ?? "Chưa có SEO title"}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${typeBadgeClass(
                        page.type
                      )}`}
                    >
                      {typeLabel(page.type)}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    /{translation?.slug ?? "—"}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {page.template}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusBadgeClass(
                        page.status
                      )}`}
                    >
                      {page.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <Link
                        href={`/admin/pages/${page.id}/edit`}
                        className="inline-flex items-center gap-1 font-medium text-[#2271b1] hover:underline"
                      >
                        <Pencil className="h-4 w-4" />
                        Sửa
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}

            {pages.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                  Không tìm thấy page nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}