import { prisma } from "@/lib/prisma";
import type { Locale, SiteMenuItem } from "./menu.type";

export async function getHeaderMenu(locale: Locale): Promise<SiteMenuItem[]> {
  const menu = await prisma.menu.findFirst({
    where: {
      location: "HEADER",
    },
    include: {
      items: {
        where: {
          isActive: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!menu) return [];

  const items = menu.items;

  function mapItem(item: (typeof items)[number]): SiteMenuItem {
    return {
      id: item.id,
      label: locale === "vi" ? item.labelVi : item.labelEn || item.labelVi,
      href: locale === "vi" ? item.urlVi || "#" : item.urlEn || item.urlVi || "#",
      target: item.target || "_self",
      icon: item.icon,
      children: items
        .filter((child) => child.parentId === item.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(mapItem),
    };
  }

  return items
    .filter((item) => !item.parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(mapItem);
}