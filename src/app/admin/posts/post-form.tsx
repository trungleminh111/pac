"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, Save } from "lucide-react";
import { PostEditor } from "@/components/admin/post-editor";
import { MediaPicker } from "@/components/admin/media-picker";
import { savePostAction } from "./post-actions";
import type {
  AdminLocale,
  AdminPostDetail,
  AdminPostStatus,
  PostCategoryOption,
  PostTagOption,
} from "./post.type";

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

export function PostForm({
  mode,
  activeLocale,
  post,
  categories,
  tags,
}: {
  mode: "create" | "edit";
  activeLocale: AdminLocale;
  post: AdminPostDetail | null;
  categories: PostCategoryOption[];
  tags: PostTagOption[];
}) {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [content, setContent] = useState(post?.content || "");
  const [thumbnail, setThumbnail] = useState(post?.thumbnail || "");
  const [status, setStatus] = useState<AdminPostStatus>(
    post?.status || "DRAFT"
  );

  const localeLabel = activeLocale === "vi" ? "Tiếng Việt" : "English";

  const previewSlug = useMemo(() => {
    return slug || toSlug(title);
  }, [slug, title]);

  return (
    <form action={savePostAction} className="space-y-6">
      <input type="hidden" name="id" value={post?.id || ""} />
      <input type="hidden" name="locale" value={activeLocale} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="thumbnail" value={thumbnail} />
      <input type="hidden" name="content" value={content} />

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {mode === "create" ? "Thêm bài viết" : "Sửa bài viết"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý nội dung bài viết/tin tức theo từng ngôn ngữ.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {mode === "edit" && post?.id && (
            <>
              <Link
                href={`/admin/posts/${post.id}/edit?locale=vi`}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                  activeLocale === "vi"
                    ? "border-[#2271b1] bg-[#2271b1] text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                Tiếng Việt
              </Link>

              <Link
                href={`/admin/posts/${post.id}/edit?locale=en`}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                  activeLocale === "en"
                    ? "border-[#2271b1] bg-[#2271b1] text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                English
              </Link>
            </>
          )}

          <Link
            href="/admin/posts"
            className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Quay lại
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between border-b pb-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Nội dung {localeLabel}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Mỗi ngôn ngữ có title, slug, excerpt, content và SEO riêng.
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Tiêu đề <span className="text-red-500">*</span>
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
                  placeholder="Nhập tiêu đề bài viết"
                  className="w-full rounded-xl border px-4 py-4 text-2xl font-semibold outline-none focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Slug <span className="text-red-500">*</span>
                </label>

                <input
                  name="slug"
                  required
                  value={slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    setSlug(toSlug(event.target.value));
                  }}
                  placeholder="slug-bai-viet"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                />

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSlugTouched(false);
                      setSlug(toSlug(title));
                    }}
                    className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Tạo slug theo tiêu đề
                  </button>

                  {previewSlug && (
                    <span className="text-xs text-slate-500">
                      /tin-tuc/{previewSlug}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Mô tả ngắn
                </label>

                <textarea
                  name="excerpt"
                  defaultValue={post?.excerpt || ""}
                  rows={3}
                  placeholder="Mô tả ngắn cho bài viết"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nội dung chi tiết
                </label>

                <PostEditor
                  key={`${post?.id || "new"}-${activeLocale}`}
                  value={content}
                  onChange={setContent}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-slate-800">SEO</h3>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  SEO title
                </label>

                <input
                  name="seoTitle"
                  defaultValue={post?.seoTitle || ""}
                  placeholder="Tiêu đề SEO"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  SEO description
                </label>

                <textarea
                  name="seoDescription"
                  defaultValue={post?.seoDescription || ""}
                  rows={3}
                  placeholder="Mô tả SEO"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                />
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">Xuất bản</div>

            <div className="space-y-5 p-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Trạng thái
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as AdminPostStatus)
                  }
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                >
                  <option value="DRAFT">Nháp</option>
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
                  defaultValue={post?.publishedAt || ""}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  name="isFeatured"
                  type="checkbox"
                  defaultChecked={post?.isFeatured || false}
                />
                Bài viết nổi bật
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  name="allowIndex"
                  type="checkbox"
                  defaultChecked={post?.allowIndex ?? true}
                />
                Cho Google index
              </label>

              <div className="flex gap-2">
                <button
                  type="submit"
                  onClick={() => setStatus("DRAFT")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold"
                >
                  <Save className="h-4 w-4" />
                  Lưu nháp
                </button>

                <button
                  type="submit"
                  onClick={() => setStatus("PUBLISHED")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white"
                >
                  <Eye className="h-4 w-4" />
                  Xuất bản
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">Danh mục</div>

            <div className="p-5">
              <select
                name="categoryId"
                defaultValue={post?.categoryId || ""}
                className="w-full rounded-xl border px-4 py-3 text-sm"
              >
                <option value="">Không chọn</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">Ảnh đại diện</div>

            <div className="space-y-4 p-5">
              <MediaPicker value={thumbnail} onChange={setThumbnail} />
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">Tags</div>

            <div className="space-y-5 p-5">
              <div className="max-h-56 space-y-2 overflow-y-auto rounded-xl border p-3">
                {tags.length ? (
                  tags.map((tag) => (
                    <label
                      key={tag.id}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <input
                        name="tagIds"
                        type="checkbox"
                        value={tag.id}
                        defaultChecked={
                          post?.selectedTagIds.includes(tag.id) || false
                        }
                      />
                      <span>{tag.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    Chưa có tag nào. Có thể tạo nhanh bên dưới.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Tạo tag mới
                </label>

                <input
                  name="newTags"
                  placeholder="VD: đá marble, thi công, báo giá"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Nhập nhiều tag, cách nhau bằng dấu phẩy. Khi lưu bài viết hệ
                  thống sẽ tự tạo tag và gắn vào bài.
                </p>
              </div>

              <Link
                href="/admin/tags"
                className="inline-flex rounded-lg border px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Quản lý tag
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}