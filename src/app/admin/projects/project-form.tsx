"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Save, X } from "lucide-react";
import { MediaPicker } from "@/components/admin/media-picker";
import { saveProjectAction } from "./project-actions";
import type {
  AdminLocale,
  AdminProjectDetail,
  AdminProjectStatus,
  ProjectCategoryOption,
  ProjectContentBlock,
  TitleTextImageTextBlock,
  TwoImagesContentBlock,
} from "./project.type";

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

function defaultBlocks(): ProjectContentBlock[] {
  return [
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
      content1: "",
      content2: "",
    },
  ];
}

export function ProjectForm({
  mode,
  activeLocale,
  project,
  categories,
}: {
  mode: "create" | "edit";
  activeLocale: AdminLocale;
  project: AdminProjectDetail | null;
  categories: ProjectCategoryOption[];
}) {
  const [clientMessage, setClientMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [status, setStatus] = useState<AdminProjectStatus>(
    project?.status || "DRAFT"
  );

  const [thumbnail, setThumbnail] = useState(project?.thumbnail || "");
  const [title, setTitle] = useState(project?.title || "");
  const [slug, setSlug] = useState(project?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project?.slug));

  const [clientName, setClientName] = useState(project?.clientName || "");
  const [projectType, setProjectType] = useState(project?.projectType || "");
  const [startedAt, setStartedAt] = useState(project?.startedAt || "");
  const [completedAt, setCompletedAt] = useState(project?.completedAt || "");

  const [contentBlocks, setContentBlocks] = useState<ProjectContentBlock[]>(
    project?.structuredData?.blocks?.length
      ? project.structuredData.blocks
      : defaultBlocks()
  );

  const [previewOpen, setPreviewOpen] = useState(false);

  const block1 = contentBlocks[0] as TitleTextImageTextBlock;
  const block2 = contentBlocks[1] as TwoImagesContentBlock;

  const structuredData = useMemo(
    () => ({
      blocks: contentBlocks,
    }),
    [contentBlocks]
  );

  function updateContentBlock(
    index: number,
    field: keyof TitleTextImageTextBlock | keyof TwoImagesContentBlock,
    value: string
  ) {
    setContentBlocks((current) =>
      current.map((block, blockIndex) =>
        blockIndex === index
          ? ({ ...block, [field]: value } as ProjectContentBlock)
          : block
      )
    );
  }

  function validateForm() {
    const requiredFields = [
      { label: "Tên công trình", value: title },
      { label: "Slug công trình", value: slug },
      { label: "Tiêu đề khối 1", value: block1.title },
      { label: "Nội dung phía trên ảnh", value: block1.textTop },
      { label: "Ảnh khối 1", value: block1.image },
      { label: "Nội dung phía dưới ảnh", value: block1.textBottom },
      { label: "Ảnh bên trái 1", value: block2.image1 },
      { label: "Ảnh bên trái 2", value: block2.image2 },
      { label: "Nội dung bên phải 1", value: block2.content1 },
      { label: "Nội dung bên phải 2", value: block2.content2 },
    ];

    const missingField = requiredFields.find(
      (field) => !field.value || !field.value.trim()
    );

    if (missingField) {
      return `Vui lòng nhập đầy đủ: ${missingField.label}`;
    }

    if (startedAt && completedAt && completedAt < startedAt) {
      return "Ngày hoàn thành không được nhỏ hơn ngày khởi công.";
    }

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
    <form action={saveProjectAction} onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={project?.id || ""} />
      <input type="hidden" name="locale" value={activeLocale} />
      <input type="hidden" name="thumbnail" value={thumbnail} />
      <input
        type="hidden"
        name="structuredData"
        value={JSON.stringify(structuredData)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            {mode === "create" ? "Thêm công trình" : "Sửa công trình"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Nội dung công trình dùng layout cố định.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {mode === "edit" && project?.id ? (
            <>
              <Link
                href={`/admin/projects/${project.id}/edit?locale=vi`}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                  activeLocale === "vi"
                    ? "border-[#2271b1] bg-[#2271b1] text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                Tiếng Việt
              </Link>

              <Link
                href={`/admin/projects/${project.id}/edit?locale=en`}
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
            href="/admin/projects"
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
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Ngôn ngữ công trình
              </label>
              <div className="rounded-xl border bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                {activeLocale === "vi" ? "Tiếng Việt" : "English"}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tên công trình
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
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(toSlug(event.target.value));
                }}
                placeholder="slug-cong-trinh"
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
                Tạo slug theo tên công trình
              </button>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Mô tả ngắn
              </label>
              <textarea
                name="excerpt"
                defaultValue={project?.excerpt || ""}
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
                    onChange={(event) =>
                      updateContentBlock(0, "title", event.target.value)
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
                    onChange={(event) =>
                      updateContentBlock(0, "textTop", event.target.value)
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
                    value={block1.image || ""}
                    onChange={(url) => updateContentBlock(0, "image", url)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nội dung phía dưới ảnh
                  </label>
                  <textarea
                    value={block1.textBottom}
                    onChange={(event) =>
                      updateContentBlock(0, "textBottom", event.target.value)
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
                    value={block2.image1 || ""}
                    onChange={(url) => updateContentBlock(1, "image1", url)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Ảnh bên trái 2
                  </label>
                  <MediaPicker
                    value={block2.image2 || ""}
                    onChange={(url) => updateContentBlock(1, "image2", url)}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nội dung bên phải 1
                </label>
                <textarea
                  value={block2.content1}
                  onChange={(event) =>
                    updateContentBlock(1, "content1", event.target.value)
                  }
                  rows={5}
                  placeholder="Nội dung bên phải 1"
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nội dung bên phải 2
                </label>
                <textarea
                  value={block2.content2}
                  onChange={(event) =>
                    updateContentBlock(1, "content2", event.target.value)
                  }
                  rows={5}
                  placeholder="Nội dung bên phải 2"
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
                  defaultValue={project?.seoTitle || ""}
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
                  defaultValue={project?.seoDescription || ""}
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
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as AdminProjectStatus)
                  }
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
                <input
                  name="allowIndex"
                  type="checkbox"
                  defaultChecked={project?.allowIndex ?? true}
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
                  onChange={(event) => setClientName(event.target.value)}
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
                  onChange={(event) => setProjectType(event.target.value)}
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
                  onChange={(event) => setStartedAt(event.target.value)}
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
                  onChange={(event) => setCompletedAt(event.target.value)}
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
                defaultValue={project?.categoryId || ""}
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

                  <div className="space-y-4">
                    <p className="whitespace-pre-line text-slate-700">
                      {block2.content1}
                    </p>

                    <p className="whitespace-pre-line text-slate-700">
                      {block2.content2}
                    </p>
                  </div>
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
                    <strong className="text-right">{startedAt || "—"}</strong>
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