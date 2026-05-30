"use client";

import Link from "next/link";
import { Plus, Trash2, Menu as MenuIcon } from "lucide-react";

type MenuItem = {
  id: string;
  labelVi: string;
  labelEn: string | null;
  urlVi: string | null;
  urlEn: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
};

type Menu = {
  id: string;
  name: string;
  location: string;
  items: MenuItem[];
};

export default function MenusClient({
  menus,
  activeMenu,
  createMenuAction,
  deleteMenuAction,
}: {
  menus: Menu[];
  activeMenu: Menu | null;
  createMenuAction: (formData: FormData) => void;
  deleteMenuAction: (formData: FormData) => void;
}) {
  const parentItems = activeMenu?.items.filter((item) => !item.parentId) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Menu website</h1>
        <p className="mt-1 text-sm text-slate-500">
          Quản lý menu đa ngôn ngữ: Header, Footer, Mobile.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <div className="space-y-6">
          <form action={createMenuAction} className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2271b1]">
                <MenuIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Tạo menu</h2>
                <p className="text-sm text-slate-500">Header/Footer/Mobile</p>
              </div>
            </div>

            <div className="space-y-3">
              <input
                name="name"
                required
                placeholder="Tên menu, ví dụ: Main Menu"
                className="w-full rounded-xl border px-4 py-3 text-sm"
              />

              <select
                name="location"
                defaultValue="header"
                className="w-full rounded-xl border px-4 py-3 text-sm"
              >
                <option value="header">Header</option>
                <option value="footer">Footer</option>
                <option value="mobile">Mobile</option>
              </select>

              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white">
                <Plus className="h-4 w-4" />
                Tạo menu
              </button>
            </div>
          </form>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold">Danh sách menu</h2>

            <div className="space-y-2">
              {menus.map((menu) => (
                <div
                  key={menu.id}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                    activeMenu?.id === menu.id ? "border-[#2271b1] bg-blue-50" : ""
                  }`}
                >
                  <Link href={`/admin/menus?menuId=${menu.id}`}>
                    <div className="font-semibold text-slate-900">{menu.name}</div>
                    <div className="text-xs text-slate-500">{menu.location}</div>
                  </Link>

                  <form action={deleteMenuAction}>
                    <input type="hidden" name="id" value={menu.id} />
                    <button
                      type="submit"
                      onClick={(e) => {
                        if (!confirm(`Xóa menu "${menu.name}"?`)) {
                          e.preventDefault();
                        }
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              ))}

              {menus.length === 0 && (
                <div className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-slate-500">
                  Chưa có menu nào.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white shadow-sm">
          {activeMenu ? (
            <>
              <div className="flex items-center justify-between border-b px-5 py-4">
                <div>
                  <h2 className="font-semibold">{activeMenu.name}</h2>
                  <p className="text-sm text-slate-500">
                    Vị trí: {activeMenu.location}
                  </p>
                </div>

                <Link
                  href={`/admin/menus/${activeMenu.id}/items/create`}
                  className="rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white"
                >
                  Thêm item
                </Link>
              </div>

              <div className="divide-y">
                {parentItems.map((item) => {
                  const children = activeMenu.items.filter(
                    (child) => child.parentId === item.id
                  );

                  return (
                    <div key={item.id} className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-900">
                            {item.labelVi}
                            {!item.isActive && (
                              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                                Ẩn
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-500">
                            EN: {item.labelEn || "—"}
                          </div>
                          <div className="text-xs text-slate-400">
                            VI: {item.urlVi || "—"} | EN: {item.urlEn || "—"}
                          </div>
                        </div>

                        <Link
                          href={`/admin/menus/${activeMenu.id}/items/${item.id}/edit`}
                          className="text-sm font-semibold text-[#2271b1]"
                        >
                          Sửa
                        </Link>
                      </div>

                      {children.length > 0 && (
                        <div className="mt-4 space-y-2 border-l pl-4">
                          {children.map((child) => (
                            <div
                              key={child.id}
                              className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                            >
                              <div>
                                <div className="font-medium">{child.labelVi}</div>
                                <div className="text-xs text-slate-500">
                                  {child.urlVi || "—"} | {child.urlEn || "—"}
                                </div>
                              </div>

                              <Link
                                href={`/admin/menus/${activeMenu.id}/items/${child.id}/edit`}
                                className="text-sm font-semibold text-[#2271b1]"
                              >
                                Sửa
                              </Link>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {activeMenu.items.length === 0 && (
                  <div className="px-5 py-10 text-center text-sm text-slate-500">
                    Menu này chưa có item nào.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="px-5 py-10 text-center text-sm text-slate-500">
              Tạo menu trước.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}