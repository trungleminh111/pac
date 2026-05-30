"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { PostEditor } from "@/components/admin/post-editor";
import { MediaPicker } from "@/components/admin/media-picker";
import { MediaGalleryPicker } from "@/components/admin/media-gallery-picker";
import type { ProductEditState } from "./page";

type Translation = {
  locale: "vi" | "en";
  title: string;
  slug: string;
  excerpt: string | null;
  content: any;
  seoTitle: string | null;
  seoDescription: string | null;
};

type Product = {
  id: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sku: string | null;
  price: string | null;
  thumbnail: string | null;
  gallery: string[];
  origin: string | null;
  size: string | null;
  material: string | null;
  color: string | null;
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

function decimalToMoney(value: string | null) {
  if (!value) return "";
  return Number(value).toLocaleString("vi-VN");
}

export default function ProductEditForm({
  product,
  categories,
  selectedLocale,
  action,
}: {
  product: Product;
  categories: Category[];
  selectedLocale: "vi" | "en";
  action: (
    prevState: ProductEditState,
    formData: FormData
  ) => Promise<ProductEditState>;
}) {
  const router = useRouter();

  const translation = product.translations.find(
    (item) => item.locale === selectedLocale
  );

  const [state, formAction, pending] = useActionState(action, {
    ok: false,
    message: "",
  });

  const [content, setContent] = useState(getHtml(translation?.content));
  const [thumbnail, setThumbnail] = useState(product.thumbnail || "");
  const [gallery, setGallery] = useState<string[]>(product.gallery || []);
  const [title, setTitle] = useState(translation?.title || "");
  const [slug, setSlug] = useState(translation?.slug || "");
  const [priceDisplay, setPriceDisplay] = useState(
    decimalToMoney(product.price)
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
          <h1 className="text-2xl font-bold text-slate-950">Sửa sản phẩm</h1>
          <p className="mt-1 text-sm text-slate-500">
            Cập nhật thông tin sản phẩm.
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

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Ngôn ngữ sản phẩm
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
                defaultValue={translation?.excerpt || ""}
                placeholder="Mô tả ngắn"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              />

              <PostEditor value={content} onChange={setContent} />
              <input type="hidden" name="content" value={content} />

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="sku"
                  defaultValue={product.sku || ""}
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
                  defaultValue={product.origin || ""}
                  placeholder="Xuất xứ"
                  className="rounded-xl border px-4 py-3 text-sm"
                />

                <input
                  name="size"
                  defaultValue={product.size || ""}
                  placeholder="Kích thước"
                  className="rounded-xl border px-4 py-3 text-sm"
                />

                <input
                  name="material"
                  defaultValue={product.material || ""}
                  placeholder="Chất liệu"
                  className="rounded-xl border px-4 py-3 text-sm"
                />

                <input
                  name="color"
                  defaultValue={product.color || ""}
                  placeholder="Màu sắc"
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
                defaultValue={product.status}
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
                  defaultChecked={product.isFeatured}
                />
                Sản phẩm nổi bật
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  name="allowIndex"
                  type="checkbox"
                  defaultChecked={product.allowIndex}
                />
                Cho Google index
              </label>

              <button
                type="submit"
                disabled={pending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {pending ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">Danh mục</div>

            <div className="p-5">
              <select
                name="categoryId"
                defaultValue={product.categoryId || ""}
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
              <input type="hidden" name="gallery" value={JSON.stringify(gallery)} />
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}