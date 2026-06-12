"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Save } from "lucide-react";
import { PostEditor } from "@/components/admin/post-editor";
import { MediaPicker } from "@/components/admin/media-picker";
import { MediaGalleryPicker } from "@/components/admin/media-gallery-picker";
import type {
  ProductActionState,
  ProductEditData,
  ProductFormAttributeItem,
  ProductFormCategoryItem,
} from "./product-form.type";

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

type Status = "DRAFT" | "PUBLISHED" | "ARCHIVED";

const defaultStyleConfig: StyleConfig = {
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },
  card: {
    marginTop: "0",
    marginRight: "0",
    marginBottom: "0",
    marginLeft: "0",
    borderRadius: "",
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
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatMoney(value: string) {
  const number = value.replace(/\D/g, "");
  if (!number) return "";
  return Number(number).toLocaleString("vi-VN");
}

function moneyToDisplay(value: string) {
  if (!value) return "";
  return formatMoney(value);
}

function parseStyleConfig(value: any): StyleConfig {
  if (!value) return defaultStyleConfig;

  const margin = String(value?.card?.margin || "0 0 0 0").split(" ");

  return {
    image: {
      width: value?.image?.width || "100%",
      height: value?.image?.height || "180px",
      objectFit: value?.image?.objectFit || "cover",
    },
    card: {
      marginTop: margin[0] || "0",
      marginRight: margin[1] || "0",
      marginBottom: margin[2] || "0",
      marginLeft: margin[3] || "0",
      borderRadius: value?.card?.borderRadius || "",
    },
  };
}

function isEmptyValue(value: unknown) {
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "boolean") return false;
  if (value === 0) return false;
  if (value === null || value === undefined) return true;
  return String(value).trim() === "";
}

function getLevelTitle(level: ProductFormAttributeItem["level"]) {
  if (level === "REQUIRED") return "Bắt buộc";
  if (level === "RECOMMENDED") return "Khuyến nghị";
  return "Tuỳ chọn";
}

function getLevelHelper(level: ProductFormAttributeItem["level"]) {
  if (level === "REQUIRED") return "Cần nhập trước khi lưu sản phẩm.";
  if (level === "RECOMMENDED") return "Nên nhập nếu có dữ liệu.";
  return "Không nhập thì website sẽ không hiển thị.";
}

