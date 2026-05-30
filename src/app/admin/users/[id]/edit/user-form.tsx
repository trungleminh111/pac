"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { MediaPicker } from "@/components/admin/media-picker";
import type { UserEditState } from "./page";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "EDITOR" | "AUTHOR";
  image: string | null;
};

export default function EditUserForm({
  user,
  action,
}: {
  user: User;
  action: (
    prevState: UserEditState,
    formData: FormData
  ) => Promise<UserEditState>;
}) {
  const router = useRouter();

  const [state, formAction, pending] = useActionState(action, {
    ok: false,
    message: "",
  });

  const [image, setImage] = useState(user.image || "");

  useEffect(() => {
    if (state.ok) {
      router.push("/admin/users");
      router.refresh();
    }
  }, [state.ok, router]);

  return (
    <form action={formAction} className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            Sửa người dùng
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Cập nhật thông tin tài khoản.
          </p>
        </div>

        <Link
          href="/admin/users"
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

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Họ tên
              </label>
              <input
                name="name"
                defaultValue={user.name || ""}
                placeholder="Nguyễn Văn A"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                defaultValue={user.email}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Mật khẩu mới
              </label>
              <input
                name="password"
                type="password"
                placeholder="Bỏ trống nếu không đổi"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Quyền
              </label>
              <select
                name="role"
                defaultValue={user.role}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              >
                <option value="ADMIN">Admin</option>
                <option value="EDITOR">Editor</option>
                <option value="AUTHOR">Author</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {pending ? "Đang cập nhật..." : "Cập nhật người dùng"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-5 py-4 font-semibold">Ảnh đại diện</div>

          <div className="space-y-4 p-5">
            <MediaPicker value={image} onChange={setImage} />
            <input type="hidden" name="image" value={image} />
          </div>
        </div>
      </div>
    </form>
  );
}