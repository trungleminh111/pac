import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMenuLinkOptions } from "@/lib/menu-link-options";
import EditMenuItemForm from "./menu-item-form";

async function updateMenuItem(
  menuId: string,
  itemId: string,
  formData: FormData
) {
  "use server";

  const labelVi = String(formData.get("labelVi") || "").trim();
  const labelEn = String(formData.get("labelEn") || "").trim();
  const urlVi = String(formData.get("urlVi") || "").trim();
  const urlEn = String(formData.get("urlEn") || "").trim();
  const parentId = String(formData.get("parentId") || "");
  const isActive = formData.get("isActive") === "on";

  if (!labelVi) return;

  await prisma.menuItem.update({
    where: { id: itemId },
    data: {
      labelVi,
      labelEn: labelEn || null,
      urlVi: urlVi || null,
      urlEn: urlEn || null,
      parentId: parentId || null,
      isActive,
    },
  });

  redirect(`/admin/menus?menuId=${menuId}`);
}

async function deleteMenuItem(menuId: string, itemId: string) {
  "use server";

  await prisma.menuItem.delete({
    where: { id: itemId },
  });

  redirect(`/admin/menus?menuId=${menuId}`);
}

export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ menuId: string; itemId: string }>;
}) {
  const { menuId, itemId } = await params;

  const menu = await prisma.menu.findUnique({
    where: { id: menuId },
  });

  const item = await prisma.menuItem.findUnique({
    where: { id: itemId },
  });

  if (!menu || !item) {
    redirect("/admin/menus");
  }

  const parentItems = await prisma.menuItem.findMany({
    where: {
      menuId,
      parentId: null,
      id: {
        not: itemId,
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  const linkOptions = await getMenuLinkOptions();

  return (
    <EditMenuItemForm
      menu={menu}
      item={item}
      parentItems={parentItems}
      linkOptions={linkOptions}
      action={updateMenuItem.bind(null, menuId, itemId)}
      deleteAction={deleteMenuItem.bind(null, menuId, itemId)}
    />
  );
}