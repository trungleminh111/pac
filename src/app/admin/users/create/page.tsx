import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import UserForm from "./user-form";

export type UserCreateState = {
  ok: boolean;
  message: string;
};

async function createUser(
  _prevState: UserCreateState,
  formData: FormData
): Promise<UserCreateState> {
  "use server";

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "AUTHOR") as
    | "ADMIN"
    | "EDITOR"
    | "AUTHOR";
  const image = String(formData.get("image") || "").trim();

  if (!email || !password) {
    return {
      ok: false,
      message: "Vui lòng nhập email và mật khẩu.",
    };
  }

  if (password.length < 6) {
    return {
      ok: false,
      message: "Mật khẩu phải có ít nhất 6 ký tự.",
    };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
        role,
        image: image || null,
      },
    });

    return {
      ok: true,
      message: "Tạo người dùng thành công.",
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        ok: false,
        message: "Email này đã tồn tại.",
      };
    }

    return {
      ok: false,
      message: "Có lỗi xảy ra khi tạo người dùng.",
    };
  }
}

export default function CreateUserPage() {
  return <UserForm action={createUser} />;
}