"use server";

import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { Locale as PrismaLocale, OrderStatus } from "@prisma/client";

type CartActionResult = {
  ok: boolean;
  message: string;
  redirectTo?: string;
};

type AppLocale = "vi" | "en";

async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
}

function toPrismaLocale(locale: AppLocale) {
  return locale === "en" ? PrismaLocale.en : PrismaLocale.vi;
}

function makeOrderCode() {
  return `PAC-${Date.now()}`;
}

function getLocalePaths(locale: AppLocale) {
  return {
    loginPath: locale === "vi" ? "/vi/dang-nhap" : "/en/login",
    cartPath: locale === "vi" ? "/vi/gio-hang" : "/en/cart",
    checkoutPath: locale === "vi" ? "/vi/thanh-toan" : "/en/checkout",
    addressPath:
      locale === "vi" ? "/vi/tai-khoan/dia-chi" : "/en/account/address",
    orderPath:
      locale === "vi" ? "/vi/tai-khoan/don-hang" : "/en/account/orders",
  };
}

function revalidateCartAndCheckout() {
  revalidatePath("/vi/gio-hang");
  revalidatePath("/vi/thanh-toan");
  revalidatePath("/en/cart");
  revalidatePath("/en/checkout");
}

function revalidateOrders() {
  revalidatePath("/vi/tai-khoan/don-hang");
  revalidatePath("/en/account/orders");
}

export async function updateCartQuantity(
  formData: FormData
): Promise<CartActionResult> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false,
      message: "Vui lòng đăng nhập để cập nhật giỏ hàng.",
      redirectTo: "/vi/dang-nhap",
    };
  }

  const itemId = String(formData.get("itemId") || "");
  const quantity = Number(formData.get("quantity") || 1);

  if (!itemId) {
    return {
      ok: false,
      message: "Sản phẩm không hợp lệ.",
    };
  }

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId: user.id,
        status: "ACTIVE",
      },
    },
  });

  if (!item) {
    return {
      ok: false,
      message: "Không tìm thấy sản phẩm trong giỏ hàng.",
    };
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: {
        id: item.id,
      },
    });

    revalidateCartAndCheckout();

    return {
      ok: true,
      message: "Đã xoá sản phẩm khỏi giỏ hàng.",
    };
  }

  await prisma.cartItem.update({
    where: {
      id: item.id,
    },
    data: {
      quantity,
    },
  });

  revalidateCartAndCheckout();

  return {
    ok: true,
    message: "Đã cập nhật số lượng sản phẩm.",
  };
}

export async function removeCartItem(
  formData: FormData
): Promise<CartActionResult> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false,
      message: "Vui lòng đăng nhập để xoá sản phẩm khỏi giỏ hàng.",
      redirectTo: "/vi/dang-nhap",
    };
  }

  const itemId = String(formData.get("itemId") || "");

  if (!itemId) {
    return {
      ok: false,
      message: "Sản phẩm không hợp lệ.",
    };
  }

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId: user.id,
        status: "ACTIVE",
      },
    },
  });

  if (!item) {
    return {
      ok: false,
      message: "Không tìm thấy sản phẩm trong giỏ hàng.",
    };
  }

  await prisma.cartItem.delete({
    where: {
      id: item.id,
    },
  });

  revalidateCartAndCheckout();

  return {
    ok: true,
    message: "Đã xoá sản phẩm khỏi giỏ hàng.",
  };
}

export async function createOrder(
  formData: FormData
): Promise<CartActionResult> {
  const user = await getCurrentUser();

  const locale: AppLocale =
    String(formData.get("locale") || "vi") === "en" ? "en" : "vi";

  const { loginPath, cartPath, addressPath, orderPath } =
    getLocalePaths(locale);

  if (!user) {
    return {
      ok: false,
      message: "Vui lòng đăng nhập để đặt hàng.",
      redirectTo: loginPath,
    };
  }

  const addressId = String(formData.get("addressId") || "");
  const note = String(formData.get("note") || "").trim();
  const paymentMethod = String(formData.get("paymentMethod") || "COD");

  const itemIds = String(formData.get("itemIds") || "")
    .split(",")
    .filter(Boolean);

  if (itemIds.length === 0) {
    return {
      ok: false,
      message: "Vui lòng chọn sản phẩm để thanh toán.",
      redirectTo: cartPath,
    };
  }

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
                  locale: toPrismaLocale(locale),
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
    return {
      ok: false,
      message: "Giỏ hàng của bạn đang trống.",
      redirectTo: cartPath,
    };
  }

  const selectedItems = cart.items.filter((item) => itemIds.includes(item.id));

  if (selectedItems.length === 0) {
    return {
      ok: false,
      message: "Vui lòng chọn sản phẩm để thanh toán.",
      redirectTo: cartPath,
    };
  }

  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId: user.id,
    },
  });

  if (!address) {
    return {
      ok: false,
      message: "Vui lòng thêm hoặc chọn địa chỉ giao hàng.",
      redirectTo: addressPath,
    };
  }

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const shippingFee = 0;
  const total = subtotal + shippingFee;
  const orderCode = makeOrderCode();

  await prisma.$transaction(async (tx) => {
    await tx.order.create({
      data: {
        userId: user.id,
        code: orderCode,
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
          create: selectedItems.map((item) => {
            const translation = item.product.translations[0];
            const title = translation?.title || "Sản phẩm";
            const image = item.product.thumbnail;

            return {
              productId: item.productId,
              title,
              image,
              quantity: item.quantity,
              price: item.price,
              subtotal: Number(item.price) * item.quantity,
              snapshot: {
                productId: item.productId,
                sku: item.product.sku,
                title,
                image,
                quantity: item.quantity,
                price: Number(item.price),
                subtotal: Number(item.price) * item.quantity,
              },
            };
          }),
        },
      },
    });

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        id: {
          in: selectedItems.map((item) => item.id),
        },
      },
    });
  });

  revalidateCartAndCheckout();
  revalidateOrders();

  return {
    ok: true,
    message: "Đặt hàng thành công!",
    redirectTo: orderPath,
  };
}