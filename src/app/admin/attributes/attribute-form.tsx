"use client";

import { MediaPicker } from "@/components/admin/media-picker";
import Link from "next/link";
import { useMemo, useState } from "react";
import { saveAttributeAction } from "./attribute-actions";
import { normalizeCode } from "./attribute.schema";
import type {
  AdminAttributeDetail,
  AdminAttributeValueItem,
} from "./attribute.type";

type AttributeInputTypeValue =
  | "SELECT"
  | "MULTI_SELECT"
  | "TEXT"
  | "NUMBER"
  | "BOOLEAN"
  | "COLOR";

type AttributeValueFormItem = {
  id?: string;
  code: string;
  nameVi: string;
  nameEn: string;
  colorHex: string;
  image: string;
  sortOrder: number;
};

type PresetValue = {
  code: string;
  nameVi: string;
  nameEn: string;
  colorHex?: string;
  image?: string;
};

type Props = {
  locale: string;
  mode: "create" | "edit";
  initialData?: AdminAttributeDetail | null;
};

const ATTRIBUTE_TYPES: AttributeInputTypeValue[] = [
  "SELECT",
  "MULTI_SELECT",
  "COLOR",
  "NUMBER",
  "TEXT",
  "BOOLEAN",
];

const VALUE_BASED_TYPES: AttributeInputTypeValue[] = [
  "SELECT",
  "MULTI_SELECT",
  "COLOR",
];

const COLOR_PRESETS: PresetValue[] = [
  { code: "white", nameVi: "Trắng", nameEn: "White", colorHex: "#FFFFFF" },
  { code: "black", nameVi: "Đen", nameEn: "Black", colorHex: "#111111" },
  { code: "gray", nameVi: "Xám", nameEn: "Gray", colorHex: "#808080" },
  {
    code: "light-gray",
    nameVi: "Xám nhạt",
    nameEn: "Light gray",
    colorHex: "#D9D9D9",
  },
  {
    code: "dark-gray",
    nameVi: "Xám đậm",
    nameEn: "Dark gray",
    colorHex: "#4A4A4A",
  },
  { code: "beige", nameVi: "Be", nameEn: "Beige", colorHex: "#D8C3A5" },
  { code: "cream", nameVi: "Kem", nameEn: "Cream", colorHex: "#F5E6C8" },
  { code: "brown", nameVi: "Nâu", nameEn: "Brown", colorHex: "#8B5A2B" },
  { code: "gold", nameVi: "Vàng đồng", nameEn: "Gold", colorHex: "#D4AF37" },
  { code: "yellow", nameVi: "Vàng", nameEn: "Yellow", colorHex: "#F2C94C" },
  { code: "red", nameVi: "Đỏ", nameEn: "Red", colorHex: "#D64545" },
  { code: "green", nameVi: "Xanh lá", nameEn: "Green", colorHex: "#3F8F46" },
  { code: "blue", nameVi: "Xanh dương", nameEn: "Blue", colorHex: "#2F80ED" },
  { code: "silver", nameVi: "Bạc", nameEn: "Silver", colorHex: "#C0C0C0" },
  {
    code: "multi-color",
    nameVi: "Đa sắc",
    nameEn: "Multi color",
    colorHex: "#B8A47E",
  },
];

