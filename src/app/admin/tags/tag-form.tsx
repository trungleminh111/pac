"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { saveTagAction } from "./tag-actions";
import type { AdminTagDetail } from "./tag.type";

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
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function TagForm({
  mode,
  tag,
}: {
  mode: "create" | "edit";
  tag: AdminTagDetail | null;
}) {
  const [nameVi, setNameVi] = useState(tag?.nameVi || "");
  const [nameEn, setNameEn] = useState(tag?.nameEn || "");

  const [slugVi, setSlugVi] = useState(tag?.slugVi || tag?.slug || "");
  const [slugEn, setSlugEn] = useState(tag?.slugEn || "");

  const [slugViTouched, setSlugViTouched] = useState(Boolean(tag?.slugVi || tag?.slug));
  const [slugEnTouched, setSlugEnTouched] = useState(Boolean(tag?.slugEn));

  const baseSlug = useMemo(() => {
    return slugVi || slugEn || toSlug(nameVi || nameEn);
  }, [slugVi, slugEn, nameVi, nameEn]);

  return (
    <form action={saveTagAction} className="space-y-6">
      <input type="hidden" name="id" value={tag?.id || ""} />
      <input type="hidden" name="slug" value={baseSlug} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {mode === "create" ? "Thêm tag" : "Sửa tag"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tag dùng để phân nhóm bài viết/tin tức theo chủ đề.
          </p>
        </div>

        <Link
          href="/admin/tags"
          className="rounded-xl border px-4 py-2 text-sm font-medium"
        >
          Quay lại
        </Link>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tên tag Tiếng Việt <span className="text-red-500">*</span>
              </label>

              <input
                name="nameVi"
                required
                value={nameVi}
                onChange={(event) => {
                  const value = event.target.value;
                  setNameVi(value);

                  if (!slugViTouched) {
                    setSlugVi(toSlug(value));
                  }
                }}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                placeholder="VD: Đá marble"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Slug Tiếng Việt
              </label>

              <input
                name="slugVi"
                value={slugVi}
                onChange={(event) => {
                  setSlugViTouched(true);
                  setSlugVi(toSlug(event.target.value));
                }}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                placeholder="da-marble"
              />

              <button
                type="button"
                onClick={() => {
                  setSlugViTouched(false);
                  setSlugVi(toSlug(nameVi));
                }}
                className="mt-2 rounded-lg border px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Tạo slug theo tên VI
              </button>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Mô tả Tiếng Việt
              </label>

              <textarea
                name="descriptionVi"
                defaultValue={tag?.descriptionVi || ""}
                rows={4}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                placeholder="Mô tả ngắn cho tag"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tên tag English
              </label>

              <input
                name="nameEn"
                value={nameEn}
                onChange={(event) => {
                  const value = event.target.value;
                  setNameEn(value);

                  if (!slugEnTouched) {
                    setSlugEn(toSlug(value));
                  }
                }}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                placeholder="VD: Marble"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Slug English
              </label>

              <input
                name="slugEn"
                value={slugEn}
                onChange={(event) => {
                  setSlugEnTouched(true);
                  setSlugEn(toSlug(event.target.value));
                }}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                placeholder="marble"
              />

              <button
                type="button"
                onClick={() => {
                  setSlugEnTouched(false);
                  setSlugEn(toSlug(nameEn));
                }}
                className="mt-2 rounded-lg border px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Tạo slug theo tên EN
              </button>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Mô tả English
              </label>

              <textarea
                name="descriptionEn"
                defaultValue={tag?.descriptionEn || ""}
                rows={4}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                placeholder="Short tag description"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Thứ tự
            </label>

            <input
              name="sortOrder"
              type="number"
              defaultValue={tag?.sortOrder ?? 0}
              min={0}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={tag?.isActive ?? true}
              />
              Hiển thị tag
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Link
          href="/admin/tags"
          className="rounded-xl border px-5 py-3 text-sm font-semibold"
        >
          Huỷ
        </Link>

        <button
          type="submit"
          className="rounded-xl bg-[#2271b1] px-5 py-3 text-sm font-semibold text-white"
        >
          {mode === "create" ? "Tạo tag" : "Lưu tag"}
        </button>
      </div>
    </form>
  );
}