"use server";

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function getCurrentUser() {
  const session = await getServerSession(/* authOptions */);

  if (!session?.user?.email) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
}

function makeOrderCode() {
  return `PAC-${Date.now()}`;
}

export async function updateCartQuantity(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/vi/dang-nhap");
  }

  const itemId = String(formData.get("itemId") || "");
  const quantity = Number(formData.get("quantity") || 1);

  if (!itemId) return;

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId: user.id,
        status: "ACTIVE",
      },
    },
  });

  if (!item) return;

  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: {
        id: item.id,
      },
    });
  } else {
    await prisma.cartItem.update({
      where: {
        id: item.id,
      },
      data: {
        quantity,
      },
    });
  }

  revalidatePath("/vi/gio-hang");
  revalidatePath("/vi/thanh-toan");
}

export async function removeCartItem(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/vi/dang-nhap");
  }

  const itemId = String(formData.get("itemId") || "");

  if (!itemId) return;

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId: user.id,
        status: "ACTIVE",
      },
    },
  });

  if (!item) return;

  await prisma.cartItem.delete({
    where: {
      id: item.id,
    },
  });

  revalidatePath("/vi/gio-hang");
  revalidatePath("/vi/thanh-toan");
}

export async function createOrder(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/vi/dang-nhap");
  }

  const addressId = String(formData.get("addressId") || "");
  const note = String(formData.get("note") || "").trim();
  const paymentMethod = String(formData.get("paymentMethod") || "COD");

  const cart = await prisma.cart.findFirst({
    where: {
      userId: user.id,
      status: "ACTIVE",
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              translations: {
                where: {
                  locale: "vi",
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    redirect("/vi/gio-hang");
  }

  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId: user.id,
    },
  });

  if (!address) {
    redirect("/vi/tai-khoan/dia-chi");
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const shippingFee = 0;
  const total = subtotal + shippingFee;

  await prisma.order.create({
    data: {
      userId: user.id,
      code: makeOrderCode(),
      status: "PENDING",
      paymentStatus: "UNPAID",
      paymentMethod,
      shippingFee,
      subtotal,
      total,
      note,
      receiverName: address.fullName,
      receiverPhone: address.phone,
      city: address.city,
      district: address.district,
      ward: address.ward,
      street: address.street,
      items: {
        create: cart.items.map((item) => {
          const translation = item.product.translations[0];

          return {
            productId: item.productId,
            title: translation?.title || "Sản phẩm",
            image: item.product.thumbnail,
            quantity: item.quantity,
            price: item.price,
            subtotal: Number(item.price) * item.quantity,
            snapshot: {
              sku: item.product.sku,
              title: translation?.title || "Sản phẩm",
              image: item.product.thumbnail,
            },
          };
        }),
      },
    },
  });

  await prisma.cart.update({
    where: {
      id: cart.id,
    },
    data: {
      status: "ORDERED",
    },
  });

  await prisma.cart.create({
    data: {
      userId: user.id,
      status: "ACTIVE",
    },
  });

  revalidatePath("/vi/gio-hang");
  revalidatePath("/vi/thanh-toan");
  revalidatePath("/vi/tai-khoan/don-hang");

  redirect("/vi/tai-khoan/don-hang");
}