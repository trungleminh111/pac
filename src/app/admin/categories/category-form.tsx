"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { saveCategoryAction } from "./category-actions";
import type {
  AdminCategoryAttributeItem,
  AdminCategoryDetail,
  AdminCategoryParentItem,
} from "./category.type";

type ContentTypeValue = "POST" | "PAGE" | "SERVICE" | "PRODUCT" | "PROJECT";

type AttributeLevelValue = "REQUIRED" | "RECOMMENDED" | "OPTIONAL";

type DetailTemplateValue = "default" | "page2";

type AttributeRow = {
  attributeId: string;
  checked: boolean;
  level: AttributeLevelValue;
  sortOrder: number;
};

type Props = {
  mode: "create" | "edit";
  category?: AdminCategoryDetail | null;
  parents: AdminCategoryParentItem[];
  attributes: AdminCategoryAttributeItem[];
};

const CONTENT_TYPES: {
  value: ContentTypeValue;
  label: string;
  helper: string;
}[] = [
  {
    value: "PRODUCT",
    label: "Sản phẩm",
    helper: "Cho phép gắn bộ thông số sản phẩm",
  },
  {
    value: "POST",
    label: "Bài viết",
    helper: "Danh mục tin tức / blog",
  },
  {
    value: "PROJECT",
    label: "Dự án",
    helper: "Danh mục công trình / dự án",
  },
  {
    value: "SERVICE",
    label: "Dịch vụ",
    helper: "Danh mục dịch vụ",
  },
  {
    value: "PAGE",
    label: "Trang",
    helper: "Ít dùng, chỉ dùng khi cần nhóm page",
  },
];

const DETAIL_TEMPLATES: {
  value: DetailTemplateValue;
  label: string;
  helper: string;
  bestFor: string;
}[] = [
  {
    value: "default",
    label: "Giao diện mặc định",
    helper: "Layout tiêu chuẩn, dễ dùng cho hầu hết category.",
    bestFor: "Đá, gạch, bài viết, dịch vụ, dự án thông thường",
  },
  {
    value: "page2",
    label: "Giao diện nổi bật / layout 2",
    helper: "Layout nhấn mạnh hình ảnh, nội dung giới thiệu hoặc landing page.",
    bestFor: "Category cần trình bày đẹp hơn như bộ sưu tập, showroom, dòng sản phẩm nổi bật",
  },
];

const LEVEL_OPTIONS: {
  value: AttributeLevelValue;
  label: string;
  helper: string;
  badgeClass: string;
}[] = [
  {
    value: "REQUIRED",
    label: "Bắt buộc",
    helper: "Product phải nhập",
    badgeClass: "border-red-200 bg-red-50 text-red-700",
  },
  {
    value: "RECOMMENDED",
    label: "Khuyến nghị",
    helper: "Nên nhập nhưng không bắt buộc",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
  },
  {
    value: "OPTIONAL",
    label: "Tuỳ chọn",
    helper: "Không nhập thì không hiển thị",
    badgeClass: "border-slate-200 bg-slate-50 text-slate-600",
  },
];

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

const labelClass = "mb-1 block text-sm font-medium text-slate-700";

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getLevelMeta(level: AttributeLevelValue) {
  return LEVEL_OPTIONS.find((item) => item.value === level) || LEVEL_OPTIONS[2];
}

function getTemplateMeta(value: string) {
  return (
    DETAIL_TEMPLATES.find((item) => item.value === value) ||
    DETAIL_TEMPLATES[0]
  );
}

function createInitialRows({
  attributes,
  category,
}: {
  attributes: AdminCategoryAttributeItem[];
  category?: AdminCategoryDetail | null;
}): AttributeRow[] {
  const selectedMap = new Map(
    (category?.selectedAttributes || []).map((item) => [
      item.attributeId,
      item,
    ])
  );

  return attributes.map((attribute, index) => {
    const selected = selectedMap.get(attribute.id);

    return {
      attributeId: attribute.id,
      checked: Boolean(selected),
      level: (selected?.level as AttributeLevelValue) || "OPTIONAL",
      sortOrder: selected?.sortOrder || attribute.sortOrder || index + 1,
    };
  });
}

