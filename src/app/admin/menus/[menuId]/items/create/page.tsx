import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMenuLinkOptions } from "@/lib/menu-link-options";
import MenuItemForm from "./menu-item-form";

async function createMenuItem(menuId: string, formData: FormData) {
  "use server";

  const labelVi = String(formData.get("labelVi") || "").trim();
  const labelEn = String(formData.get("labelEn") || "").trim();
  const urlVi = String(formData.get("urlVi") || "").trim();
  const urlEn = String(formData.get("urlEn") || "").trim();
  const parentId = String(formData.get("parentId") || "");
  const isActive = formData.get("isActive") === "on";

  if (!labelVi) return;

  const lastItem = await prisma.menuItem.findFirst({
    where: { menuId },
    orderBy: { sortOrder: "desc" },
  });

  await prisma.menuItem.create({
    data: {
      menuId,
      labelVi,
      labelEn: labelEn || null,
      urlVi: urlVi || null,
      urlEn: urlEn || null,
      parentId: parentId || null,
      isActive,
      sortOrder: (lastItem?.sortOrder || 0) + 1,
    },
  });

  redirect(`/admin/menus?menuId=${menuId}`);
}

export default async function CreateMenuItemPage({
  params,
}: {
  params: Promise<{ menuId: string }>;
}) {
  const { menuId } = await params;

  const menu = await prisma.menu.findUnique({
    where: { id: menuId },
  });

  if (!menu) redirect("/admin/menus");

  const parentItems = await prisma.menuItem.findMany({
    where: {
      menuId,
      parentId: null,
    },
    orderBy: { sortOrder: "asc" },
  });

  const linkOptions = await getMenuLinkOptions();

  return (
    <MenuItemForm
      menu={menu}
      parentItems={parentItems}
      linkOptions={linkOptions}
      action={createMenuItem.bind(null, menuId)}
    />
  );
}