"use client";

import Link from "next/link";
import { useState } from "react";
import { Save } from "lucide-react";

type MenuItem = {
  id: string;
  labelVi: string;
  labelEn: string | null;
  urlVi: string | null;
  urlEn: string | null;
  parentId: string | null;
  icon: string | null;
  target: string | null;
  isActive: boolean;
  menu: {
    name: string;
    location: string;
  };
};

type ParentItem = {
  id: string;
  labelVi: string;
};

type LinkOption = {
  label: string;
  vi: string;
  en: string;
};

type LinkOptions = {
  staticLinks: LinkOption[];
  postCategories: LinkOption[];
  productCategories: LinkOption[];
  serviceCategories: LinkOption[];
  projectCategories: LinkOption[];
};

function LinkSelect({
  linkOptions,
  onSelect,
}: {
  linkOptions: LinkOptions;
  onSelect: (value: { vi: string; en: string }) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        Chọn nhanh liên kết
      </label>

      <select
        defaultValue=""
        onChange={(e) => {
          const value = e.target.value;
          if (!value) return;
          onSelect(JSON.parse(value));
        }}
        className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
      >
        <option value="">Giữ URL hiện tại / nhập thủ công</option>

        <optgroup label="Trang tĩnh">
          {linkOptions.staticLinks.map((item) => (
            <option key={item.vi} value={JSON.stringify({ vi: item.vi, en: item.en })}>
              {item.label}
            </option>
          ))}
        </optgroup>

        <optgroup label="Danh mục bài viết">
          {linkOptions.postCategories.map((item) => (
            <option key={item.vi} value={JSON.stringify({ vi: item.vi, en: item.en })}>
              {item.label}
            </option>
          ))}
        </optgroup>

        <optgroup label="Danh mục sản phẩm">
          {linkOptions.productCategories.map((item) => (
            <option key={item.vi} value={JSON.stringify({ vi: item.vi, en: item.en })}>
              {item.label}
            </option>
          ))}
        </optgroup>

        <optgroup label="Danh mục dịch vụ">
          {linkOptions.serviceCategories.map((item) => (
            <option key={item.vi} value={JSON.stringify({ vi: item.vi, en: item.en })}>
              {item.label}
            </option>
          ))}
        </optgroup>

        <optgroup label="Danh mục công trình">
          {linkOptions.projectCategories.map((item) => (
            <option key={item.vi} value={JSON.stringify({ vi: item.vi, en: item.en })}>
              {item.label}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}

export default function EditMenuItemForm({
  item,
  parentItems,
  linkOptions,
  action,
}: {
  item: MenuItem;
  parentItems: ParentItem[];
  linkOptions: LinkOptions;
  action: (formData: FormData) => void;
}) {
  const [urlVi, setUrlVi] = useState(item.urlVi || "");
  const [urlEn, setUrlEn] = useState(item.urlEn || "");

  return (
    <form action={action} className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Sửa menu item</h1>
          <p className="mt-1 text-sm text-slate-500">
            Menu: {item.menu.name} — {item.menu.location}
          </p>
        </div>

        <Link href="/admin/menus" className="rounded-xl border px-4 py-2 text-sm font-medium">
          Quay lại
        </Link>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="labelVi"
              required
              defaultValue={item.labelVi}
              placeholder="Label tiếng Việt"
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
            />

            <input
              name="labelEn"
              defaultValue={item.labelEn || ""}
              placeholder="Label English"
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
            />
          </div>

          <LinkSelect
            linkOptions={linkOptions}
            onSelect={(value) => {
              setUrlVi(value.vi);
              setUrlEn(value.en);
            }}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="urlVi"
              value={urlVi}
              onChange={(e) => setUrlVi(e.target.value)}
              placeholder="/vi/san-pham"
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
            />

            <input
              name="urlEn"
              value={urlEn}
              onChange={(e) => setUrlEn(e.target.value)}
              placeholder="/en/products"
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
            />
          </div>

          <select
            name="parentId"
            defaultValue={item.parentId || ""}
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
          >
            <option value="">Không có menu cha</option>
            {parentItems.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.labelVi}
              </option>
            ))}
          </select>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="icon"
              defaultValue={item.icon || ""}
              placeholder="Icon optional"
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
            />

            <select
              name="target"
              defaultValue={item.target || "_self"}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
            >
              <option value="_self">Mở cùng tab</option>
              <option value="_blank">Mở tab mới</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input name="isActive" type="checkbox" defaultChecked={item.isActive} />
            Hiển thị menu item
          </label>

          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white">
            <Save className="h-4 w-4" />
            Cập nhật menu item
          </button>
        </div>
      </div>
    </form>
  );
}