import { Header } from "@/components/site/Header";
import { getHeaderMenu } from "@/server/menus/menu.query";
import type { Locale } from "@/server/menus/menu.type";

export async function SiteHeader({
  locale,
}: {
  locale: string;
}) {
  const safeLocale: Locale = locale === "en" ? "en" : "vi";
  const menuItems = await getHeaderMenu(safeLocale);

  return <Header locale={safeLocale} dynamicMenuItems={menuItems} />;
}