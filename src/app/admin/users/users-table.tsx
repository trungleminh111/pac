"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "EDITOR" | "AUTHOR";
  image: string | null;
  createdAt: Date;
};

function roleClass(role: string) {
  if (role === "ADMIN") return "bg-red-50 text-red-700 ring-red-200";
  if (role === "EDITOR") return "bg-blue-50 text-blue-700 ring-blue-200";
  return "bg-emerald-50 text-emerald-700 ring-emerald-200";
}

export default function UsersTable({
  users,
  q,
  role,
  deleteAction,
}: {
  users: User[];
  q: string;
  role: string;
  deleteAction: (formData: FormData) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const allIds = useMemo(() => users.map((user) => user.id), [users]);
  const checkedAll = allIds.length > 0 && selected.length === allIds.length;

  function toggleAll() {
    setSelected(checkedAll ? [] : allIds);
  }

  function toggleOne(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Người dùng</h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý tài khoản quản trị hệ thống.
          </p>
        </div>

        <Link
          href="/admin/users/create"
          className="inline-flex items-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white hover:bg-[#195f96]"
        >
          <Plus className="h-4 w-4" />
          Thêm người dùng
        </Link>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <form className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Tìm theo tên hoặc email..."
              className="w-full rounded-xl border px-10 py-3 text-sm outline-none focus:border-[#2271b1]"
            />
          </div>

          <select
            name="role"
            defaultValue={role}
            className="rounded-xl border px-4 py-3 text-sm"
          >
            <option value="">Tất cả quyền</option>
            <option value="ADMIN">Admin</option>
            <option value="EDITOR">Editor</option>
            <option value="AUTHOR">Author</option>
          </select>

          <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            Lọc
          </button>
        </form>
      </div>

      <form action={deleteAction}>
        {selected.map((id) => (
          <input key={id} type="hidden" name="ids" value={id} />
        ))}

        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Đã chọn <strong>{selected.length}</strong> người dùng
          </div>

          <button
            type="submit"
            disabled={selected.length === 0}
            onClick={(e) => {
              if (!confirm(`Xóa ${selected.length} người dùng đã chọn?`)) {
                e.preventDefault();
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
            Xóa đã chọn
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="w-12 px-5 py-4">
                  <input
                    type="checkbox"
                    checked={checkedAll}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-5 py-4">Người dùng</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Quyền</th>
                <th className="px-5 py-4">Ngày tạo</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(user.id)}
                      onChange={() => toggleOne(user.id)}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2271b1] text-sm font-bold text-white">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="font-semibold text-slate-900">
                        {user.name || "Chưa có tên"}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-600">{user.email}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${roleClass(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="font-medium text-[#2271b1] hover:underline"
                    >
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </form>
    </div>
  );
}