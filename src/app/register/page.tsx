"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { registerUser } from "@/server/auth/register.action";
import "../../globals.css";

export default function RegisterPage({
  params,
}: {
  params: {
    locale: "vi" | "en";
  };
}) {
  const locale = params.locale === "en" ? "en" : "vi";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const result = await registerUser(formData);

    if (!result.ok) {
      setError(result.message);
      setLoading(false);
      return;
    }

    setSuccess(result.message);

    const loginRes = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl: locale === "vi" ? "/vi" : "/en",
    });

    setLoading(false);

    if (loginRes?.error) {
      window.location.href = locale === "vi" ? "/login" : "/login";
      return;
    }

    window.location.href =
      locale === "vi" ? "/vi" : "/en";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f0f1] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border bg-white p-6 shadow-sm"
      >
        <h1 className="mb-2 text-center text-2xl font-semibold">
          P.A.C STONE
        </h1>

        <p className="mb-6 text-center text-sm text-slate-500">
          {locale === "vi" ? "Tạo tài khoản mới" : "Create a new account"}
        </p>

        {error && (
          <div className="mb-4 border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 border-l-4 border-green-500 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <label className="mb-1 block text-sm">
          {locale === "vi" ? "Họ và tên" : "Full name"}
        </label>
        <input
          name="name"
          type="text"
          placeholder={locale === "vi" ? "Họ và tên" : "Full name"}
          className="mb-4 w-full border px-3 py-2"
        />

        <label className="mb-1 block text-sm">Email</label>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="mb-4 w-full border px-3 py-2"
        />

        <label className="mb-1 block text-sm">
          {locale === "vi" ? "Mật khẩu" : "Password"}
        </label>
        <input
          name="password"
          type="password"
          placeholder={locale === "vi" ? "Mật khẩu" : "Password"}
          className="mb-4 w-full border px-3 py-2"
        />

        <label className="mb-1 block text-sm">
          {locale === "vi" ? "Nhập lại mật khẩu" : "Confirm password"}
        </label>
        <input
          name="confirmPassword"
          type="password"
          placeholder={locale === "vi" ? "Nhập lại mật khẩu" : "Confirm password"}
          className="mb-5 w-full border px-3 py-2"
        />

        <button
          disabled={loading}
          className="w-full rounded bg-[#2271b1] px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {loading
            ? locale === "vi"
              ? "Đang đăng ký..."
              : "Registering..."
            : locale === "vi"
              ? "Đăng ký"
              : "Register"}
        </button>

        <div className="mt-5 text-center text-sm">
          <span className="text-slate-500">
            {locale === "vi" ? "Đã có tài khoản?" : "Already have an account?"}
          </span>{" "}
          <Link
            href={locale === "vi" ? "/login" : "/login"}
            className="font-medium text-[#2271b1]"
          >
            {locale === "vi" ? "Đăng nhập" : "Login"}
          </Link>
        </div>
      </form>
    </div>
  );
}