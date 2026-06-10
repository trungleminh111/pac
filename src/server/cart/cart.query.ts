import { prisma } from "@/lib/prisma";
import { Locale } from "@prisma/client";
import { getServerSession } from "next-auth/next";
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

export async function getActiveCart(locale: Locale = Locale.vi) {
  const user = await getCurrentUser();

  if (!user) return null;

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
                where: { locale },
                take: 1,
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!cart) return null;

  return {
    id: cart.id,
    items: cart.items.map((item) => {
      const translation = item.product.translations[0];

      return {
        id: item.id,
        productId: item.productId,
        title: translation?.title || "Sản phẩm",
        slug: translation?.slug || "",
        image: item.product.thumbnail || "/assets/images/products/product-1-1.png",
        quantity: item.quantity,
        price: Number(item.price),
        subtotal: Number(item.price) * item.quantity,
      };
    }),
  };
}

export async function getCheckoutData(locale: Locale = Locale.vi) {
  const user = await getCurrentUser();

  if (!user) return null;

  const [cart, addresses] = await Promise.all([
    getActiveCart(locale),
    prisma.address.findMany({
      where: {
        userId: user.id,
      },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  return {
    user,
    cart,
    addresses,
  };
}