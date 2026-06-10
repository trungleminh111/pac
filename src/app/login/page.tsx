"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl: "/admin",
    });

    setLoading(false);

    if (res?.error) {
      setError("Email hoặc mật khẩu không đúng");
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f0f1] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border bg-white p-6 shadow-sm"
      >
        <h1 className="mb-6 text-center text-2xl font-semibold">
          P.A.C STONE
        </h1>

        {error && (
          <div className="mb-4 border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <label className="mb-1 block text-sm">Email</label>
        <input
          name="email"
          type="email"
          defaultValue=""
          placeholder="Email"
          className="mb-4 w-full border px-3 py-2"
        />

        <label className="mb-1 block text-sm">Mật khẩu</label>
        <input
          name="password"
          type="password"
          defaultValue=""
          placeholder="Mật khẩu"
          className="mb-5 w-full border px-3 py-2"
        />

        <button
          disabled={loading}
          className="w-full rounded bg-[#2271b1] px-4 py-2 font-medium text-white"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div className="mt-5 text-center text-sm">
          <span className="text-slate-500">
            Chưa có tài khoản?
          </span>{" "}
          <a
            href="/register"
            className="font-medium text-[#2271b1] hover:underline"
          >
            Tạo tài khoản
          </a>
        </div>
      </form>
    </div>
  );
}