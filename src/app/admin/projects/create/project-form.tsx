"use client";

import { useEffect, useState } from "react";
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

  const [state, setState] = useState<ProjectCreateState>({
    ok: false,
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const [thumbnail, setThumbnail] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const [clientName, setClientName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [completedAt, setCompletedAt] = useState("");

  const [contentBlocks, setContentBlocks] = useState([
    {
      type: "titleTextImageText",
      title: "",
      textTop: "",
      image: "",
      textBottom: "",
    },
    {
      type: "twoImagesContent",
      image1: "",
      image2: "",
      content: "",
    },
  ]);

  const block1 = contentBlocks[0];
  const block2 = contentBlocks[1];

  function updateContentBlock(
    index: number,
    field: string,
    value: string
  ) {
    setContentBlocks((current) =>
      current.map((block, blockIndex) =>
        blockIndex === index ? { ...block, [field]: value } : block
      )
    );
  }

  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (state.ok) {
      router.push("/admin/projects");
      router.refresh();
    }
    setSubmitting(false);
  }, [state.ok, router]);

  const structuredData = { blocks: contentBlocks };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const requiredFields = [
      { label: "Tiêu đề khối 1", value: block1.title },
      { label: "Nội dung phía trên ảnh", value: block1.textTop },
      { label: "Ảnh khối 1", value: block1.image },
      { label: "Nội dung phía dưới ảnh", value: block1.textBottom },
      { label: "Ảnh bên trái 1", value: block2.image1 },
      { label: "Ảnh bên trái 2", value: block2.image2 },
      { label: "Nội dung bên phải", value: block2.content },
    ];

    const missingField = requiredFields.find(
      (field) => !field.value || !field.value.trim()
    );

    if (missingField) {
      setState({
        ok: false,
        message: `Vui lòng nhập đầy đủ: ${missingField.label}`,
      });
      setSubmitting(false);
      return;
    }

    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.set("structuredData", JSON.stringify(structuredData));
    const result = await action(state, formData);
    setState(result);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

        <Link
          href="/admin/projects"
          className="rounded-xl border px-4 py-2 text-sm"
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
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Ngôn ngữ công trình
              </label>
              <select
                name="locale"
                defaultValue="vi"
                className="w-full rounded-xl border px-4 py-3 text-sm"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tên công trình
              </label>
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
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Đường dẫn / Slug
              </label>
              <input
                name="slug"
                required
                value={slug}
                onChange={(e) => setSlug(toSlug(e.target.value))}
                placeholder="slug-cong-trinh"
                className="w-full rounded-xl border px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Mô tả ngắn
              </label>
              <textarea
                name="excerpt"
                rows={3}
                placeholder="Mô tả ngắn SEO / listing"
                className="w-full rounded-xl border px-4 py-3 text-sm"
              />
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <h2 className="mb-4 font-semibold">
                Khối 1: Tiêu đề + text + ảnh + text
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Tiêu đề khối 1
                  </label>
                  <input
                    value={block1.title}
                    onChange={(e) =>
                      updateContentBlock(0, "title", e.target.value)
                    }
                    placeholder="Tiêu đề khối 1"
                    className="w-full rounded-xl border px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nội dung phía trên ảnh
                  </label>
                  <textarea
                    value={block1.textTop}
                    onChange={(e) =>
                      updateContentBlock(0, "textTop", e.target.value)
                    }
                    rows={5}
                    placeholder="Nội dung phía trên ảnh"
                    className="w-full rounded-xl border px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Ảnh khối 1
                  </label>
                  <MediaPicker
                    value={block1.image}
                    onChange={(url) =>
                      updateContentBlock(0, "image", url)
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nội dung phía dưới ảnh
                  </label>
                  <textarea
                    value={block1.textBottom}
                    onChange={(e) =>
                      updateContentBlock(0, "textBottom", e.target.value)
                    }
                    rows={5}
                    placeholder="Nội dung phía dưới ảnh"
                    className="w-full rounded-xl border px-4 py-3 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <h2 className="mb-4 font-semibold">
                Khối 2: 2 ảnh bên trái, nội dung bên phải
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Ảnh bên trái 1
                  </label>
                  <MediaPicker
                    value={block2.image1}
                    onChange={(url) =>
                      updateContentBlock(1, "image1", url)
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Ảnh bên trái 2
                  </label>
                  <MediaPicker
                    value={block2.image2}
                    onChange={(url) =>
                      updateContentBlock(1, "image2", url)
                    }
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nội dung bên phải
                </label>
                <textarea
                  value={block2.content}
                  onChange={(e) =>
                    updateContentBlock(1, "content", e.target.value)
                  }
                  rows={8}
                  placeholder="Nội dung bên phải"
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                />
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <h3 className="mb-3 font-semibold">SEO</h3>

              <div className="mb-3">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  SEO Title
                </label>
                <input
                  name="seoTitle"
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
                  rows={3}
                  placeholder="Nhập mô tả SEO"
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
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Trạng thái công trình
                </label>
                <select
                  name="status"
                  defaultValue="DRAFT"
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                >
                  <option value="DRAFT">Bản nháp</option>
                  <option value="PUBLISHED">Xuất bản</option>
                  <option value="ARCHIVED">Lưu trữ</option>
                </select>
              </div>

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
                <button
                  type="submit"
                  name="status"
                  value="DRAFT"
                  disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {submitting ? "Đang lưu..." : "Lưu nháp"}
                </button>

                <button
                  type="submit"
                  name="status"
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
            <div className="border-b px-5 py-4 font-semibold">
              Thông tin công trình
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Tên khách hàng
                </label>
                <input
                  name="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Khách hàng"
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Hạng mục thi công
                </label>
                <input
                  name="projectType"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  placeholder="Hạng mục"
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Ngày khởi công
                </label>
                <input
                  name="startedAt"
                  type="date"
                  value={startedAt}
                  onChange={(e) => setStartedAt(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Ngày hoàn thành
                </label>
                <input
                  name="completedAt"
                  type="date"
                  value={completedAt}
                  onChange={(e) => setCompletedAt(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">Danh mục</div>

            <div className="p-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Chọn danh mục công trình
              </label>
              <select
                name="categoryId"
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
            <div className="border-b px-5 py-4 font-semibold">Ảnh đại diện</div>

            <div className="space-y-4 p-5">
              <label className="block text-sm font-semibold text-slate-700">
                Chọn ảnh đại diện công trình
              </label>
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
                <h1 className="text-3xl font-bold">
                  {title || "Tên công trình"}
                </h1>

                {thumbnail && (
                  <img
                    src={thumbnail}
                    alt=""
                    className="w-full rounded-2xl object-cover"
                  />
                )}

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">{block1.title}</h2>
                  <p className="whitespace-pre-line text-slate-700">
                    {block1.textTop}
                  </p>

                  {block1.image && (
                    <img
                      src={block1.image}
                      alt=""
                      className="w-full rounded-2xl object-cover"
                    />
                  )}

                  <p className="whitespace-pre-line text-slate-700">
                    {block1.textBottom}
                  </p>
                </section>

                <section className="grid gap-6 md:grid-cols-[280px_1fr]">
                  <div className="space-y-4">
                    {block2.image1 && (
                      <img
                        src={block2.image1}
                        alt=""
                        className="rounded-2xl object-cover"
                      />
                    )}

                    {block2.image2 && (
                      <img
                        src={block2.image2}
                        alt=""
                        className="rounded-2xl object-cover"
                      />
                    )}
                  </div>

                  <p className="whitespace-pre-line text-slate-700">
                    {block2.content}
                  </p>
                </section>
              </article>

              <aside className="h-fit rounded-2xl bg-slate-50 p-5">
                <h3 className="mb-4 font-bold">Thông tin công trình</h3>

                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Khách hàng</span>
                    <strong className="text-right">
                      {clientName || "—"}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Hạng mục</span>
                    <strong className="text-right">
                      {projectType || "—"}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Ngày thi công</span>
                    <strong className="text-right">
                      {startedAt || "—"}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Ngày hoàn thành</span>
                    <strong className="text-right">
                      {completedAt || "—"}
                    </strong>
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