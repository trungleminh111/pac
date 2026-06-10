import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditUserForm from "./user-form";

export type UserEditState = {
  ok: boolean;
  message: string;
};

async function updateUser(
  id: string,
  _prevState: UserEditState,
  formData: FormData
): Promise<UserEditState> {
  "use server";

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "AUTHOR") as
    | "ADMIN"
    | "EDITOR"
    | "USER"
    | "AUTHOR";
  const image = String(formData.get("image") || "").trim();

  if (!email) {
    return {
      ok: false,
      message: "Vui lòng nhập email.",
    };
  }

  if (password && password.length < 6) {
    return {
      ok: false,
      message: "Mật khẩu mới phải có ít nhất 6 ký tự.",
    };
  }

  try {
    await prisma.user.update({
      where: { id },
      data: {
        name: name || null,
        email,
        role,
        image: image || null,
        ...(password
          ? {
              password: await bcrypt.hash(password, 10),
            }
          : {}),
      },
    });

    return {
      ok: true,
      message: "Cập nhật người dùng thành công.",
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
      message: "Có lỗi xảy ra khi cập nhật người dùng.",
    };
  }
}

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) notFound();

  return <EditUserForm user={user} action={updateUser.bind(null, id)} />;
}