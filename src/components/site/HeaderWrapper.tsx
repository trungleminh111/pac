import { Header } from "@/components/site/Header";
import { getHeaderMenu } from "@/server/menus/menu.query";
import type { Locale } from "@/server/menus/menu.type";

export async function HeaderWrapper({
  locale = "vi",
}: {
  locale?: Locale;
}) {
  const dynamicMenuItems = await getHeaderMenu(locale);

  return <Header locale={locale} dynamicMenuItems={dynamicMenuItems} />;
}