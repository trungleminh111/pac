import { getServerSession } from "next-auth/next";
import { Header } from "@/components/site/Header";
import { getActiveCart } from "@/server/cart/cart.query";
import { getHeaderMenu } from "@/server/menus/menu.query";
import { Locale as PrismaLocale } from "@prisma/client";
import type { Locale } from "@/server/menus/menu.type";

function formatPrice(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

export async function SiteHeader({
  locale,
}: {
  locale: string;
}) {
  const safeLocale: Locale = locale === "en" ? "en" : "vi";
  const menuItems = await getHeaderMenu(safeLocale);

  const session = await getServerSession();

  const cart = await getActiveCart(
    safeLocale === "en" ? PrismaLocale.en : PrismaLocale.vi
  );

  const cartItems =
    cart?.items.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.image,
      price: formatPrice(item.price),
      quantity: item.quantity,
    })) || [];

  const cartTotal = formatPrice(
    cart?.items.reduce((sum, item) => sum + item.subtotal, 0) || 0
  );

  return (
    <Header
      locale={safeLocale}
      dynamicMenuItems={menuItems}
      cartItems={cartItems}
      cartTotal={cartTotal}
      isLoggedIn={!!session}
    />
  );
}