export function CategoryForm({
  mode,
  category,
  parents,
  attributes,
}: Props) {
  const [type, setType] = useState<ContentTypeValue>(
    (category?.type as ContentTypeValue) || "PRODUCT"
  );

  const [baseSlug, setBaseSlug] = useState(category?.slug || "");
  const [slugVi, setSlugVi] = useState(category?.slugVi || "");
  const [slugEn, setSlugEn] = useState(category?.slugEn || "");

  const [detailTemplate, setDetailTemplate] = useState<DetailTemplateValue>(
    (category?.detailTemplate as DetailTemplateValue) || "default"
  );

  const [attributeRows, setAttributeRows] = useState<AttributeRow[]>(
    createInitialRows({ attributes, category })
  );

  const isProductType = type === "PRODUCT";

  const filteredParents = parents.filter((parent) => parent.type === type);

  const selectedTemplate = getTemplateMeta(detailTemplate);

  const selectedAttributes = useMemo(
    () =>
      attributeRows
        .filter((row) => row.checked)
        .map((row) => ({
          attributeId: row.attributeId,
          level: row.level,
          sortOrder: row.sortOrder,
        })),
    [attributeRows]
  );

  const attributesJson = useMemo(
    () => JSON.stringify(isProductType ? selectedAttributes : []),
    [isProductType, selectedAttributes]
  );

  const selectedCount = selectedAttributes.length;
  const requiredCount = selectedAttributes.filter(
    (item) => item.level === "REQUIRED"
  ).length;
  const recommendedCount = selectedAttributes.filter(
    (item) => item.level === "RECOMMENDED"
  ).length;

  function updateAttributeRow(
    attributeId: string,
    data: Partial<AttributeRow>
  ) {
    setAttributeRows((current) =>
      current.map((row) =>
        row.attributeId === attributeId
          ? {
              ...row,
              ...data,
            }
          : row
      )
    );
  }

  function selectRecommendedStonePreset() {
    const recommendedMap: Record<string, AttributeLevelValue> = {
      color: "REQUIRED",
      material: "REQUIRED",
      stone_pattern: "RECOMMENDED",
      surface: "RECOMMENDED",
      thickness: "OPTIONAL",
      size: "OPTIONAL",
      application: "OPTIONAL",
      origin: "OPTIONAL",
      slip_rating: "OPTIONAL",
      anti_slip: "OPTIONAL",
      outdoor_suitable: "OPTIONAL",
      translucent: "OPTIONAL",
    };

    setAttributeRows((current) =>
      current.map((row) => {
        const attribute = attributes.find((item) => item.id === row.attributeId);
        const level = attribute ? recommendedMap[attribute.code] : undefined;

        if (!level) return row;

        return {
          ...row,
          checked: true,
          level,
        };
      })
    );
  }

  function selectEquipmentPreset() {
    const recommendedMap: Record<string, AttributeLevelValue> = {
      equipment_type: "REQUIRED",
      tool_diameter: "RECOMMENDED",
      compatible_machine: "RECOMMENDED",
      material: "OPTIONAL",
      application: "OPTIONAL",
    };

    setAttributeRows((current) =>
      current.map((row) => {
        const attribute = attributes.find((item) => item.id === row.attributeId);
        const level = attribute ? recommendedMap[attribute.code] : undefined;

        if (!level) return row;

        return {
          ...row,
          checked: true,
          level,
        };
      })
    );
  }

  function clearAttributes() {
    setAttributeRows((current) =>
      current.map((row) => ({
        ...row,
        checked: false,
      }))
    );
  }

  return (
    <form action={saveCategoryAction} className="space-y-6">
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="id" value={category?.id || ""} />
      <input type="hidden" name="attributesJson" value={attributesJson} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Thông tin category
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Chỉ category loại <strong>Sản phẩm</strong> mới được chọn bộ thông
            số. Template giao diện chỉ là cách hiển thị ngoài website, admin
            không cần nhớ code kỹ thuật.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>Loại category</label>
            <select
              name="type"
              value={type}
              onChange={(event) =>
                setType(event.target.value as ContentTypeValue)
              }
              className={inputClass}
            >
              {CONTENT_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label} — {item.value}
                </option>
              ))}
            </select>

            <p className="mt-1 text-xs text-slate-500">
              {CONTENT_TYPES.find((item) => item.value === type)?.helper}
            </p>
          </div>

          <div>
            <label className={labelClass}>Category cha</label>
            <select
              name="parentId"
              defaultValue={category?.parentId || ""}
              className={inputClass}
            >
              <option value="">Không có category cha</option>

              {filteredParents.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.name} — {parent.type}
                </option>
              ))}
            </select>

            <p className="mt-1 text-xs text-slate-500">
              Chỉ hiện category cha cùng loại để tránh chọn nhầm.
            </p>
          </div>

          <div>
            <label className={labelClass}>Slug gốc</label>
            <input
              name="slug"
              value={baseSlug}
              onChange={(event) => setBaseSlug(normalizeSlug(event.target.value))}
              placeholder="da-marble"
              className={inputClass}
              required
            />
            <p className="mt-1 text-xs text-slate-500">
              Slug kỹ thuật dùng làm fallback. Ví dụ:{" "}
              <code className="rounded bg-slate-100 px-1">da-marble</code>
            </p>
          </div>

          <div>
            <label className={labelClass}>Giao diện chi tiết</label>
            <select
              name="detailTemplate"
              value={detailTemplate}
              onChange={(event) =>
                setDetailTemplate(event.target.value as DetailTemplateValue)
              }
              className={inputClass}
            >
              {DETAIL_TEMPLATES.map((template) => (
                <option key={template.value} value={template.value}>
                  {template.label}
                </option>
              ))}
            </select>

            <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-sm font-medium text-slate-800">
                {selectedTemplate.label}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {selectedTemplate.helper}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Phù hợp: {selectedTemplate.bestFor}
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Code lưu DB:{" "}
                <code className="rounded bg-white px-1 py-0.5">
                  {selectedTemplate.value}
                </code>
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Thứ tự</label>
            <input
              name="sortOrder"
              type="number"
              defaultValue={category?.sortOrder ?? 0}
              className={inputClass}
            />
          </div>

          <div className="flex items-center pt-6">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={category?.isActive ?? true}
                className="h-4 w-4 rounded border-slate-300"
              />
              Đang hoạt động
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Nội dung đa ngôn ngữ
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Website vẫn có tiếng Việt / tiếng Anh, nhưng admin route không cần
            `/vi` hoặc `/en`.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>Tên tiếng Việt</label>
            <input
              name="nameVi"
              defaultValue={category?.nameVi || ""}
              placeholder="Đá Marble"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Slug tiếng Việt</label>
            <input
              name="slugVi"
              value={slugVi}
              onChange={(event) => setSlugVi(normalizeSlug(event.target.value))}
              placeholder="da-marble"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tên tiếng Anh</label>
            <input
              name="nameEn"
              defaultValue={category?.nameEn || ""}
              placeholder="Marble Stone"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Slug tiếng Anh</label>
            <input
              name="slugEn"
              value={slugEn}
              onChange={(event) => setSlugEn(normalizeSlug(event.target.value))}
              placeholder="marble-stone"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {!isProductType && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Không cần chọn thuộc tính
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Category loại <strong>{type}</strong> không dùng thông số sản phẩm.
            Phần thuộc tính chỉ áp dụng cho category loại{" "}
            <strong>PRODUCT</strong>.
          </p>
        </div>
      )}

      {isProductType && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Bộ thông số cho sản phẩm
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Đây là bộ thông số gợi ý cho sản phẩm trong category này. Khi tạo
                sản phẩm, thông số bỏ trống sẽ không hiển thị ngoài website.
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700">
                  Đã chọn: {selectedCount}
                </span>
                <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-700">
                  Bắt buộc: {requiredCount}
                </span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700">
                  Khuyến nghị: {recommendedCount}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={selectRecommendedStonePreset}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Preset đá / gạch
              </button>

              <button
                type="button"
                onClick={selectEquipmentPreset}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Preset thiết bị
              </button>

              <button
                type="button"
                onClick={clearAttributes}
                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                Bỏ chọn hết
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-[52px_1fr_180px_100px] gap-3 border-b bg-slate-50 px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              <div>Chọn</div>
              <div>Thuộc tính</div>
              <div>Mức độ</div>
              <div>Sort</div>
            </div>

            <div className="divide-y divide-slate-100">
              {attributes.map((attribute) => {
                const row = attributeRows.find(
                  (item) => item.attributeId === attribute.id
                );

                if (!row) return null;

                const levelMeta = getLevelMeta(row.level);

                return (
                  <div
                    key={attribute.id}
                    className={`grid grid-cols-[52px_1fr_180px_100px] gap-3 px-4 py-4 ${
                      row.checked ? "bg-white" : "bg-slate-50/60"
                    }`}
                  >
                    <div className="pt-2">
                      <input
                        type="checkbox"
                        checked={row.checked}
                        onChange={(event) =>
                          updateAttributeRow(attribute.id, {
                            checked: event.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-slate-300"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="font-medium text-slate-900">
                        {attribute.nameVi || attribute.code}
                      </div>

                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                        <code className="rounded bg-slate-100 px-1.5 py-0.5">
                          {attribute.code}
                        </code>
                        <span>{attribute.type}</span>
                        {attribute.isFilter && <span>Filter</span>}
                        {attribute.isVariantOption && <span>Variant</span>}
                      </div>

                      {row.checked && (
                        <div
                          className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${levelMeta.badgeClass}`}
                        >
                          {levelMeta.label} — {levelMeta.helper}
                        </div>
                      )}
                    </div>

                    <div>
                      <select
                        value={row.level}
                        disabled={!row.checked}
                        onChange={(event) =>
                          updateAttributeRow(attribute.id, {
                            level: event.target.value as AttributeLevelValue,
                          })
                        }
                        className={inputClass}
                      >
                        {LEVEL_OPTIONS.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <input
                        type="number"
                        value={row.sortOrder}
                        disabled={!row.checked}
                        onChange={(event) =>
                          updateAttributeRow(attribute.id, {
                            sortOrder: Number(event.target.value),
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            <strong>Gợi ý UX:</strong> Product form sau này sẽ tự hiện các thông
            số này theo category. Thông số tuỳ chọn bỏ trống thì không lưu và
            không hiển thị ngoài website.
          </div>
        </div>
      )}

      <div className="sticky bottom-0 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
        <Link
          href="/admin/categories"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Huỷ
        </Link>

        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          {mode === "create" ? "Tạo category" : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}