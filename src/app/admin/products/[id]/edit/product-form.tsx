"use client";

import { useEffect, useState } from "react";
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

type StyleConfig = {
  image: {
    width: string;
    height: string;
    objectFit: string;
  };
  card: {
    marginTop: string;
    marginRight: string;
    marginBottom: string;
    marginLeft: string;
    borderRadius: string;
  };
};

type Product = {
  id: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sku: string | null;
  price: string | null;
  thumbnail: string | null;
  gallery: unknown;
  origin: string | null;
  size: string | null;
  material: string | null;
  color: string | null;
  thickness: string | null;
  density: string | null;
  hardness: string | null;
  styleConfig?: any;
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

const defaultStyleConfig: StyleConfig = {
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },
  card: {
    marginTop: "0",
    marginRight: "0",
    marginBottom: "24px",
    marginLeft: "0",
    borderRadius: "20px",
  },
};

function getHtml(content: any) {
  if (!content) return "";
  if (typeof content === "string") return content;
  return content.html || "";
}

function getStringGallery(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function getStyleConfig(value: any): StyleConfig {
  const margin = String(value?.card?.margin || "0 0 24px 0").split(" ");

  return {
    image: {
      width: value?.image?.width || "100%",
      height: value?.image?.height || "180px",
      objectFit: value?.image?.objectFit || "cover",
    },
    card: {
      marginTop: margin[0] || "0",
      marginRight: margin[1] || "0",
      marginBottom: margin[2] || "24px",
      marginLeft: margin[3] || "0",
      borderRadius: value?.card?.borderRadius || "20px",
    },
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

  const [state, setState] = useState<ProductEditState>({
    ok: false,
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState(getHtml(translation?.content));
  const [thumbnail, setThumbnail] = useState(product.thumbnail || "");
  const [gallery, setGallery] = useState<string[]>(
    getStringGallery(product.gallery)
  );
  const [title, setTitle] = useState(translation?.title || "");
  const [slug, setSlug] = useState(translation?.slug || "");
  const [priceDisplay, setPriceDisplay] = useState(
    decimalToMoney(product.price)
  );
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(
    product.styleConfig ? getStyleConfig(product.styleConfig) : defaultStyleConfig
  );

  const styleConfigValue = JSON.stringify({
    image: styleConfig.image,
    card: {
      margin: `${styleConfig.card.marginTop} ${styleConfig.card.marginRight} ${styleConfig.card.marginBottom} ${styleConfig.card.marginLeft}`,
      borderRadius: styleConfig.card.borderRadius,
    },
  });

  useEffect(() => {
    if (state.ok) {
      router.push("/admin/products");
      router.refresh();
    }
    setSubmitting(false);
  }, [state.ok, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await action(state, formData);
    setState(result);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="styleConfig" value={styleConfigValue} />

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
          className={`whitespace-pre-line rounded-xl px-4 py-3 text-sm ${
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
                name="localeDisplay"
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
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Tên sản phẩm
                </label>
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
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Slug
                </label>
                <input
                  name="slug"
                  required
                  value={slug}
                  onChange={(e) => setSlug(toSlug(e.target.value))}
                  placeholder="slug-san-pham"
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
                  placeholder="Mô tả ngắn"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nội dung chi tiết
                </label>
                <PostEditor value={content} onChange={setContent} />
                <input type="hidden" name="content" value={content} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    SKU
                  </label>
                  <input
                    name="sku"
                    defaultValue={product.sku || ""}
                    placeholder="Ví dụ: PS-MAR-001"
                    className="w-full rounded-xl border px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Giá
                  </label>
                  <input
                    value={priceDisplay}
                    onChange={(e) =>
                      setPriceDisplay(formatMoney(e.target.value))
                    }
                    placeholder="Ví dụ: 10.500.000"
                    className="w-full rounded-xl border px-4 py-3 text-sm"
                  />
                  <input
                    type="hidden"
                    name="price"
                    value={priceDisplay.replace(/\D/g, "")}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Xuất xứ
                  </label>
                  <input
                    name="origin"
                    defaultValue={product.origin || ""}
                    placeholder="Ví dụ: Ấn Độ"
                    className="w-full rounded-xl border px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Chủng loại
                  </label>
                  <input
                    name="material"
                    defaultValue={product.material || ""}
                    placeholder="Ví dụ: Đá Marble tự nhiên"
                    className="w-full rounded-xl border px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Kích thước
                  </label>
                  <input
                    name="size"
                    defaultValue={product.size || ""}
                    placeholder="Ví dụ: Khổ lớn theo yêu cầu"
                    className="w-full rounded-xl border px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Độ dày
                  </label>
                  <input
                    name="thickness"
                    defaultValue={product.thickness || ""}
                    placeholder="Ví dụ: 2cm"
                    className="w-full rounded-xl border px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Khối lượng riêng
                  </label>
                  <input
                    name="density"
                    defaultValue={product.density || ""}
                    placeholder="Ví dụ: 2.71 g/m3"
                    className="w-full rounded-xl border px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Độ cứng
                  </label>
                  <input
                    name="hardness"
                    defaultValue={product.hardness || ""}
                    placeholder="Ví dụ: 4Mohs"
                    className="w-full rounded-xl border px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Màu sắc
                  </label>
                  <input
                    name="color"
                    defaultValue={product.color || ""}
                    placeholder="Ví dụ: Trắng vân xám"
                    className="w-full rounded-xl border px-4 py-3 text-sm"
                  />
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-800">
                    Advanced Style
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Tùy chỉnh hiển thị sản phẩm theo kiểu no-code.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <h4 className="mb-3 text-sm font-semibold text-slate-700">
                      Ảnh sản phẩm
                    </h4>

                    <div className="grid gap-3 md:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-500">
                          Width
                        </label>
                        <input
                          value={styleConfig.image.width}
                          onChange={(e) =>
                            setStyleConfig((current) => ({
                              ...current,
                              image: {
                                ...current.image,
                                width: e.target.value,
                              },
                            }))
                          }
                          className="w-full rounded-lg border px-3 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-500">
                          Height
                        </label>
                        <input
                          value={styleConfig.image.height}
                          onChange={(e) =>
                            setStyleConfig((current) => ({
                              ...current,
                              image: {
                                ...current.image,
                                height: e.target.value,
                              },
                            }))
                          }
                          className="w-full rounded-lg border px-3 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-500">
                          Object fit
                        </label>
                        <select
                          value={styleConfig.image.objectFit}
                          onChange={(e) =>
                            setStyleConfig((current) => ({
                              ...current,
                              image: {
                                ...current.image,
                                objectFit: e.target.value,
                              },
                            }))
                          }
                          className="w-full rounded-lg border px-3 py-2 text-sm"
                        >
                          <option value="cover">cover</option>
                          <option value="contain">contain</option>
                          <option value="fill">fill</option>
                          <option value="none">none</option>
                          <option value="scale-down">scale-down</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <h4 className="mb-3 text-sm font-semibold text-slate-700">
                      Card sản phẩm
                    </h4>

                    <div className="grid gap-3 md:grid-cols-4">
                      {[
                        ["marginTop", "Top"],
                        ["marginRight", "Right"],
                        ["marginBottom", "Bottom"],
                        ["marginLeft", "Left"],
                      ].map(([key, label]) => (
                        <div key={key}>
                          <label className="mb-1 block text-xs font-medium text-slate-500">
                            Margin {label}
                          </label>
                          <input
                            value={
                              styleConfig.card[
                                key as keyof StyleConfig["card"]
                              ]
                            }
                            onChange={(e) =>
                              setStyleConfig((current) => ({
                                ...current,
                                card: {
                                  ...current.card,
                                  [key]: e.target.value,
                                },
                              }))
                            }
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-3">
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        Border Radius
                      </label>
                      <input
                        value={styleConfig.card.borderRadius}
                        onChange={(e) =>
                          setStyleConfig((current) => ({
                            ...current,
                            card: {
                              ...current.card,
                              borderRadius: e.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
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
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {submitting ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
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