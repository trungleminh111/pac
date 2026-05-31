"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Save } from "lucide-react";
import { PostEditor } from "@/components/admin/post-editor";
import { MediaPicker } from "@/components/admin/media-picker";
import { MediaGalleryPicker } from "@/components/admin/media-gallery-picker";
import type { ProductCreateState } from "./page";

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

function formatMoney(value: string) {
  const number = value.replace(/\D/g, "");
  if (!number) return "";
  return Number(number).toLocaleString("vi-VN");
}

export default function ProductForm({
  action,
  categories,
}: {
  action: (
    prevState: ProductCreateState,
    formData: FormData
  ) => Promise<ProductCreateState>;
  categories: Category[];
}) {
  const router = useRouter();

  const [state, formAction, pending] = useActionState(action, {
    ok: false,
    message: "",
  });

  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [priceDisplay, setPriceDisplay] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(
    "DRAFT"
  );

  useEffect(() => {
    if (state.ok) {
      router.push("/admin/products");
      router.refresh();
    }
  }, [state.ok, router]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Thêm sản phẩm</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tạo sản phẩm đá theo từng ngôn ngữ.
          </p>
        </div>

        <Link
          href="/admin/products"
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

      <input type="hidden" name="status" value={status} />

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Ngôn ngữ sản phẩm
              </label>

              <select
                name="locale"
                defaultValue="vi"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
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
                placeholder="Nhập tên sản phẩm"
                className="w-full rounded-xl border px-4 py-4 text-2xl font-semibold outline-none focus:border-[#2271b1]"
              />

              <input
                name="slug"
                required
                value={slug}
                onChange={(e) => setSlug(toSlug(e.target.value))}
                placeholder="slug-san-pham"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              />

              <textarea
                name="excerpt"
                rows={3}
                placeholder="Mô tả ngắn"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              />

              <PostEditor value={content} onChange={setContent} />
              <input type="hidden" name="content" value={content} />

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="sku"
                  placeholder="Mã sản phẩm / SKU"
                  className="rounded-xl border px-4 py-3 text-sm"
                />

                <div>
                  <input
                    value={priceDisplay}
                    onChange={(e) =>
                      setPriceDisplay(formatMoney(e.target.value))
                    }
                    placeholder="Giá, ví dụ 10.500.000"
                    className="w-full rounded-xl border px-4 py-3 text-sm"
                  />
                  <input
                    type="hidden"
                    name="price"
                    value={priceDisplay.replace(/\D/g, "")}
                  />
                </div>

                <input
                  name="origin"
                  placeholder="Xuất xứ"
                  className="rounded-xl border px-4 py-3 text-sm"
                />

                <input
                  name="size"
                  placeholder="Kích thước"
                  className="rounded-xl border px-4 py-3 text-sm"
                />

                <input
                  name="material"
                  placeholder="Chất liệu"
                  className="rounded-xl border px-4 py-3 text-sm"
                />

                <input
                  name="color"
                  placeholder="Màu sắc"
                  className="rounded-xl border px-4 py-3 text-sm"
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
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">Xuất bản</div>

            <div className="space-y-4 p-5">
              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as "DRAFT" | "PUBLISHED" | "ARCHIVED"
                  )
                }
                className="w-full rounded-xl border px-4 py-3 text-sm"
              >
                <option value="DRAFT">Bản nháp</option>
                <option value="PUBLISHED">Xuất bản</option>
                <option value="ARCHIVED">Lưu trữ</option>
              </select>

              <label className="flex items-center gap-2 text-sm">
                <input name="isFeatured" type="checkbox" />
                Sản phẩm nổi bật
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input name="allowIndex" type="checkbox" defaultChecked />
                Cho Google index
              </label>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={pending}
                  onClick={() => setStatus("DRAFT")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {pending ? "Đang lưu..." : "Lưu nháp"}
                </button>

                <button
                  type="submit"
                  disabled={pending}
                  onClick={() => setStatus("PUBLISHED")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  <Eye className="h-4 w-4" />
                  {pending ? "Đang lưu..." : "Xuất bản"}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">Danh mục</div>

            <div className="p-5">
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
            <div className="border-b px-5 py-4 font-semibold">
              Ảnh đại diện
            </div>

            <div className="space-y-4 p-5">
              <MediaPicker value={thumbnail} onChange={setThumbnail} />
              <input type="hidden" name="thumbnail" value={thumbnail} />
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">
              Gallery sản phẩm
            </div>

            <div className="space-y-4 p-5">
              <MediaGalleryPicker value={gallery} onChange={setGallery} />
              <input
                type="hidden"
                name="gallery"
                value={JSON.stringify(gallery)}
              />
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}