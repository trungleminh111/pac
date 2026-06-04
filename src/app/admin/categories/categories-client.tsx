"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FolderTree, Pencil, Plus, Search, Trash2 } from "lucide-react";
import type { CategoryState } from "./page";

type CategoryType = "POST" | "PAGE" | "PRODUCT" | "SERVICE" | "PROJECT";

type Category = {
  id: string;
  type: CategoryType;
  slug: string;
  nameVi: string;
  nameEn: string | null;
  detailTemplate: string;
  _count: {
    posts: number;
    products: number;
    services: number;
    projects: number;
  };
};

type Stat = {
  type: CategoryType;
  _count: {
    id: number;
  };
};

const typeOptions: { label: string; value: CategoryType | "" }[] = [
  { label: "Tất cả", value: "" },
  { label: "Bài viết", value: "POST" },
  { label: "Sản phẩm", value: "PRODUCT" },
  { label: "Dịch vụ", value: "SERVICE" },
  { label: "Công trình", value: "PROJECT" },
];

function typeLabel(type: string) {
  if (type === "POST") return "Bài viết";
  if (type === "PRODUCT") return "Sản phẩm";
  if (type === "SERVICE") return "Dịch vụ";
  if (type === "PROJECT") return "Công trình";
  return "Tất cả";
}

function typeBadgeClass(type: string) {
  if (type === "POST") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (type === "PRODUCT") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (type === "SERVICE") return "bg-orange-50 text-orange-700 ring-orange-200";
  if (type === "PROJECT") return "bg-violet-50 text-violet-700 ring-violet-200";
  return "bg-slate-50 text-slate-700 ring-slate-200";
}

function countByType(category: Category) {
  if (category.type === "POST") return category._count.posts;
  if (category.type === "PRODUCT") return category._count.products;
  if (category.type === "SERVICE") return category._count.services;
  if (category.type === "PROJECT") return category._count.projects;
  return 0;
}

function statCount(stats: Stat[], type: CategoryType) {
  return stats.find((item) => item.type === type)?._count.id || 0;
}

