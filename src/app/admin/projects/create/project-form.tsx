"use client";

import { useEffect, useState } from "react";
import {
  experimental_useFormState as useFormState,
  experimental_useFormStatus as useFormStatus,
} from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Save, X } from "lucide-react";
import { MediaPicker } from "@/components/admin/media-picker";
import type { ProjectCreateState } from "./page";

type Category = {
  id: string;
  nameVi: string;
  nameEn: string | null;
};

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

function DraftButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      name="status"
      value="DRAFT"
      disabled={pending}
      className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold disabled:opacity-60"
    >
      <Save className="h-4 w-4" />
      {pending ? "Đang lưu..." : "Lưu nháp"}
    </button>
  );
}

function PublishButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      name="status"
      value="PUBLISHED"
      disabled={pending}
      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
    >
      <Eye className="h-4 w-4" />
      {pending ? "Đang lưu..." : "Xuất bản"}
    </button>
  );
}

export default function ProjectForm({
  action,
  categories,
}: {
  action: (
    prevState: ProjectCreateState,
    formData: FormData
  ) => Promise<ProjectCreateState>;
  categories: Category[];
}) {
  const router = useRouter();

  const [state, formAction] = useFormState(action, {
    ok: false,
    message: "",
  });

  const [thumbnail, setThumbnail] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const [clientName, setClientName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [completedAt, setCompletedAt] = useState("");

  const [block1, setBlock1] = useState({
    title: "",
    textTop: "",
    image: "",
    textBottom: "",
  });

  const [block2, setBlock2] = useState({
    image1: "",
    image2: "",
    content: "",
  });

  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (state.ok) {
      router.push("/admin/projects");
      router.refresh();
    }
  }, [state.ok, router]);

  const structuredData = { block1, block2 };

  return (
    <form action={formAction} className="space-y-6">
      <input
        type="hidden"
        name="structuredData"
        value={JSON.stringify(structuredData)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            Thêm công trình
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Nội dung công trình dùng layout cố định.
          </p>
        </div>

        <Link href="/admin/projects" className="rounded-xl border px-4 py-2 text-sm">
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
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="space-y-5">
            <select
              name="locale"
              defaultValue="vi"
              className="w-full rounded-xl border px-4 py-3 text-sm"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>

            <input
              name="title"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSlug(toSlug(e.target.value));
              }}
              placeholder="Tên công trình"
              className="w-full rounded-xl border px-4 py-4 text-2xl font-semibold"
            />

            <input
              name="slug"
              required
              value={slug}
              onChange={(e) => setSlug(toSlug(e.target.value))}
              placeholder="slug-cong-trinh"
              className="w-full rounded-xl border px-4 py-3 text-sm"
            />

            <textarea
              name="excerpt"
              rows={3}
              placeholder="Mô tả ngắn SEO / listing"
              className="w-full rounded-xl border px-4 py-3 text-sm"
            />

            <div className="rounded-2xl border bg-slate-50 p-4">
              <h2 className="mb-4 font-semibold">
                Khối 1: Tiêu đề + text + ảnh + text
              </h2>

              <div className="space-y-4">
                <input
                  value={block1.title}
                  onChange={(e) =>
                    setBlock1((current) => ({
                      ...current,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Tiêu đề khối 1"
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                />

                <textarea
                  value={block1.textTop}
                  onChange={(e) =>
                    setBlock1((current) => ({
                      ...current,
                      textTop: e.target.value,
                    }))
                  }
                  rows={5}
                  placeholder="Nội dung phía trên ảnh"
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                />

                <MediaPicker
                  value={block1.image}
                  onChange={(url) =>
                    setBlock1((current) => ({ ...current, image: url }))
                  }
                />

                <textarea
                  value={block1.textBottom}
                  onChange={(e) =>
                    setBlock1((current) => ({
                      ...current,
                      textBottom: e.target.value,
                    }))
                  }
                  rows={5}
                  placeholder="Nội dung phía dưới ảnh"
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                />
              </div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <h2 className="mb-4 font-semibold">
                Khối 2: 2 ảnh bên trái, nội dung bên phải
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <MediaPicker
                  value={block2.image1}
                  onChange={(url) =>
                    setBlock2((current) => ({ ...current, image1: url }))
                  }
                />

                <MediaPicker
                  value={block2.image2}
                  onChange={(url) =>
                    setBlock2((current) => ({ ...current, image2: url }))
                  }
                />
              </div>

              <textarea
                value={block2.content}
                onChange={(e) =>
                  setBlock2((current) => ({
                    ...current,
                    content: e.target.value,
                  }))
                }
                rows={8}
                placeholder="Nội dung bên phải"
                className="mt-4 w-full rounded-xl border px-4 py-3 text-sm"
              />
            </div>

            <div className="rounded-xl border p-4">
              <h3 className="mb-3 font-semibold">SEO</h3>

              <input
                name="seoTitle"
                placeholder="SEO title"
                className="mb-3 w-full rounded-xl border px-4 py-3 text-sm"
              />

              <textarea
                name="seoDescription"
                rows={3}
                placeholder="SEO description"
                className="w-full rounded-xl border px-4 py-3 text-sm"
              />
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">Xuất bản</div>

            <div className="space-y-4 p-5">
              <select
                name="status"
                defaultValue="DRAFT"
                className="w-full rounded-xl border px-4 py-3 text-sm"
              >
                <option value="DRAFT">Bản nháp</option>
                <option value="PUBLISHED">Xuất bản</option>
                <option value="ARCHIVED">Lưu trữ</option>
              </select>

              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="w-full rounded-xl border px-4 py-3 text-sm font-semibold"
              >
                Review layout công trình
              </button>

              <label className="flex items-center gap-2 text-sm">
                <input name="allowIndex" type="checkbox" defaultChecked />
                Cho Google index
              </label>

              <div className="flex gap-2">
                <DraftButton />
                <PublishButton />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">
              Thông tin công trình
            </div>

            <div className="space-y-4 p-5">
              <input
                name="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Khách hàng"
                className="w-full rounded-xl border px-4 py-3 text-sm"
              />

              <input
                name="projectType"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                placeholder="Hạng mục"
                className="w-full rounded-xl border px-4 py-3 text-sm"
              />

              <input
                name="startedAt"
                type="date"
                value={startedAt}
                onChange={(e) => setStartedAt(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 text-sm"
              />

              <input
                name="completedAt"
                type="date"
                value={completedAt}
                onChange={(e) => setCompletedAt(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">Danh mục</div>

            <div className="p-5">
              <select name="categoryId" className="w-full rounded-xl border px-4 py-3 text-sm">
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
            <div className="border-b px-5 py-4 font-semibold">Ảnh đại diện</div>

            <div className="space-y-4 p-5">
              <MediaPicker value={thumbnail} onChange={setThumbnail} />
              <input type="hidden" name="thumbnail" value={thumbnail} />
            </div>
          </div>
        </aside>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-6">
          <div className="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Review layout công trình</h2>

              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-xl border px-4 py-2 text-sm font-semibold"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              <article className="space-y-8">
                <h1 className="text-3xl font-bold">{title || "Tên công trình"}</h1>

                {thumbnail && (
                  <img src={thumbnail} alt="" className="w-full rounded-2xl object-cover" />
                )}

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">{block1.title}</h2>
                  <p className="whitespace-pre-line text-slate-700">{block1.textTop}</p>
                  {block1.image && (
                    <img src={block1.image} alt="" className="w-full rounded-2xl object-cover" />
                  )}
                  <p className="whitespace-pre-line text-slate-700">{block1.textBottom}</p>
                </section>

                <section className="grid gap-6 md:grid-cols-[280px_1fr]">
                  <div className="space-y-4">
                    {block2.image1 && (
                      <img src={block2.image1} alt="" className="rounded-2xl object-cover" />
                    )}
                    {block2.image2 && (
                      <img src={block2.image2} alt="" className="rounded-2xl object-cover" />
                    )}
                  </div>

                  <p className="whitespace-pre-line text-slate-700">{block2.content}</p>
                </section>
              </article>

              <aside className="h-fit rounded-2xl bg-slate-50 p-5">
                <h3 className="mb-4 font-bold">Thông tin công trình</h3>

                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Khách hàng</span>
                    <strong className="text-right">{clientName || "—"}</strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Hạng mục</span>
                    <strong className="text-right">{projectType || "—"}</strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Ngày thi công</span>
                    <strong className="text-right">{startedAt || "—"}</strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Ngày hoàn thành</span>
                    <strong className="text-right">{completedAt || "—"}</strong>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}