"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// Trả về result thay vì redirect — client tự xử lý toast
export async function addToCart(
  productId: string
): Promise<{ ok: boolean; message: string }> {
  if (!productId) {
    return { ok: false, message: "Sản phẩm không hợp lệ." };
  }

  const session = await getServerSession();

  if (!session?.user?.email) {
    return { ok: false, message: "Vui lòng đăng nhập để thêm vào giỏ hàng." };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { ok: false, message: "Không tìm thấy tài khoản." };
  }

  let cart = await prisma.cart.findFirst({
    where: { userId: user.id, status: "ACTIVE" },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: user.id, status: "ACTIVE" },
    });
  }

  const existed = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (existed) {
    await prisma.cartItem.update({
      where: { id: existed.id },
      data: { quantity: { increment: 1 } },
    });
  } else {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { ok: false, message: "Sản phẩm không tồn tại." };
    }

    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: 1,
        price: product.price || 0,
      },
    });
  }

  revalidatePath("/vi/gio-hang");
  revalidatePath("/en/cart");

  return { ok: true, message: "Đã thêm vào giỏ hàng!" };
}