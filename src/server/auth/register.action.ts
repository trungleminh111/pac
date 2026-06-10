"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export type RegisterResult = {
  ok: boolean;
  message: string;
};

export async function registerUser(
  formData: FormData
): Promise<RegisterResult> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!name || !email || !password || !confirmPassword) {
    return {
      ok: false,
      message: "Vui lòng nhập đầy đủ thông tin.",
    };
  }

  if (password.length < 8) {
    return {
      ok: false,
      message: "Mật khẩu phải có ít nhất 8 ký tự.",
    };
  }

  if (password !== confirmPassword) {
    return {
      ok: false,
      message: "Mật khẩu xác nhận không khớp.",
    };
  }

  const existedUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existedUser) {
    return {
      ok: false,
      message: "Email này đã được đăng ký.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "USER",
      carts: {
        create: {
          status: "ACTIVE",
        },
      },
    },
  });

  return {
    ok: true,
    message: "Đăng ký thành công.",
  };
}