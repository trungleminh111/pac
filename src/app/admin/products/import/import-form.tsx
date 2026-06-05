"use client";

import { useState } from "react";
import Link from "next/link";
import type { ImportState } from "./page";

export default function ImportProductsForm({
  action,
}: {
  action: (formData: FormData) => Promise<ImportState>;
}) {
  const [state, setState] = useState<ImportState>({
    ok: false,
    message: "",
  });

  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await action(formData);
      setState(result);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            Import sản phẩm
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Upload file Excel để tạo nhiều sản phẩm cùng lúc.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/products/import/template"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Tải file mẫu
          </Link>

          <Link
            href="/admin/products"
            className="rounded-xl border px-4 py-2 text-sm font-medium"
          >
            Quay lại
          </Link>
        </div>
      </div>

      {state.message && (
        <div
          className={`whitespace-pre-line rounded-xl px-4 py-3 text-sm ${
            state.ok
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </div>
      )}

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          File Excel
        </label>

        <input
          name="file"
          type="file"
          accept=".xlsx,.xls,.csv"
          required
          className="w-full rounded-xl border px-4 py-3 text-sm"
        />

        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Các cột hỗ trợ:</p>
          <p className="mt-2">
            locale, title, slug, excerpt, content, sku, price, origin, color,
            material, size, thickness, density, hardness, seoTitle,
            seoDescription, status, categoryId, isFeatured, allowIndex
          </p>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-5 rounded-xl bg-[#2271b1] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Đang import..." : "Import sản phẩm"}
        </button>
      </div>
    </form>
  );
}