const STONE_VALUE_PRESETS: Record<string, PresetValue[]> = {
  material: [
    { code: "marble", nameVi: "Đá Marble", nameEn: "Marble" },
    { code: "granite", nameVi: "Đá Granite", nameEn: "Granite" },
    { code: "quartz", nameVi: "Đá Quartz", nameEn: "Quartz" },
    { code: "porcelain", nameVi: "Porcelain", nameEn: "Porcelain" },
    {
      code: "sintered-stone",
      nameVi: "Đá nung kết",
      nameEn: "Sintered stone",
    },
    { code: "travertine", nameVi: "Travertine", nameEn: "Travertine" },
    { code: "limestone", nameVi: "Đá Limestone", nameEn: "Limestone" },
    { code: "onyx", nameVi: "Đá Onyx", nameEn: "Onyx" },
    { code: "basalt", nameVi: "Đá Bazan", nameEn: "Basalt" },
    { code: "terrazzo", nameVi: "Terrazzo", nameEn: "Terrazzo" },
    {
      code: "artificial-stone",
      nameVi: "Đá nhân tạo",
      nameEn: "Artificial stone",
    },
    { code: "ceramic-tile", nameVi: "Gạch Ceramic", nameEn: "Ceramic tile" },
  ],

  stone_pattern: [
    { code: "plain", nameVi: "Trơn", nameEn: "Plain" },
    { code: "cloud-vein", nameVi: "Vân mây", nameEn: "Cloud vein" },
    { code: "linear-vein", nameVi: "Vân tia", nameEn: "Linear vein" },
    { code: "wood-vein", nameVi: "Vân gỗ", nameEn: "Wood vein" },
    { code: "grain", nameVi: "Vân hạt", nameEn: "Grain" },
    {
      code: "natural-stone",
      nameVi: "Vân đá tự nhiên",
      nameEn: "Natural stone",
    },
    {
      code: "terrazzo-pattern",
      nameVi: "Vân Terrazzo",
      nameEn: "Terrazzo pattern",
    },
    { code: "bookmatch", nameVi: "Vân đối xứng", nameEn: "Bookmatch" },
    { code: "calacatta", nameVi: "Calacatta", nameEn: "Calacatta" },
    { code: "carrara", nameVi: "Carrara", nameEn: "Carrara" },
    { code: "statuario", nameVi: "Statuario", nameEn: "Statuario" },
    { code: "arabescato", nameVi: "Arabescato", nameEn: "Arabescato" },
  ],

  surface: [
    { code: "polished", nameVi: "Bóng", nameEn: "Polished" },
    { code: "honed", nameVi: "Mài mờ", nameEn: "Honed" },
    { code: "matte", nameVi: "Mờ", nameEn: "Matte" },
    { code: "rough", nameVi: "Nhám", nameEn: "Rough" },
    { code: "flamed", nameVi: "Khò lửa", nameEn: "Flamed" },
    { code: "brushed", nameVi: "Chải xước", nameEn: "Brushed" },
    { code: "leathered", nameVi: "Da thuộc", nameEn: "Leathered" },
    { code: "sandblasted", nameVi: "Phun cát", nameEn: "Sandblasted" },
    { code: "bush-hammered", nameVi: "Băm mặt", nameEn: "Bush hammered" },
    { code: "anti-slip", nameVi: "Chống trơn", nameEn: "Anti-slip" },
  ],

  thickness: [
    { code: "6mm", nameVi: "6mm", nameEn: "6mm" },
    { code: "9mm", nameVi: "9mm", nameEn: "9mm" },
    { code: "12mm", nameVi: "12mm", nameEn: "12mm" },
    { code: "15mm", nameVi: "15mm", nameEn: "15mm" },
    { code: "18mm", nameVi: "18mm", nameEn: "18mm" },
    { code: "20mm", nameVi: "20mm", nameEn: "20mm" },
    { code: "25mm", nameVi: "25mm", nameEn: "25mm" },
    { code: "30mm", nameVi: "30mm", nameEn: "30mm" },
  ],

  size: [
    { code: "300x600", nameVi: "300 x 600mm", nameEn: "300 x 600mm" },
    { code: "600x600", nameVi: "600 x 600mm", nameEn: "600 x 600mm" },
    { code: "800x800", nameVi: "800 x 800mm", nameEn: "800 x 800mm" },
    { code: "600x1200", nameVi: "600 x 1200mm", nameEn: "600 x 1200mm" },
    { code: "750x1500", nameVi: "750 x 1500mm", nameEn: "750 x 1500mm" },
    { code: "800x1600", nameVi: "800 x 1600mm", nameEn: "800 x 1600mm" },
    { code: "1200x2400", nameVi: "1200 x 2400mm", nameEn: "1200 x 2400mm" },
    { code: "slab", nameVi: "Tấm lớn", nameEn: "Slab" },
    { code: "custom-cut", nameVi: "Cắt theo yêu cầu", nameEn: "Custom cut" },
  ],

  application: [
    { code: "wall-cladding", nameVi: "Ốp tường", nameEn: "Wall cladding" },
    { code: "flooring", nameVi: "Lát sàn", nameEn: "Flooring" },
    { code: "countertop", nameVi: "Mặt bếp", nameEn: "Countertop" },
    { code: "stairs", nameVi: "Cầu thang", nameEn: "Stairs" },
    { code: "facade", nameVi: "Mặt tiền", nameEn: "Facade" },
    { code: "bathroom", nameVi: "Phòng tắm", nameEn: "Bathroom" },
    { code: "kitchen", nameVi: "Phòng bếp", nameEn: "Kitchen" },
    { code: "table-top", nameVi: "Mặt bàn", nameEn: "Table top" },
    { code: "outdoor", nameVi: "Ngoài trời", nameEn: "Outdoor" },
    { code: "indoor", nameVi: "Trong nhà", nameEn: "Indoor" },
    { code: "landscape", nameVi: "Sân vườn", nameEn: "Landscape" },
    { code: "elevator", nameVi: "Thang máy", nameEn: "Elevator" },
  ],

  origin: [
    { code: "vietnam", nameVi: "Việt Nam", nameEn: "Vietnam" },
    { code: "italy", nameVi: "Ý", nameEn: "Italy" },
    { code: "spain", nameVi: "Tây Ban Nha", nameEn: "Spain" },
    { code: "china", nameVi: "Trung Quốc", nameEn: "China" },
    { code: "india", nameVi: "Ấn Độ", nameEn: "India" },
    { code: "turkey", nameVi: "Thổ Nhĩ Kỳ", nameEn: "Turkey" },
    { code: "brazil", nameVi: "Brazil", nameEn: "Brazil" },
    { code: "iran", nameVi: "Iran", nameEn: "Iran" },
    { code: "egypt", nameVi: "Ai Cập", nameEn: "Egypt" },
  ],

  slip_rating: [
    { code: "r9", nameVi: "R9", nameEn: "R9" },
    { code: "r10", nameVi: "R10", nameEn: "R10" },
    { code: "r11", nameVi: "R11", nameEn: "R11" },
    { code: "r12", nameVi: "R12", nameEn: "R12" },
    { code: "r13", nameVi: "R13", nameEn: "R13" },
  ],

  equipment_type: [
    { code: "stone-adhesive", nameVi: "Keo dán đá", nameEn: "Stone adhesive" },
    { code: "tile-adhesive", nameVi: "Keo dán gạch", nameEn: "Tile adhesive" },
    { code: "grout", nameVi: "Keo chà ron", nameEn: "Grout" },
    { code: "sealer", nameVi: "Chống thấm / phủ bảo vệ", nameEn: "Sealer" },
    { code: "cleaner", nameVi: "Dung dịch vệ sinh", nameEn: "Cleaner" },
    {
      code: "diamond-blade",
      nameVi: "Lưỡi cắt kim cương",
      nameEn: "Diamond blade",
    },
    { code: "polishing-pad", nameVi: "Pad đánh bóng", nameEn: "Polishing pad" },
    { code: "grinding-wheel", nameVi: "Đá mài", nameEn: "Grinding wheel" },
    {
      code: "leveling-system",
      nameVi: "Ke cân bằng gạch",
      nameEn: "Leveling system",
    },
    { code: "spacer", nameVi: "Ke chữ thập", nameEn: "Tile spacer" },
  ],

  tool_diameter: [
    { code: "100mm", nameVi: "100mm", nameEn: "100mm" },
    { code: "115mm", nameVi: "115mm", nameEn: "115mm" },
    { code: "125mm", nameVi: "125mm", nameEn: "125mm" },
    { code: "150mm", nameVi: "150mm", nameEn: "150mm" },
    { code: "180mm", nameVi: "180mm", nameEn: "180mm" },
    { code: "230mm", nameVi: "230mm", nameEn: "230mm" },
    { code: "300mm", nameVi: "300mm", nameEn: "300mm" },
    { code: "350mm", nameVi: "350mm", nameEn: "350mm" },
  ],

  compatible_machine: [
    { code: "angle-grinder", nameVi: "Máy mài góc", nameEn: "Angle grinder" },
    { code: "stone-cutter", nameVi: "Máy cắt đá", nameEn: "Stone cutter" },
    { code: "tile-cutter", nameVi: "Máy cắt gạch", nameEn: "Tile cutter" },
    {
      code: "polishing-machine",
      nameVi: "Máy đánh bóng",
      nameEn: "Polishing machine",
    },
    { code: "drill", nameVi: "Máy khoan", nameEn: "Drill" },
    { code: "cnc-machine", nameVi: "Máy CNC", nameEn: "CNC machine" },
    { code: "bridge-saw", nameVi: "Máy cắt cầu", nameEn: "Bridge saw" },
  ],
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

const labelClass = "mb-1 block text-sm font-medium text-slate-700";

function createEmptyValue(sortOrder: number): AttributeValueFormItem {
  return {
    code: "",
    nameVi: "",
    nameEn: "",
    colorHex: "",
    image: "",
    sortOrder,
  };
}

function mapInitialValues(values: AdminAttributeValueItem[]) {
  return values.map((value) => ({
    id: value.id,
    code: value.code,
    nameVi: value.nameVi,
    nameEn: value.nameEn,
    colorHex: value.colorHex || "",
    image: value.image || "",
    sortOrder: value.sortOrder,
  }));
}

function normalizeHex(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("#")) {
    return trimmed.toUpperCase();
  }

  return `#${trimmed}`.toUpperCase();
}

