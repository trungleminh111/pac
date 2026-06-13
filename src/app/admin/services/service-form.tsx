"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Save } from "lucide-react";
import { MediaPicker } from "@/components/admin/media-picker";
import { PostEditor } from "@/components/admin/post-editor";
import { saveServiceAction } from "./service-actions";
import type {
  AdminLocale,
  AdminServiceDetail,
  AdminServiceStatus,
  ServiceCategoryOption,
} from "./service.type";

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

export function ServiceForm({
  mode,
  activeLocale,
  service,
  categories,
}: {
  mode: "create" | "edit";
  activeLocale: AdminLocale;
  service: AdminServiceDetail | null;
  categories: ServiceCategoryOption[];
}) {
  const [clientMessage, setClientMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [status, setStatus] = useState<AdminServiceStatus>(
    service?.status || "DRAFT"
  );

  const [thumbnail, setThumbnail] = useState(service?.thumbnail || "");
  const [icon, setIcon] = useState(service?.icon || "");
  const [title, setTitle] = useState(service?.title || "");
  const [slug, setSlug] = useState(service?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(service?.slug));
  const [content, setContent] = useState(service?.content || "");

  function validateForm() {
    if (!title.trim()) return "Tên dịch vụ là bắt buộc.";
    if (!slug.trim()) return "Slug dịch vụ là bắt buộc.";
    return "";
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const error = validateForm();

    if (error) {
      event.preventDefault();
      setClientMessage(error);
      setSubmitting(false);
      return;
    }

    setClientMessage("");
    setSubmitting(true);
  }

  return (
    <form action={saveServiceAction} onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={service?.id || ""} />
      <input type="hidden" name="locale" value={activeLocale} />
      <input type="hidden" name="thumbnail" value={thumbnail} />
      <input type="hidden" name="icon" value={icon} />
      <input type="hidden" name="content" value={content} />

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            {mode === "create" ? "Thêm dịch vụ" : "Sửa dịch vụ"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý nội dung dịch vụ, icon, ảnh đại diện và SEO song ngữ.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {mode === "edit" && service?.id ? (
            <>
              <Link
                href={`/admin/services/${service.id}/edit?locale=vi`}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                  activeLocale === "vi"
                    ? "border-[#2271b1] bg-[#2271b1] text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                Tiếng Việt
              </Link>

              <Link
                href={`/admin/services/${service.id}/edit?locale=en`}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                  activeLocale === "en"
                    ? "border-[#2271b1] bg-[#2271b1] text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                English
              </Link>
            </>
          ) : (
            <span className="rounded-xl border border-[#2271b1] bg-[#2271b1] px-4 py-2 text-sm font-semibold text-white">
              Tiếng Việt
            </span>
          )}

          <Link
            href="/admin/services"
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Quay lại
          </Link>
        </div>
      </div>

      {clientMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {clientMessage}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Ngôn ngữ dịch vụ
                </label>
                <div className="rounded-xl border bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                  {activeLocale === "vi" ? "Tiếng Việt" : "English"}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Tên dịch vụ
                </label>
                <input
                  name="title"
                  required
                  value={title}
                  onChange={(event) => {
                    const value = event.target.value;
                    setTitle(value);

                    if (!slugTouched) {
                      setSlug(toSlug(value));
                    }
                  }}
                  placeholder="Tên dịch vụ"
                  className="w-full rounded-xl border px-4 py-4 text-2xl font-semibold"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Đường dẫn / Slug
                </label>
                <input
                  name="slug"
                  required
                  value={slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    setSlug(toSlug(event.target.value));
                  }}
                  placeholder="slug-dich-vu"
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                />

                <button
                  type="button"
                  onClick={() => {
                    setSlugTouched(false);
                    setSlug(toSlug(title));
                  }}
                  className="mt-2 rounded-lg border px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Tạo slug theo tên dịch vụ
                </button>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Mô tả ngắn
                </label>
                <textarea
                  name="excerpt"
                  defaultValue={service?.excerpt || ""}
                  rows={3}
                  placeholder="Mô tả ngắn dịch vụ"
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nội dung chi tiết
                </label>

                <PostEditor
                  key={`${service?.id || "new"}-${activeLocale}`}
                  value={content}
                  onChange={setContent}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-semibold">SEO</h3>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                SEO Title
              </label>
              <input
                name="seoTitle"
                defaultValue={service?.seoTitle || ""}
                placeholder="Nhập tiêu đề SEO"
                className="w-full rounded-xl border px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                SEO Description
              </label>
              <textarea
                name="seoDescription"
                defaultValue={service?.seoDescription || ""}
                rows={3}
                placeholder="Nhập mô tả SEO"
                className="w-full rounded-xl border px-4 py-3 text-sm"
              />
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">Xuất bản</div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Trạng thái dịch vụ
                </label>
                <select
                  name="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as AdminServiceStatus)
                  }
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                >
                  <option value="DRAFT">Bản nháp</option>
                  <option value="PUBLISHED">Xuất bản</option>
                  <option value="ARCHIVED">Lưu trữ</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Ngày xuất bản
                </label>
                <input
                  name="publishedAt"
                  type="datetime-local"
                  defaultValue={service?.publishedAt || ""}
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  name="allowIndex"
                  type="checkbox"
                  defaultChecked={service?.allowIndex ?? true}
                />
                Cho Google index
              </label>

              <div className="flex gap-2">
                <button
                  type="submit"
                  name="submitStatus"
                  value="DRAFT"
                  disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {submitting ? "Đang lưu..." : "Lưu nháp"}
                </button>

                <button
                  type="submit"
                  name="submitStatus"
                  value="PUBLISHED"
                  disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  <Eye className="h-4 w-4" />
                  {submitting ? "Đang lưu..." : "Xuất bản"}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">Thông tin</div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Thứ tự hiển thị
                </label>
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={service?.sortOrder ?? 0}
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">Danh mục</div>

            <div className="p-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Chọn danh mục dịch vụ
              </label>
              <select
                name="categoryId"
                defaultValue={service?.categoryId || ""}
                className="w-full rounded-xl border px-4 py-3 text-sm"
              >
                <option value="">Không chọn</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nameVi}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">Icon dịch vụ</div>

            <div className="space-y-4 p-5">
              <label className="block text-sm font-semibold text-slate-700">
                Chọn icon dịch vụ
              </label>
              <MediaPicker value={icon} onChange={setIcon} />
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">Ảnh đại diện</div>

            <div className="space-y-4 p-5">
              <label className="block text-sm font-semibold text-slate-700">
                Chọn ảnh đại diện dịch vụ
              </label>
              <MediaPicker value={thumbnail} onChange={setThumbnail} />
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}