function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CategoriesClient({
  categories,
  stats,
  q,
  activeType,
  action,
  deleteAction,
}: {
  categories: Category[];
  stats: Stat[];
  q: string;
  activeType: string;
  action: (
    prevState: CategoryState,
    formData: FormData
  ) => Promise<CategoryState>;
  deleteAction: (formData: FormData) => void;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isRefreshing, startTransition] = useTransition();

  const [state, formAction] = useFormState(action, {
    ok: false,
    message: "",
    nonce: 0,
  });

  const pending = false;

  const [nameVi, setNameVi] = useState("");
  const [slug, setSlug] = useState("");
  const [createType, setCreateType] = useState<CategoryType>(
    ["POST", "PRODUCT", "SERVICE", "PROJECT"].includes(activeType)
      ? (activeType as CategoryType)
      : "POST"
  );

  useEffect(() => {
    if (["POST", "PRODUCT", "SERVICE", "PROJECT"].includes(activeType)) {
      setCreateType(activeType as CategoryType);
    }
  }, [activeType]);

  useEffect(() => {
    if (!state.ok || !state.nonce) return;

    formRef.current?.reset();
    setNameVi("");
    setSlug("");

    startTransition(() => {
      router.refresh();
    });
  }, [state.nonce, state.ok, router]);

  const total = stats.reduce((sum, item) => sum + item._count.id, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            Quản lý danh mục
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý danh mục một cấp cho bài viết, sản phẩm, dịch vụ và công trình.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Tất cả</div>
          <div className="mt-2 text-2xl font-bold">{total}</div>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Bài viết</div>
          <div className="mt-2 text-2xl font-bold">{statCount(stats, "POST")}</div>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Sản phẩm</div>
          <div className="mt-2 text-2xl font-bold">{statCount(stats, "PRODUCT")}</div>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Dịch vụ</div>
          <div className="mt-2 text-2xl font-bold">{statCount(stats, "SERVICE")}</div>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Công trình</div>
          <div className="mt-2 text-2xl font-bold">{statCount(stats, "PROJECT")}</div>
        </div>
      </div>

      {state.message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${state.ok
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-red-200 bg-red-50 text-red-700"
            }`}
        >
          {state.message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <form
          ref={formRef}
          action={formAction}
          className="rounded-2xl border bg-white p-5 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2271b1]">
              <FolderTree className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-950">Thêm danh mục</h2>
              <p className="text-sm text-slate-500">Chọn loại danh mục cần tạo</p>
            </div>
          </div>

          <div className="space-y-4">
            <select
              name="type"
              value={createType}
              onChange={(e) => setCreateType(e.target.value as CategoryType)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
            >
              <option value="POST">Bài viết</option>
              <option value="PRODUCT">Sản phẩm</option>
              <option value="SERVICE">Dịch vụ</option>
              <option value="PROJECT">Công trình</option>
            </select>

            <input
              name="nameVi"
              required
              value={nameVi}
              onChange={(e) => {
                setNameVi(e.target.value);
                setSlug(toSlug(e.target.value));
              }}
              placeholder="Tên tiếng Việt"
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
            />

            <input
              name="nameEn"
              placeholder="Tên English"
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
            />

            <input
              name="slug"
              required
              value={slug}
              onChange={(e) => setSlug(toSlug(e.target.value))}
              placeholder="slug-danh-muc"
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
            />

            {createType === "PRODUCT" && (
              <select
                name="detailTemplate"
                defaultValue="default"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              >
                <option value="default">Giao diện mặc định</option>
                <option value="page2">Giao diện chi tiết 2</option>
              </select>
            )}

            <button
              disabled={pending || isRefreshing}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              {pending || isRefreshing ? "Đang lưu..." : "Thêm danh mục"}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <form className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Tìm theo tên hoặc slug..."
                  className="w-full rounded-xl border px-10 py-3 text-sm outline-none focus:border-[#2271b1]"
                />
              </div>

              <select
                name="type"
                defaultValue={activeType}
                className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              >
                {typeOptions.map((item) => (
                  <option key={item.value || "ALL"} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
                Tìm kiếm
              </button>
            </form>
          </div>

          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4">
              <h2 className="font-semibold text-slate-950">Danh sách danh mục</h2>
              <p className="mt-1 text-sm text-slate-500">
                Đang hiển thị {categories.length} danh mục
              </p>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-5 py-4">Tên danh mục</th>
                  <th className="px-5 py-4">Loại</th>
                  <th className="px-5 py-4">Slug</th>
                  <th className="px-5 py-4">Template</th>
                  <th className="px-5 py-4">Đang dùng</th>
                  <th className="px-5 py-4 text-right">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">
                        {category.nameVi}
                      </div>
                      <div className="text-xs text-slate-500">
                        {category.nameEn || "—"}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${typeBadgeClass(
                          category.type
                        )}`}
                      >
                        {typeLabel(category.type)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600">/{category.slug}</td>

                    <td className="px-5 py-4 text-slate-600">
                      {category.type === "PRODUCT" ? category.detailTemplate : "—"}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {countByType(category)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
                          className="inline-flex items-center gap-1 font-medium text-[#2271b1] hover:underline"
                        >
                          <Pencil className="h-4 w-4" />
                          Sửa
                        </Link>

                        <form action={deleteAction}>
                          <input type="hidden" name="id" value={category.id} />
                          <button
                            type="submit"
                            onClick={(e) => {
                              if (
                                countByType(category) > 0 ||
                                !confirm(`Xóa danh mục "${category.nameVi}"?`)
                              ) {
                                e.preventDefault();
                              }
                            }}
                            disabled={countByType(category) > 0}
                            className="inline-flex items-center gap-1 font-medium text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 className="h-4 w-4" />
                            Xóa
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}

                {categories.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-slate-500"
                    >
                      Không tìm thấy danh mục nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}