function isValidHex(value: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}

function getSafeColorValue(value: string) {
  return isValidHex(value) ? value : "#FFFFFF";
}

function getTypeDescription(type: AttributeInputTypeValue) {
  if (type === "COLOR") {
    return "Dùng cho tông màu đá/gạch. Có thể chọn màu gần đúng và thêm ảnh mẫu texture.";
  }

  if (type === "SELECT") {
    return "Dùng khi sản phẩm chỉ chọn một giá trị, ví dụ độ dày, kích thước, xuất xứ.";
  }

  if (type === "MULTI_SELECT") {
    return "Dùng khi sản phẩm có thể chọn nhiều giá trị, ví dụ ứng dụng, kiểu vân, máy tương thích.";
  }

  if (type === "NUMBER") {
    return "Dùng cho thông số dạng số nhập trực tiếp trên sản phẩm, ví dụ độ hút nước, tỷ trọng, độ cứng.";
  }

  if (type === "TEXT") {
    return "Dùng cho thông số tự do nhập trực tiếp trên sản phẩm, ví dụ ghi chú kỹ thuật.";
  }

  return "Dùng cho thông số có/không, ví dụ chống trơn, xuyên sáng, phù hợp ngoài trời.";
}

function shouldShowImageField(
  attributeCode: string,
  type: AttributeInputTypeValue
) {
  return (
    type === "COLOR" ||
    attributeCode === "stone_pattern" ||
    attributeCode === "surface" ||
    attributeCode === "material"
  );
}

