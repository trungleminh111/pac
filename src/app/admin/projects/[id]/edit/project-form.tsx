"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Save, X } from "lucide-react";
import { MediaPicker } from "@/components/admin/media-picker";
import type { ProjectEditState } from "./page";

type Translation = {
  locale: "vi" | "en";
  title: string;
  slug: string;
  excerpt: string | null;
  content: any;
  structuredData: any;
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

type Block1 = {
  type: "titleTextImageText";
  title: string;
  textTop: string;
  image: string;
  textBottom: string;
};

type Block2 = {
  type: "twoImagesContent";
  image1: string;
  image2: string;
  content1: string;
  content2: string;
};

const emptyBlock1: Block1 = {
  type: "titleTextImageText",
  title: "",
  textTop: "",
  image: "",
  textBottom: "",
};

const emptyBlock2: Block2 = {
  type: "twoImagesContent",
  image1: "",
  image2: "",
  content1: "",
  content2: "",
};

function parseJsonLike(value: any) {
  if (!value) return null;

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  return value;
}

function normalizeStructuredData(value: any): {
  block1: Block1;
  block2: Block2;
  hasData: boolean;
} {
  const parsed = parseJsonLike(value);

  if (!parsed) {
    return {
      block1: emptyBlock1,
      block2: emptyBlock2,
      hasData: false,
    };
  }

  if (Array.isArray(parsed?.blocks)) {
    const rawBlock1 =
      parsed.blocks.find((item: any) => item.type === "titleTextImageText") ||
      parsed.blocks[0] ||
      {};

    const rawBlock2 =
      parsed.blocks.find((item: any) => item.type === "twoImagesContent") ||
      parsed.blocks[1] ||
      {};

    const block1: Block1 = {
      type: "titleTextImageText",
      title: rawBlock1.title || "",
      textTop: rawBlock1.textTop || "",
      image: rawBlock1.image || "",
      textBottom: rawBlock1.textBottom || "",
    };

    const block2: Block2 = {
      type: "twoImagesContent",
      image1: rawBlock2.image1 || "",
      image2: rawBlock2.image2 || "",
      content1: rawBlock2.content1 || rawBlock2.content || "",
      content2: rawBlock2.content2 || "",
    };

    return {
      block1,
      block2,
      hasData:
        Boolean(block1.title) ||
        Boolean(block1.textTop) ||
        Boolean(block1.image) ||
        Boolean(block1.textBottom) ||
        Boolean(block2.image1) ||
        Boolean(block2.image2) ||
        Boolean(block2.content1) ||
        Boolean(block2.content2),
    };
  }

  const block1: Block1 = {
    type: "titleTextImageText",
    title: parsed?.block1?.title || "",
    textTop: parsed?.block1?.textTop || "",
    image: parsed?.block1?.image || "",
    textBottom: parsed?.block1?.textBottom || "",
  };

  const block2: Block2 = {
    type: "twoImagesContent",
    image1: parsed?.block2?.image1 || "",
    image2: parsed?.block2?.image2 || "",
    content1: parsed?.block2?.content1 || parsed?.block2?.content || "",
    content2: parsed?.block2?.content2 || "",
  };

  return {
    block1,
    block2,
    hasData:
      Boolean(block1.title) ||
      Boolean(block1.textTop) ||
      Boolean(block1.image) ||
      Boolean(block1.textBottom) ||
      Boolean(block2.image1) ||
      Boolean(block2.image2) ||
      Boolean(block2.content1) ||
      Boolean(block2.content2),
  };
}

function getStructuredData(primaryValue: any, fallbackValue: any): {
  block1: Block1;
  block2: Block2;
} {
  const primary = normalizeStructuredData(primaryValue);

  if (primary.hasData) {
    return {
      block1: primary.block1,
      block2: primary.block2,
    };
  }

  const fallback = normalizeStructuredData(fallbackValue);

  return {
    block1: fallback.block1,
    block2: fallback.block2,
  };
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

function isEmpty(value: string) {
  return !value || value.trim() === "";
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

  const initialStructuredData = getStructuredData(
    translation?.structuredData,
    translation?.content
  );

  const [state, setState] = useState<ProjectEditState>({
    ok: false,
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [thumbnail, setThumbnail] = useState(project.thumbnail || "");
  const [title, setTitle] = useState(translation?.title || "");
  const [slug, setSlug] = useState(translation?.slug || "");

  const [clientName, setClientName] = useState(project.clientName || "");
  const [projectType, setProjectType] = useState(project.projectType || "");
  const [budget, setBudget] = useState(project.budget || "");
  const [startedAt, setStartedAt] = useState(project.startedAt || "");
  const [completedAt, setCompletedAt] = useState(project.completedAt || "");

  const [block1, setBlock1] = useState<Block1>(initialStructuredData.block1);
  const [block2, setBlock2] = useState<Block2>(initialStructuredData.block2);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (state.ok) {
      router.push("/admin/projects");
      router.refresh();
    }

    setSubmitting(false);
  }, [state.ok, router]);

  const structuredData = {
    blocks: [
      {
        type: "titleTextImageText",
        title: block1.title,
        textTop: block1.textTop,
        image: block1.image,
        textBottom: block1.textBottom,
      },
      {
        type: "twoImagesContent",
        image1: block2.image1,
        image2: block2.image2,
        content1: block2.content1,
        content2: block2.content2,
      },
    ],
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      isEmpty(block1.title) ||
      isEmpty(block1.textTop) ||
      isEmpty(block1.image) ||
      isEmpty(block1.textBottom) ||
      isEmpty(block2.image1) ||
      isEmpty(block2.image2) ||
      isEmpty(block2.content1) ||
      isEmpty(block2.content2)
    ) {
      setState({
        ok: false,
        message: "Vui lòng nhập đầy đủ nội dung 2 khối trước khi lưu.",
      });
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
            Sửa công trình
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Chỉnh sửa công trình theo layout cố định.
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
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="space-y-5">
            <div>
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
                placeholder="Nhập tên công trình"
                className="w-full rounded-xl border px-4 py-4 text-2xl font-semibold outline-none focus:border-[#2271b1]"
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
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Mô tả ngắn
              </label>

              <textarea
                name="excerpt"
                rows={3}
                defaultValue={translation?.excerpt || ""}
                placeholder="Nhập mô tả ngắn cho công trình"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              />
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <h2 className="mb-4 font-semibold">
                Khối 1: Tiêu đề + text + ảnh + text
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Tiêu đề khối 1 <span className="text-red-500">*</span>
                  </label>

                  <input
                    required
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
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nội dung phía trên ảnh{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    required
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
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Ảnh khối 1 <span className="text-red-500">*</span>
                  </label>

                  <MediaPicker
                    value={block1.image}
                    onChange={(url) =>
                      setBlock1((current) => ({
                        ...current,
                        image: url,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nội dung phía dưới ảnh{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    required
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
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <h2 className="mb-4 font-semibold">
                Khối 2: 2 ảnh bên trái, nội dung bên phải
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Ảnh bên trái 1 <span className="text-red-500">*</span>
                  </label>

                  <MediaPicker
                    value={block2.image1}
                    onChange={(url) =>
                      setBlock2((current) => ({
                        ...current,
                        image1: url,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Ảnh bên trái 2 <span className="text-red-500">*</span>
                  </label>

                  <MediaPicker
                    value={block2.image2}
                    onChange={(url) =>
                      setBlock2((current) => ({
                        ...current,
                        image2: url,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nội dung bên phải 1 <span className="text-red-500">*</span>
                </label>

                <textarea
                  required
                  value={block2.content1}
                  onChange={(e) =>
                    setBlock2((current) => ({
                      ...current,
                      content1: e.target.value,
                    }))
                  }
                  rows={5}
                  placeholder="Nội dung bên phải 1"
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nội dung bên phải 2 <span className="text-red-500">*</span>
                </label>

                <textarea
                  required
                  value={block2.content2}
                  onChange={(e) =>
                    setBlock2((current) => ({
                      ...current,
                      content2: e.target.value,
                    }))
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
                  SEO title
                </label>

                <input
                  name="seoTitle"
                  defaultValue={translation?.seoTitle || ""}
                  placeholder="Nhập tiêu đề SEO"
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  SEO description
                </label>

                <textarea
                  name="seoDescription"
                  rows={3}
                  defaultValue={translation?.seoDescription || ""}
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
                  defaultValue={project.status}
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
                className="flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold"
              >
                <Eye className="h-4 w-4" />
                Review layout công trình
              </button>

              <label className="flex items-center gap-2 text-sm">
                <input
                  name="allowIndex"
                  type="checkbox"
                  defaultChecked={project.allowIndex}
                />
                Cho Google index
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {submitting ? "Đang cập nhật..." : "Cập nhật công trình"}
              </button>
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
                  placeholder="Nhập tên khách hàng"
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
                  placeholder="Ví dụ: Thi công đá Marble"
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Ngân sách / Giá trị
                </label>

                <input
                  name="budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Ví dụ: 500.000.000"
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