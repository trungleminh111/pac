"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { PostEditor } from "@/components/admin/post-editor";
import { MediaPicker } from "@/components/admin/media-picker";
import type { EditPostState } from "./page";

type Translation = {
  locale: "vi" | "en";
  title: string;
  slug: string;
  excerpt: string | null;
  content: any;
  seoTitle: string | null;
  seoDescription: string | null;
};

type Post = {
  id: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  thumbnail: string | null;
  isFeatured: boolean;
  allowIndex: boolean;
  categoryId: string | null;
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
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function EditPostForm({
  post,
  categories,
  selectedLocale,
  action,
}: {
  post: Post;
  categories: Category[];
  selectedLocale: "vi" | "en";
  action: (
    prevState: EditPostState,
    formData: FormData
  ) => Promise<EditPostState>;
}) {
  const router = useRouter();

  const translation = post.translations.find(
    (item) => item.locale === selectedLocale
  );

  const [state, setState] = useState<EditPostState>({
    ok: false,
    message: "",
  });

  const [title, setTitle] = useState(translation?.title || "");
  const [slug, setSlug] = useState(translation?.slug || "");
  const [slugEdited, setSlugEdited] = useState(false);
  const [content, setContent] = useState(getHtml(translation?.content));
  const [thumbnail, setThumbnail] = useState(post.thumbnail || "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTitle(translation?.title || "");
    setSlug(translation?.slug || "");
    setSlugEdited(false);
    setContent(getHtml(translation?.content));
  }, [selectedLocale, translation]);

  useEffect(() => {
    if (!state.ok) return;

    router.push("/admin/posts");
    router.refresh();
  }, [state.ok, router]);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);

    try {
      const result = await action(state, formData);
      setState(result);
    } finally {
      setSubmitting(false);
    }
  }

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slugEdited) {
      setSlug(toSlug(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugEdited(true);
    setSlug(toSlug(value));
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Sửa bài viết</h1>
          <p className="mt-1 text-sm text-slate-500">
            Chỉnh sửa nội dung bài viết.
          </p>
        </div>

        <Link
          href="/admin/posts"
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
                Ngôn ngữ bài viết
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
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="Nhập tiêu đề tại đây"
                className="w-full rounded-xl border px-4 py-4 text-2xl font-semibold outline-none focus:border-[#2271b1]"
              />

              <input
                name="slug"
                required
                value={slug}
                onChange={(event) => handleSlugChange(event.target.value)}
                placeholder="duong-dan-bai-viet"
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
                defaultValue={post.status}
                className="w-full rounded-xl border px-4 py-3 text-sm"
              >
                <option value="DRAFT">Bản nháp</option>
                <option value="PUBLISHED">Xuất bản</option>
                <option value="ARCHIVED">Lưu trữ</option>
              </select>

              <label className="flex items-center gap-2 text-sm">
                <input
                  name="isFeatured"
                  type="checkbox"
                  defaultChecked={post.isFeatured}
                />
                Bài viết nổi bật
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  name="allowIndex"
                  type="checkbox"
                  defaultChecked={post.allowIndex}
                />
                Cho Google index
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {submitting ? "Đang cập nhật..." : "Cập nhật bài viết"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">Chuyên mục</div>

            <div className="p-5">
              <select
                name="categoryId"
                defaultValue={post.categoryId || ""}
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