function getValueTypeLabel(type: AttributeInputTypeValue) {
  if (type === "COLOR") return "Màu / texture";
  if (type === "SELECT") return "Danh sách chọn 1";
  if (type === "MULTI_SELECT") return "Danh sách chọn nhiều";
  if (type === "NUMBER") return "Nhập số ở sản phẩm";
  if (type === "BOOLEAN") return "Có / Không";
  return "Nhập text ở sản phẩm";
}

export function AttributeForm({ locale, mode, initialData }: Props) {
  const [attributeCode, setAttributeCode] = useState(initialData?.code || "");
  const [type, setType] = useState<AttributeInputTypeValue>(
    (initialData?.type as AttributeInputTypeValue) || "MULTI_SELECT"
  );

  const shouldManageValues = VALUE_BASED_TYPES.includes(type);
  const isColorType = type === "COLOR";
  const normalizedAttributeCode = normalizeCode(attributeCode);

  const [values, setValues] = useState<AttributeValueFormItem[]>(
    initialData?.values?.length
      ? mapInitialValues(initialData.values)
      : shouldManageValues
        ? [createEmptyValue(1)]
        : []
  );

  const currentPresets = isColorType
    ? COLOR_PRESETS
    : STONE_VALUE_PRESETS[normalizedAttributeCode] || [];

  const valuesForSubmit = shouldManageValues
    ? values.filter(
        (item) =>
          item.code.trim() ||
          item.nameVi.trim() ||
          item.nameEn.trim() ||
          item.colorHex.trim() ||
          item.image.trim()
      )
    : [];

  const valuesJson = useMemo(
    () => JSON.stringify(valuesForSubmit),
    [valuesForSubmit]
  );

  function updateValue(
    index: number,
    key: keyof AttributeValueFormItem,
    value: string | number
  ) {
    setValues((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        if (key === "code" && typeof value === "string") {
          return {
            ...item,
            code: normalizeCode(value),
          };
        }

        if (key === "colorHex" && typeof value === "string") {
          return {
            ...item,
            colorHex: normalizeHex(value),
          };
        }

        return {
          ...item,
          [key]: value,
        };
      })
    );
  }

  function applyPresetToRow(index: number, preset: PresetValue) {
    setValues((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        return {
          ...item,
          code: item.code || preset.code,
          nameVi: item.nameVi || preset.nameVi,
          nameEn: item.nameEn || preset.nameEn,
          colorHex: preset.colorHex || item.colorHex,
          image: preset.image || item.image,
        };
      })
    );
  }

  function addPreset(preset: PresetValue) {
    setValues((current) => {
      const existed = current.some((item) => item.code === preset.code);
      if (existed) return current;

      const cleanCurrent = current.filter(
        (item) => item.code || item.nameVi || item.nameEn || item.image
      );

      return [
        ...cleanCurrent,
        {
          code: preset.code,
          nameVi: preset.nameVi,
          nameEn: preset.nameEn,
          colorHex: preset.colorHex || "",
          image: preset.image || "",
          sortOrder: cleanCurrent.length + 1,
        },
      ];
    });
  }

  function addAllPresets() {
    setValues((current) => {
      const cleanCurrent = current.filter(
        (item) => item.code || item.nameVi || item.nameEn || item.image
      );

      const existingCodes = new Set(cleanCurrent.map((item) => item.code));

      const newItems = currentPresets
        .filter((preset) => !existingCodes.has(preset.code))
        .map((preset, index) => ({
          code: preset.code,
          nameVi: preset.nameVi,
          nameEn: preset.nameEn,
          colorHex: preset.colorHex || "",
          image: preset.image || "",
          sortOrder: cleanCurrent.length + index + 1,
        }));

      return [...cleanCurrent, ...newItems];
    });
  }

  function addValue() {
    setValues((current) => [...current, createEmptyValue(current.length + 1)]);
  }

  function removeValue(index: number) {
    setValues((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function handleTypeChange(nextType: AttributeInputTypeValue) {
    setType(nextType);

    if (VALUE_BASED_TYPES.includes(nextType)) {
      setValues((current) => {
        if (current.length) return current;
        return [createEmptyValue(1)];
      });
    }
  }

  return (
    <form action={saveAttributeAction} className="space-y-6">
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="id" value={initialData?.id || ""} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="valuesJson" value={valuesJson} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Thông tin thuộc tính
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Thuộc tính là nhóm dữ liệu dùng cho filter và thông số sản phẩm.
            Với ngành đá/gạch, nên dùng code ổn định như{" "}
            <code className="rounded bg-slate-100 px-1">color</code>,{" "}
            <code className="rounded bg-slate-100 px-1">stone_pattern</code>,{" "}
            <code className="rounded bg-slate-100 px-1">surface</code>.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>Code</label>
            <input
              name="code"
              value={attributeCode}
              placeholder="color, stone_pattern, surface"
              className={inputClass}
              onChange={(event) =>
                setAttributeCode(normalizeCode(event.target.value))
              }
              required
            />
            <p className="mt-1 text-xs text-slate-500">
              Code dùng trong URL filter, ví dụ{" "}
              <code className="rounded bg-slate-100 px-1">
                ?color=white,gray
              </code>
            </p>
          </div>

          <div>
            <label className={labelClass}>Kiểu dữ liệu</label>
            <select
              name="type"
              value={type}
              onChange={(event) =>
                handleTypeChange(event.target.value as AttributeInputTypeValue)
              }
              className={inputClass}
            >
              {ATTRIBUTE_TYPES.map((item) => (
                <option key={item} value={item}>
                  {item} — {getValueTypeLabel(item)}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              {getTypeDescription(type)}
            </p>
          </div>

          <div>
            <label className={labelClass}>Tên tiếng Việt</label>
            <input
              name="nameVi"
              defaultValue={initialData?.nameVi || ""}
              placeholder="Màu sắc"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Tên tiếng Anh</label>
            <input
              name="nameEn"
              defaultValue={initialData?.nameEn || ""}
              placeholder="Color"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Thứ tự hiển thị</label>
            <input
              name="sortOrder"
              type="number"
              defaultValue={initialData?.sortOrder ?? 0}
              className={inputClass}
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-6">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                name="isFilter"
                type="checkbox"
                defaultChecked={initialData?.isFilter ?? true}
                className="h-4 w-4 rounded border-slate-300"
              />
              Dùng làm bộ lọc
            </label>

            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                name="isVariantOption"
                type="checkbox"
                defaultChecked={initialData?.isVariantOption ?? false}
                className="h-4 w-4 rounded border-slate-300"
              />
              Dùng làm biến thể
            </label>
          </div>
        </div>
      </div>

      {!shouldManageValues && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-semibold text-amber-900">
            Kiểu này không cần danh sách giá trị
          </h2>
          <p className="mt-2 text-sm text-amber-800">
            Với <strong>{type}</strong>, admin sẽ nhập giá trị trực tiếp trong
            form sản phẩm. Ví dụ: độ hút nước = 0.05%, tỷ trọng = 2700 kg/m³,
            hoặc chống trơn = Có/Không.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-white p-4 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">NUMBER</div>
              <div className="mt-1">Độ hút nước, tỷ trọng, độ cứng</div>
            </div>

            <div className="rounded-xl bg-white p-4 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">TEXT</div>
              <div className="mt-1">Ghi chú kỹ thuật, tiêu chuẩn đá</div>
            </div>

            <div className="rounded-xl bg-white p-4 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">BOOLEAN</div>
              <div className="mt-1">Chống trơn, xuyên sáng, ngoài trời</div>
            </div>
          </div>
        </div>
      )}

      {shouldManageValues && currentPresets.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Gợi ý nhanh theo ngành đá
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Chọn nhanh các giá trị phổ biến. Với màu đá, HEX chỉ là màu gần
                đúng; ảnh mẫu texture sẽ thể hiện thật hơn.
              </p>
            </div>

            <button
              type="button"
              onClick={addAllPresets}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Thêm toàn bộ gợi ý
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {currentPresets.map((preset) => {
              const existed = values.some((item) => item.code === preset.code);

              return (
                <button
                  key={preset.code}
                  type="button"
                  onClick={() => addPreset(preset)}
                  disabled={existed}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                    existed
                      ? "border-green-200 bg-green-50 opacity-70"
                      : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {isColorType ? (
                    <span
                      className="h-9 w-9 shrink-0 rounded-full border border-slate-200 shadow-sm"
                      style={{
                        backgroundColor: preset.colorHex || "#FFFFFF",
                      }}
                    />
                  ) : (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-600">
                      +
                    </span>
                  )}

                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900">
                      {preset.nameVi}
                    </span>
                    <span className="block truncate text-xs text-slate-500">
                      {preset.code}
                      {preset.colorHex ? ` · ${preset.colorHex}` : ""}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {shouldManageValues && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Giá trị thuộc tính
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Đây là các lựa chọn admin sẽ gắn vào sản phẩm. Ví dụ màu trắng,
                vân mây, mặt bóng, đá Marble.
              </p>
            </div>

            <button
              type="button"
              onClick={addValue}
              className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Thêm giá trị
            </button>
          </div>

          <div className="space-y-4">
            {values.map((value, index) => {
              const showImageField = shouldShowImageField(
                normalizedAttributeCode,
                type
              );

              return (
                <div
                  key={`${value.id || "new"}-${index}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {isColorType && (
                        <div
                          className="h-9 w-9 rounded-full border border-slate-200 bg-white shadow-sm"
                          style={{
                            backgroundColor: getSafeColorValue(value.colorHex),
                          }}
                        />
                      )}

                      {value.image && (
                        <img
                          src={value.image}
                          alt={value.nameVi || value.code}
                          className="h-9 w-9 rounded-lg border border-slate-200 object-cover"
                        />
                      )}

                      <div>
                        <div className="text-sm font-semibold text-slate-700">
                          Giá trị #{index + 1}
                        </div>
                        {value.code && (
                          <div className="text-xs text-slate-500">
                            URL:{" "}
                            <code className="rounded bg-white px-1">
                              {value.code}
                            </code>
                          </div>
                        )}
                      </div>
                    </div>

                    {values.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeValue(index)}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Xoá
                      </button>
                    )}
                  </div>

                  {currentPresets.length > 0 && (
                    <div className="mb-4">
                      <div className="mb-2 text-xs font-medium text-slate-500">
                        Chọn nhanh cho dòng này
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {currentPresets.map((preset) => (
                          <button
                            key={preset.code}
                            type="button"
                            onClick={() => applyPresetToRow(index, preset)}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          >
                            {isColorType && (
                              <span
                                className="mr-1 inline-block h-3 w-3 rounded-full border border-slate-200 align-middle"
                                style={{
                                  backgroundColor:
                                    preset.colorHex || "#FFFFFF",
                                }}
                              />
                            )}
                            {preset.nameVi}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div
                    className={`grid gap-4 ${
                      showImageField ? "md:grid-cols-6" : "md:grid-cols-4"
                    }`}
                  >
                    <div>
                      <label className={labelClass}>Code</label>
                      <input
                        value={value.code}
                        onChange={(event) =>
                          updateValue(index, "code", event.target.value)
                        }
                        placeholder="white"
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Tên VI</label>
                      <input
                        value={value.nameVi}
                        onChange={(event) =>
                          updateValue(index, "nameVi", event.target.value)
                        }
                        placeholder="Trắng"
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Tên EN</label>
                      <input
                        value={value.nameEn}
                        onChange={(event) =>
                          updateValue(index, "nameEn", event.target.value)
                        }
                        placeholder="White"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Sort</label>
                      <input
                        type="number"
                        value={value.sortOrder}
                        onChange={(event) =>
                          updateValue(
                            index,
                            "sortOrder",
                            Number(event.target.value)
                          )
                        }
                        className={inputClass}
                      />
                    </div>

                    {isColorType && (
                      <div>
                        <label className={labelClass}>Màu gần đúng</label>

                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={getSafeColorValue(value.colorHex)}
                            onChange={(event) =>
                              updateValue(index, "colorHex", event.target.value)
                            }
                            className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                          />

                          <input
                            value={value.colorHex}
                            onChange={(event) =>
                              updateValue(index, "colorHex", event.target.value)
                            }
                            placeholder="#FFFFFF"
                            className={inputClass}
                          />
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          Màu chỉ để đại diện, ảnh texture mới thể hiện đá thật.
                        </p>
                      </div>
                    )}

                    {showImageField && (
                      <div>
                        <label className={labelClass}>Ảnh mẫu</label>

                        <MediaPicker
                          value={value.image}
                          onChange={(url) => updateValue(index, "image", url)}
                          variant="compact"
                        />

                        <p className="mt-1 text-xs text-slate-500">
                          Optional. Dùng cho texture/vân đá/bề mặt.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="sticky bottom-0 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
        <Link
          href={`/admin/attributes`}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Huỷ
        </Link>

        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          {mode === "create" ? "Tạo thuộc tính" : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}