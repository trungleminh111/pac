"use client";

import Link from "next/link";
import { useState } from "react";
import { Save, Trash2 } from "lucide-react";

type Menu = {
  id: string;
  name: string;
  location: string;
};

type MenuItem = {
  id: string;
  labelVi: string;
  labelEn: string | null;
  urlVi: string | null;
  urlEn: string | null;
  parentId: string | null;
  isActive: boolean;
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
        <option value="">Nhập URL thủ công</option>

        <optgroup label="Trang tĩnh">
          {linkOptions.staticLinks.map((item) => (
            <option
              key={item.vi}
              value={JSON.stringify({ vi: item.vi, en: item.en })}
            >
              {item.label}
            </option>
          ))}
        </optgroup>

        <optgroup label="Danh mục bài viết">
          {linkOptions.postCategories.map((item) => (
            <option
              key={item.vi}
              value={JSON.stringify({ vi: item.vi, en: item.en })}
            >
              {item.label}
            </option>
          ))}
        </optgroup>

        <optgroup label="Danh mục sản phẩm">
          {linkOptions.productCategories.map((item) => (
            <option
              key={item.vi}
              value={JSON.stringify({ vi: item.vi, en: item.en })}
            >
              {item.label}
            </option>
          ))}
        </optgroup>

        <optgroup label="Danh mục dịch vụ">
          {linkOptions.serviceCategories.map((item) => (
            <option
              key={item.vi}
              value={JSON.stringify({ vi: item.vi, en: item.en })}
            >
              {item.label}
            </option>
          ))}
        </optgroup>

        <optgroup label="Danh mục công trình">
          {linkOptions.projectCategories.map((item) => (
            <option
              key={item.vi}
              value={JSON.stringify({ vi: item.vi, en: item.en })}
            >
              {item.label}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}

export default function EditMenuItemForm({
  menu,
  item,
  parentItems,
  linkOptions,
  action,
  deleteAction,
}: {
  menu: Menu;
  item: MenuItem;
  parentItems: ParentItem[];
  linkOptions: LinkOptions;
  action: (formData: FormData) => void;
  deleteAction: () => void;
}) {
  const [urlVi, setUrlVi] = useState(item.urlVi || "");
  const [urlEn, setUrlEn] = useState(item.urlEn || "");

  return (
    <form action={action} className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Sửa menu item</h1>
          <p className="mt-1 text-sm text-slate-500">
            Menu: {menu.name} — {menu.location}
          </p>
        </div>

        <Link
          href={`/admin/menus?menuId=${menu.id}`}
          className="rounded-xl border px-4 py-2 text-sm font-medium"
        >
          Quay lại
        </Link>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Label tiếng Việt
              </label>
              <input
                name="labelVi"
                required
                defaultValue={item.labelVi}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Label English
              </label>
              <input
                name="labelEn"
                defaultValue={item.labelEn || ""}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              />
            </div>
          </div>

          <LinkSelect
            linkOptions={linkOptions}
            onSelect={(value) => {
              setUrlVi(value.vi);
              setUrlEn(value.en);
            }}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                URL tiếng Việt
              </label>
              <input
                name="urlVi"
                value={urlVi}
                onChange={(e) => setUrlVi(e.target.value)}
                placeholder="/vi/san-pham"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                URL English
              </label>
              <input
                name="urlEn"
                value={urlEn}
                onChange={(e) => setUrlEn(e.target.value)}
                placeholder="/en/products"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Menu cha</label>
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
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={item.isActive}
            />
            Hiển thị menu item
          </label>

          <div className="flex gap-3">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white">
              <Save className="h-4 w-4" />
              Cập nhật
            </button>

            <button
              formAction={deleteAction}
              onClick={(e) => {
                if (!confirm(`Xóa menu item "${item.labelVi}"?`)) {
                  e.preventDefault();
                }
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Xóa
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}