function getLevelClass(level: ProductFormAttributeItem["level"]) {
  if (level === "REQUIRED") return "border-red-200 bg-red-50 text-red-700";
  if (level === "RECOMMENDED")
    return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function mapInitialAttributeValues(initialData?: ProductEditData | null) {
  const result: Record<string, string | string[] | boolean> = {};

  for (const item of initialData?.attributeValues || []) {
    result[item.attributeId] = item.value;
  }

  return result;
}

export default function ProductForm({
  mode,
  action,
  categories,
  initialData,
}: {
  mode: "create" | "edit";
  action: (
    prevState: ProductActionState,
    formData: FormData
  ) => Promise<ProductActionState>;
  categories: ProductFormCategoryItem[];
  initialData?: ProductEditData | null;
}) {
  const router = useRouter();

  const activeLocale = initialData?.translation.locale || "vi";

  const [state, setState] = useState<ProductActionState>({
    ok: false,
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Nhóm field dịch: độc lập theo locale.
  const [title, setTitle] = useState(initialData?.translation.title || "");
  const [slug, setSlug] = useState(initialData?.translation.slug || "");
  const [slugTouched, setSlugTouched] = useState(
    Boolean(initialData?.translation.slug)
  );

  const [excerpt, setExcerpt] = useState(
    initialData?.translation.excerpt || ""
  );
  const [content, setContent] = useState(
    initialData?.translation.content || ""
  );
  const [seoTitle, setSeoTitle] = useState(
    initialData?.translation.seoTitle || ""
  );
  const [seoDescription, setSeoDescription] = useState(
    initialData?.translation.seoDescription || ""
  );

  // Nhóm field dùng chung cho sản phẩm.
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || []);

  const [priceDisplay, setPriceDisplay] = useState(
    moneyToDisplay(initialData?.price || "")
  );
  const [salePriceDisplay, setSalePriceDisplay] = useState(
    moneyToDisplay(initialData?.salePrice || "")
  );

  const [status, setStatus] = useState<Status>(
    (initialData?.status as Status) || "DRAFT"
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialData?.categoryId || ""
  );

  const [attributeValues, setAttributeValues] = useState<
    Record<string, string | string[] | boolean>
  >(mapInitialAttributeValues(initialData));

  const [styleConfig, setStyleConfig] = useState<StyleConfig>(
    parseStyleConfig(initialData?.styleConfig)
  );

  // Khi đổi VI <-> EN, reset đúng dữ liệu locale mới.
  useEffect(() => {
    setTitle(initialData?.translation.title || "");
    setSlug(initialData?.translation.slug || "");
    setSlugTouched(Boolean(initialData?.translation.slug));

    setExcerpt(initialData?.translation.excerpt || "");
    setContent(initialData?.translation.content || "");
    setSeoTitle(initialData?.translation.seoTitle || "");
    setSeoDescription(initialData?.translation.seoDescription || "");

    setThumbnail(initialData?.thumbnail || "");
    setGallery(initialData?.gallery || []);
    setPriceDisplay(moneyToDisplay(initialData?.price || ""));
    setSalePriceDisplay(moneyToDisplay(initialData?.salePrice || ""));
    setStatus((initialData?.status as Status) || "DRAFT");
    setSelectedCategoryId(initialData?.categoryId || "");
    setAttributeValues(mapInitialAttributeValues(initialData));
    setStyleConfig(parseStyleConfig(initialData?.styleConfig));
  }, [initialData?.id, initialData?.translation.locale]);

  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId
  );

  const selectedAttributes = selectedCategory?.attributes || [];

  const existingAttributeIds = useMemo(
    () => (initialData?.attributeValues || []).map((item) => item.attributeId),
    [initialData?.attributeValues]
  );

  const attributeScopeJson = useMemo(() => {
    const ids = Array.from(
      new Set([
        ...selectedAttributes.map((item) => item.id),
        ...existingAttributeIds,
      ])
    );

    return JSON.stringify(ids.map((attributeId) => ({ attributeId })));
  }, [selectedAttributes, existingAttributeIds]);

  const groupedAttributes = useMemo(() => {
    return [
      {
        level: "REQUIRED" as const,
        items: selectedAttributes.filter((item) => item.level === "REQUIRED"),
      },
      {
        level: "RECOMMENDED" as const,
        items: selectedAttributes.filter(
          (item) => item.level === "RECOMMENDED"
        ),
      },
      {
        level: "OPTIONAL" as const,
        items: selectedAttributes.filter((item) => item.level === "OPTIONAL"),
      },
    ].filter((group) => group.items.length > 0);
  }, [selectedAttributes]);

  const attributeValuesJson = useMemo(() => {
    const items = selectedAttributes
      .map((attribute) => ({
        attributeId: attribute.id,
        code: attribute.code,
        type: attribute.type,
        value: attributeValues[attribute.id],
      }))
      .filter((item) => !isEmptyValue(item.value));

    return JSON.stringify(items);
  }, [attributeValues, selectedAttributes]);

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

  function updateAttributeValue(
    attributeId: string,
    value: string | string[] | boolean
  ) {
    setAttributeValues((current) => ({
      ...current,
      [attributeId]: value,
    }));
  }

  function toggleMultiValue(attributeId: string, valueId: string) {
    setAttributeValues((current) => {
      const currentValues = Array.isArray(current[attributeId])
        ? (current[attributeId] as string[])
        : [];

      const nextValues = currentValues.includes(valueId)
        ? currentValues.filter((item) => item !== valueId)
        : [...currentValues, valueId];

      return {
        ...current,
        [attributeId]: nextValues,
      };
    });
  }

  function validateRequiredAttributes() {
    const missing = selectedAttributes.filter(
      (attribute) =>
        attribute.level === "REQUIRED" &&
        isEmptyValue(attributeValues[attribute.id])
    );

    if (!missing.length) return "";

    return `Vui lòng nhập thông số bắt buộc:\n${missing
      .map((item) => `- ${item.nameVi || item.code}`)
      .join("\n")}`;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const requiredError = validateRequiredAttributes();

    if (requiredError) {
      setState({
        ok: false,
        message: requiredError,
      });
      return;
    }

    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const nativeEvent = e.nativeEvent as SubmitEvent;
    const submitter = nativeEvent.submitter as HTMLButtonElement | null;
    const nextStatus = (submitter?.value as Status) || status;

    setStatus(nextStatus);
    formData.set("status", nextStatus);

    const result = await action(state, formData);

    setState(result);
  }

  function renderAttributeInput(attribute: ProductFormAttributeItem) {
    const currentValue = attributeValues[attribute.id];

    if (attribute.type === "SELECT" || attribute.type === "COLOR") {
      return (
        <select
          value={typeof currentValue === "string" ? currentValue : ""}
          onChange={(event) =>
            updateAttributeValue(attribute.id, event.target.value)
          }
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
        >
          <option value="">Không chọn</option>

          {attribute.values.map((value) => (
            <option key={value.id} value={value.id}>
              {value.nameVi || value.code}
              {value.nameEn ? ` / ${value.nameEn}` : ""}
            </option>
          ))}
        </select>
      );
    }

    if (attribute.type === "MULTI_SELECT") {
      const selectedValues = Array.isArray(currentValue)
        ? (currentValue as string[])
        : [];

      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {attribute.values.map((value) => (
            <label
              key={value.id}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                selectedValues.includes(value.id)
                  ? "border-[#2271b1] bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(value.id)}
                onChange={() => toggleMultiValue(attribute.id, value.id)}
              />

              {value.image ? (
                <img
                  src={value.image}
                  alt={value.nameVi || value.code}
                  className="h-7 w-7 rounded-lg object-cover"
                />
              ) : value.colorHex ? (
                <span
                  className="h-5 w-5 rounded-full border"
                  style={{ backgroundColor: value.colorHex }}
                />
              ) : null}

              <span>{value.nameVi || value.code}</span>
            </label>
          ))}
        </div>
      );
    }

    if (attribute.type === "BOOLEAN") {
      return (
        <select
          value={
            typeof currentValue === "boolean"
              ? currentValue
                ? "true"
                : "false"
              : ""
          }
          onChange={(event) => {
            const value = event.target.value;

            if (!value) {
              updateAttributeValue(attribute.id, "");
              return;
            }

            updateAttributeValue(attribute.id, value === "true");
          }}
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
        >
          <option value="">Không chọn</option>
          <option value="true">Có</option>
          <option value="false">Không</option>
        </select>
      );
    }

    if (attribute.type === "NUMBER") {
      return (
        <input
          type="number"
          value={typeof currentValue === "string" ? currentValue : ""}
          onChange={(event) =>
            updateAttributeValue(attribute.id, event.target.value)
          }
          placeholder="Nhập số"
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
        />
      );
    }

    return (
      <input
        value={typeof currentValue === "string" ? currentValue : ""}
        onChange={(event) =>
          updateAttributeValue(attribute.id, event.target.value)
        }
        placeholder="Nhập thông số"
        className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={initialData?.id || ""} />
      <input type="hidden" name="locale" value={activeLocale} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="styleConfig" value={styleConfigValue} />
      <input type="hidden" name="attributeValuesJson" value={attributeValuesJson} />
      <input type="hidden" name="attributeScopeJson" value={attributeScopeJson} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            {mode === "create" ? "Thêm sản phẩm" : "Sửa sản phẩm"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Nội dung VI/EN lưu độc lập. Giá, ảnh, gallery, thông số dùng chung.
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
            <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h2 className="font-semibold text-blue-950">
                    Bản ngôn ngữ
                  </h2>
                  <p className="mt-1 text-sm text-blue-700">
                    Title, slug, mô tả, content và SEO lưu riêng theo từng ngôn ngữ.
                  </p>
                </div>

                {mode === "edit" && initialData?.id ? (
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${initialData.id}/edit?locale=vi`}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                        activeLocale === "vi"
                          ? "bg-[#2271b1] text-white"
                          : "border border-blue-200 bg-white text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      Tiếng Việt
                    </Link>

                    <Link
                      href={`/admin/products/${initialData.id}/edit?locale=en`}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                        activeLocale === "en"
                          ? "bg-[#2271b1] text-white"
                          : "border border-blue-200 bg-white text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      English
                    </Link>
                  </div>
                ) : (
                  <div className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-blue-700">
                    Tạo mới mặc định bằng Tiếng Việt
                  </div>
                )}
              </div>

              {activeLocale === "en" && !title && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  Bản English chưa có. Nhập nội dung English rồi bấm lưu để tạo.
                </div>
              )}

              {activeLocale === "vi" && (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  Bạn đang sửa bản Tiếng Việt.
                </div>
              )}
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
                  onChange={(event) => {
                    const value = event.target.value;
                    setTitle(value);

                    if (!slugTouched) {
                      setSlug(toSlug(value));
                    }
                  }}
                  placeholder={
                    activeLocale === "en"
                      ? "Product name in English"
                      : "Nhập tên sản phẩm"
                  }
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
                  placeholder={
                    activeLocale === "en" ? "product-slug" : "slug-san-pham"
                  }
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                />

                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">
                    Slug tự chạy theo tên nếu bạn chưa sửa tay.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSlugTouched(false);
                      setSlug(toSlug(title));
                    }}
                    className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Tạo slug theo tên
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Mô tả ngắn
                </label>

                <textarea
                  name="excerpt"
                  value={excerpt}
                  onChange={(event) => setExcerpt(event.target.value)}
                  rows={3}
                  placeholder={
                    activeLocale === "en"
                      ? "Short product description"
                      : "Mô tả ngắn về sản phẩm"
                  }
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nội dung chi tiết
                </label>

                <PostEditor
                  key={`${initialData?.id || "new"}-${activeLocale}`}
                  value={content}
                  onChange={setContent}
                />
                <input type="hidden" name="content" value={content} />
              </div>

              <div className="rounded-xl border p-4">
                <h3 className="mb-4 font-semibold text-slate-800">
                  Thông tin bán hàng
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Mã sản phẩm / SKU
                    </label>
                    <input
                      name="sku"
                      defaultValue={initialData?.sku || ""}
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
                      onChange={(event) =>
                        setPriceDisplay(formatMoney(event.target.value))
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
                      Giá khuyến mãi
                    </label>
                    <input
                      value={salePriceDisplay}
                      onChange={(event) =>
                        setSalePriceDisplay(formatMoney(event.target.value))
                      }
                      placeholder="VD: 9.500.000"
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                    />
                    <input
                      type="hidden"
                      name="salePrice"
                      value={salePriceDisplay.replace(/\D/g, "")}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-800">
                    Thông số sản phẩm
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Thông số dùng chung cho cả VI/EN. Bỏ trống thì website không hiển thị.
                  </p>
                </div>

                {!selectedCategoryId && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                    Chọn danh mục sản phẩm để hiện bộ thông số.
                  </div>
                )}

                {selectedCategoryId && selectedAttributes.length === 0 && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
                    Danh mục này chưa được cấu hình thông số. Vào Admin
                    Categories để chọn bộ thông số cho danh mục.
                  </div>
                )}

                {groupedAttributes.length > 0 && (
                  <div className="space-y-5">
                    {groupedAttributes.map((group) => (
                      <div key={group.level}>
                        <div
                          className={`mb-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getLevelClass(
                            group.level
                          )}`}
                        >
                          {getLevelTitle(group.level)} —{" "}
                          {getLevelHelper(group.level)}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          {group.items.map((attribute) => (
                            <div key={attribute.id}>
                              <label className="mb-1.5 block text-sm font-medium text-slate-600">
                                {attribute.nameVi || attribute.code}
                                {attribute.level === "REQUIRED" && (
                                  <span className="text-red-500"> *</span>
                                )}
                              </label>

                              {renderAttributeInput(attribute)}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                          onChange={(event) =>
                            setStyleConfig((current) => ({
                              ...current,
                              image: {
                                ...current.image,
                                width: event.target.value,
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
                          onChange={(event) =>
                            setStyleConfig((current) => ({
                              ...current,
                              image: {
                                ...current.image,
                                height: event.target.value,
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
                          onChange={(event) =>
                            setStyleConfig((current) => ({
                              ...current,
                              image: {
                                ...current.image,
                                objectFit: event.target.value,
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
                            onChange={(event) =>
                              setStyleConfig((current) => ({
                                ...current,
                                card: {
                                  ...current.card,
                                  [key]: event.target.value,
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
                        onChange={(event) =>
                          setStyleConfig((current) => ({
                            ...current,
                            card: {
                              ...current.card,
                              borderRadius: event.target.value,
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
                <h3 className="mb-4 font-semibold text-slate-800">
                  SEO {activeLocale === "en" ? "English" : "Tiếng Việt"}
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      SEO Title
                    </label>
                    <input
                      name="seoTitle"
                      value={seoTitle}
                      onChange={(event) => setSeoTitle(event.target.value)}
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
                      value={seoDescription}
                      onChange={(event) =>
                        setSeoDescription(event.target.value)
                      }
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
                  onChange={(event) => setStatus(event.target.value as Status)}
                  className="w-full rounded-xl border px-4 py-3 text-sm"
                >
                  <option value="DRAFT">Bản nháp</option>
                  <option value="PUBLISHED">Xuất bản</option>
                  <option value="ARCHIVED">Lưu trữ</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  name="isFeatured"
                  type="checkbox"
                  defaultChecked={initialData?.isFeatured || false}
                />
                Sản phẩm nổi bật
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  name="allowIndex"
                  type="checkbox"
                  defaultChecked={initialData?.allowIndex ?? true}
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
            <div className="border-b px-5 py-4 font-semibold">Danh mục</div>

            <div className="p-5">
              <select
                name="categoryId"
                value={selectedCategoryId}
                onChange={(event) => {
                  setSelectedCategoryId(event.target.value);
                }}
                className="w-full rounded-xl border px-4 py-3 text-sm"
              >
                <option value="">Không chọn</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nameVi}
                    {category.nameEn ? ` / ${category.nameEn}` : ""}
                  </option>
                ))}
              </select>

              {selectedCategory && (
                <p className="mt-2 text-xs text-slate-500">
                  Đang dùng bộ thông số của:{" "}
                  <strong>{selectedCategory.nameVi}</strong>
                </p>
              )}
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