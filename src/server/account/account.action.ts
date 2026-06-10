"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type ActionState = {
  ok: boolean;
  message: string;
};

async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) return null;

  return prisma.user.findUnique({
    where: { email: session.user.email },
  });
}

export async function updateProfile(
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false,
      message: "Không tìm thấy tài khoản.",
    };
  }

  const name = String(formData.get("name") || "").trim();
  const image = String(formData.get("image") || "").trim();

  if (!name) {
    return {
      ok: false,
      message: "Vui lòng nhập tên.",
    };
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name,
      image: image || null,
    },
  });

  revalidatePath("/vi/tai-khoan/ho-so");
  revalidatePath("/en/account/profile");

  return {
    ok: true,
    message: "Cập nhật hồ sơ thành công.",
  };
}

export async function createAddress(
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false,
      message: "Không tìm thấy tài khoản.",
    };
  }

  const fullName = String(formData.get("fullName") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const district = String(formData.get("district") || "").trim();
  const ward = String(formData.get("ward") || "").trim();
  const street = String(formData.get("street") || "").trim();

  if (!fullName || !phone || !city || !district || !ward) {
    return {
      ok: false,
      message: "Vui lòng nhập đầy đủ thông tin bắt buộc.",
    };
  }

  const addressCount = await prisma.address.count({
    where: {
      userId: user.id,
    },
  });

  await prisma.address.create({
    data: {
      userId: user.id,
      fullName,
      phone,
      city,
      district,
      ward,
      street,
      isDefault: addressCount === 0,
    },
  });

  revalidatePath("/vi/tai-khoan/dia-chi");
  revalidatePath("/en/account/address");

  return {
    ok: true,
    message: "Thêm địa chỉ thành công.",
  };
}

export async function updateAddress(
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false,
      message: "Không tìm thấy tài khoản.",
    };
  }

  const id = String(formData.get("id") || "").trim();
  const fullName = String(formData.get("fullName") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const district = String(formData.get("district") || "").trim();
  const ward = String(formData.get("ward") || "").trim();
  const street = String(formData.get("street") || "").trim();

  if (!id || !fullName || !phone || !city || !district || !ward) {
    return {
      ok: false,
      message: "Vui lòng nhập đầy đủ thông tin bắt buộc.",
    };
  }

  await prisma.address.updateMany({
    where: {
      id,
      userId: user.id,
    },
    data: {
      fullName,
      phone,
      city,
      district,
      ward,
      street,
    },
  });

  revalidatePath("/vi/tai-khoan/dia-chi");
  revalidatePath("/en/account/address");

  return {
    ok: true,
    message: "Cập nhật địa chỉ thành công.",
  };
}

export async function deleteAddress(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) return;

  const id = String(formData.get("id") || "").trim();

  await prisma.address.deleteMany({
    where: {
      id,
      userId: user.id,
      isDefault: false,
    },
  });

  revalidatePath("/vi/tai-khoan/dia-chi");
  revalidatePath("/en/account/address");
}

export async function setDefaultAddress(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) return;

  const id = String(formData.get("id") || "").trim();

  await prisma.$transaction([
    prisma.address.updateMany({
      where: {
        userId: user.id,
      },
      data: {
        isDefault: false,
      },
    }),
    prisma.address.updateMany({
      where: {
        id,
        userId: user.id,
      },
      data: {
        isDefault: true,
      },
    }),
  ]);

  revalidatePath("/vi/tai-khoan/dia-chi");
  revalidatePath("/en/account/address");
}

export async function updatePassword(
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false,
      message: "Không tìm thấy tài khoản.",
    };
  }

  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return {
      ok: false,
      message: "Vui lòng nhập đầy đủ mật khẩu.",
    };
  }

  if (newPassword.length < 8) {
    return {
      ok: false,
      message: "Mật khẩu mới phải có ít nhất 8 ký tự.",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      ok: false,
      message: "Mật khẩu xác nhận không khớp.",
    };
  }

  const validPassword = await bcrypt.compare(currentPassword, user.password);

  if (!validPassword) {
    return {
      ok: false,
      message: "Mật khẩu hiện tại không đúng.",
    };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    ok: true,
    message: "Đổi mật khẩu thành công.",
  };
}