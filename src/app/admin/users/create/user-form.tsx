"use client";

import { useEffect, useState } from "react";
import {
  experimental_useFormState as useFormState,
  experimental_useFormStatus as useFormStatus,
} from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { MediaPicker } from "@/components/admin/media-picker";
import type { UserCreateState } from "./page";

const initialState: UserCreateState = {
  ok: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
    >
      <Save className="h-4 w-4" />
      {pending ? "Đang tạo..." : "Tạo người dùng"}
    </button>
  );
}

export default function UserForm({
  action,
}: {
  action: (
    prevState: UserCreateState,
    formData: FormData
  ) => Promise<UserCreateState>;
}) {
  const router = useRouter();

  const [state, formAction] = useFormState(action, initialState);
  const [image, setImage] = useState("");

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
            Thêm người dùng
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tạo tài khoản quản trị mới.
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
                placeholder="admin@example.com"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Mật khẩu
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="Ít nhất 6 ký tự"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Quyền
              </label>
              <select
                name="role"
                defaultValue="AUTHOR"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
              >
                <option value="ADMIN">Admin</option>
                <option value="EDITOR">Editor</option>
                <option value="AUTHOR">Author</option>
              </select>
            </div>

            <SubmitButton />
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
