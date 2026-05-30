"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import type { EditCategoryState } from "./page";

type CategoryType = "POST" | "PRODUCT" | "SERVICE" | "PROJECT";

type Category = {
  id: string;
  type: CategoryType;
  slug: string;
  nameVi: string;
  nameEn: string | null;
};

const typeOptions: { label: string; value: CategoryType }[] = [
  { label: "Bài viết", value: "POST" },
  { label: "Sản phẩm", value: "PRODUCT" },
  { label: "Dịch vụ", value: "SERVICE" },
  { label: "Công trình", value: "PROJECT" },
];

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

export default function EditCategoryForm({
  category,
  action,
}: {
  category: Category;
  action: (
    prevState: EditCategoryState,
    formData: FormData
  ) => Promise<EditCategoryState>;
}) {
  const router = useRouter();

  const [state, formAction, pending] = useActionState(action, {
    ok: false,
    message: "",
  });

  const [nameVi, setNameVi] = useState(category.nameVi);
  const [slug, setSlug] = useState(category.slug);

  useEffect(() => {
    if (state.ok) {
      router.push(`/admin/categories?type=${category.type}`);
      router.refresh();
    }
  }, [state.ok, router, category.type]);

  return (
    <form action={formAction} className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Sửa danh mục</h1>
          <p className="mt-1 text-sm text-slate-500">
            Cập nhật danh mục một cấp.
          </p>
        </div>

        <Link
          href={`/admin/categories?type=${category.type}`}
          className="rounded-xl border px-4 py-2 text-sm font-medium"
        >
          Quay lại
        </Link>
      </div>

      {state.message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            state.ok
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </div>
      )}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Loại danh mục
            </label>
            <select
              name="type"
              defaultValue={category.type}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
            >
              {typeOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Tên tiếng Việt
            </label>
            <input
              name="nameVi"
              required
              value={nameVi}
              onChange={(e) => {
                setNameVi(e.target.value);
                setSlug(toSlug(e.target.value));
              }}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Tên English
            </label>
            <input
              name="nameEn"
              defaultValue={category.nameEn || ""}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Slug</label>
            <input
              name="slug"
              required
              value={slug}
              onChange={(e) => setSlug(toSlug(e.target.value))}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
            />
          </div>

          <button
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {pending ? "Đang cập nhật..." : "Cập nhật danh mục"}
          </button>
        </div>
      </div>
    </form>
  );
}