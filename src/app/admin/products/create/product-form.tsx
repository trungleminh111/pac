"use client";

import { useEffect, useState } from "react";
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

  const [state, setState] = useState<ProductCreateState>({
    ok: false,
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [priceDisplay, setPriceDisplay] = useState("");
  const [styleConfig, setStyleConfig] =
    useState<StyleConfig>(defaultStyleConfig);

  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(
    "DRAFT"
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
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="styleConfig" value={styleConfigValue} />

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
                name="locale"
                defaultValue="vi"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Tên sản phẩm <span className="text-red-500">*</span>
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
                  Slug <span className="text-red-500">*</span>
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
                  placeholder="Mô tả ngắn về sản phẩm"
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

              <div className="rounded-xl border p-4">
                <h3 className="mb-4 font-semibold text-slate-800">
                  Thông tin cơ bản
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Mã sản phẩm / SKU
                    </label>
                    <input
                      name="sku"
                      placeholder="VD: PAC-001"
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Giá bán
                    </label>
                    <input
                      value={priceDisplay}
                      onChange={(e) =>
                        setPriceDisplay(formatMoney(e.target.value))
                      }
                      placeholder="VD: 10.500.000"
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                    />
                    <input
                      type="hidden"
                      name="price"
                      value={priceDisplay.replace(/\D/g, "")}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Xuất xứ
                    </label>
                    <input
                      name="origin"
                      placeholder="VD: Ấn Độ, Ý, Việt Nam"
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Màu sắc
                    </label>
                    <input
                      name="color"
                      placeholder="VD: Trắng vân xám"
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <h3 className="mb-4 font-semibold text-slate-800">
                  Thông số kỹ thuật
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Chất liệu / Chủng loại
                    </label>
                    <input
                      name="material"
                      placeholder="VD: Đá Marble tự nhiên"
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Kích thước
                    </label>
                    <input
                      name="size"
                      placeholder="VD: Khổ lớn theo yêu cầu"
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Độ dày
                    </label>
                    <input
                      name="thickness"
                      placeholder="VD: 2cm"
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Khối lượng riêng
                    </label>
                    <input
                      name="density"
                      placeholder="VD: 2.71 g/m3"
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Độ cứng
                    </label>
                    <input
                      name="hardness"
                      placeholder="VD: 4 Mohs"
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                    />
                  </div>
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
                          placeholder="100%"
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
                          placeholder="180px"
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
                            placeholder="0"
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
                        placeholder="20px"
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <h3 className="mb-4 font-semibold text-slate-800">SEO</h3>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      SEO Title
                    </label>
                    <input
                      name="seoTitle"
                      placeholder="Tiêu đề SEO"
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      SEO Description
                    </label>
                    <textarea
                      name="seoDescription"
                      rows={3}
                      placeholder="Mô tả SEO"
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 font-semibold">Xuất bản</div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  Trạng thái
                </label>
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
              </div>

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
                  disabled={submitting}
                  onClick={() => setStatus("DRAFT")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {submitting ? "Đang lưu..." : "Lưu nháp"}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  onClick={() => setStatus("PUBLISHED")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  <Eye className="h-4 w-4" />
                  {submitting ? "Đang lưu..." : "Xuất bản"}
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
            <div className="border-b px-5 py-4 font-semibold">Ảnh đại diện</div>

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