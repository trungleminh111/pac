"use client";

import { useEffect, useState } from "react";
import {
  experimental_useFormState as useFormState,
  experimental_useFormStatus as useFormStatus,
} from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { PostEditor } from "@/components/admin/post-editor";
import { MediaPicker } from "@/components/admin/media-picker";
import type { ProjectEditState } from "./page";

type Translation = {
  locale: "vi" | "en";
  title: string;
  slug: string;
  excerpt: string | null;
  content: any;
  seoTitle: string | null;
  seoDescription: string | null;
};

type Project = {
  id: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  thumbnail: string | null;
  clientName: string | null;
  projectType: string | null;
  startedAt: string;
  completedAt: string;
  budget: string | null;
  categoryId: string | null;
  allowIndex: boolean;
  translations: Translation[];
};

type Category = {
  id: string;
  nameVi: string;
  nameEn: string | null;
};

function getHtml(content: any) {
  if (!content) return "";
  if (typeof content === "string") return content;
  return content.html || "";
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

function UpdateButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
    >
      <Save className="h-4 w-4" />
      {pending ? "Đang cập nhật..." : "Cập nhật công trình"}
    </button>
  );
}

export default function ProjectEditForm({
  project,
  categories,
  selectedLocale,
  action,
}: {
  project: Project;
  categories: Category[];
  selectedLocale: "vi" | "en";
  action: (
    prevState: ProjectEditState,
    formData: FormData
  ) => Promise<ProjectEditState>;
}) {
  const router = useRouter();

  const translation = project.translations.find(
    (item) => item.locale === selectedLocale
  );

  const [state, formAction] = useFormState(action, {
    ok: false,
    message: "",
  });

  const [content, setContent] = useState(getHtml(translation?.content));
  const [thumbnail, setThumbnail] = useState(project.thumbnail || "");
  const [title, setTitle] = useState(translation?.title || "");
  const [slug, setSlug] = useState(translation?.slug || "");

  useEffect(() => {
    if (state.ok) {
      router.push("/admin/projects");
      router.refresh();
    }
  }, [state.ok, router]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            Sửa công trình
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Công trình chỉ sử dụng một ảnh đại diện.
          </p>
        </div>

        <Link
          href="/admin/projects"
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

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Ngôn ngữ công trình
              </label>

              <select
                name="locale"
                value={selectedLocale}
                disabled
                className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>

              <input type="hidden" name="locale" value={selectedLocale} />
            </div>

            <div className="space-y-5">
              <input
                name="title"
                required
                value={title}
                onChange={(e) => {
                  const value = e.target.value;
                  setTitle(value);
                  setSlug(toSlug(value));
                }}
                placeholder="Nhập tên công trình"
                className="w-full rounded-xl border px-4 py-4 text-2xl font-semibold outline-none focus:border-[#2271b1]"
              />

              <input
                name="slug"
                required
                value={slug}
                onChange={(e) => setSlug(toSlug(e.target.value))}
                placeholder="slug-cong-trinh"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              />

              <textarea
                name="excerpt"
                rows={3}
                defaultValue={translation?.excerpt || ""}
                placeholder="Mô tả ngắn"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              />

              <PostEditor value={content} onChange={setContent} />
              <input type="hidden" name="content" value={content} />

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="clientName"
                  defaultValue={project.clientName || ""}
                  placeholder="Tên khách hàng"
                  className="rounded-xl border px-4 py-3 text-sm"
                />

                <input
                  name="projectType"
                  defaultValue={project.projectType || ""}
                  placeholder="Loại công trình"
                  className="rounded-xl border px-4 py-3 text-sm"
                />

                <input
                  name="budget"
                  defaultValue={project.budget || ""}
                  placeholder="Ngân sách / Giá trị"
                  className="rounded-xl border px-4 py-3 text-sm"
                />

                <input
                  name="startedAt"
                  type="date"
                  defaultValue={project.startedAt}
                  className="rounded-xl border px-4 py-3 text-sm"
                />

                <input
                  name="completedAt"
                  type="date"
                  defaultValue={project.completedAt}
                  className="rounded-xl border px-4 py-3 text-sm"
                />
              </div>

              <div className="rounded-xl border p-4">
                <h3 className="mb-3 font-semibold">SEO</h3>

                <input
                  name="seoTitle"
                  defaultValue={translation?.seoTitle || ""}
                  placeholder="SEO title"
                  className="mb-3 w-full rounded-xl border px-4 py-3 text-sm"
                />

                <textarea
                  name="seoDescription"
                  rows={3}
                  defaultValue={translation?.seoDescription || ""}
                  placeholder="SEO description"
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">Xuất bản</div>

            <div className="space-y-4 p-5">
              <select
                name="status"
                defaultValue={project.status}
                className="w-full rounded-xl border px-4 py-3 text-sm"
              >
                <option value="DRAFT">Bản nháp</option>
                <option value="PUBLISHED">Xuất bản</option>
                <option value="ARCHIVED">Lưu trữ</option>
              </select>

              <label className="flex items-center gap-2 text-sm">
                <input
                  name="allowIndex"
                  type="checkbox"
                  defaultChecked={project.allowIndex}
                />
                Cho Google index
              </label>

              <UpdateButton />
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">Danh mục</div>

            <div className="p-5">
              <select
                name="categoryId"
                defaultValue={project.categoryId || ""}
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
            <div className="border-b px-5 py-4 font-semibold">
              Ảnh đại diện
            </div>

            <div className="space-y-4 p-5">
              <MediaPicker value={thumbnail} onChange={setThumbnail} />
              <input type="hidden" name="thumbnail" value={thumbnail} />
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}