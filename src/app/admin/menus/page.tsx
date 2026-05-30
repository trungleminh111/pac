import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MenusClient from "./menus-client";

async function createMenu(formData: FormData) {
  "use server";

  const name = String(formData.get("name") || "").trim();
  const location = String(formData.get("location") || "header").trim();

  if (!name) return;

  await prisma.menu.create({
    data: { name, location },
  });

  redirect("/admin/menus");
}

async function deleteMenu(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.menu.delete({
    where: { id },
  });

  redirect("/admin/menus");
}

export default async function AdminMenusPage({
  searchParams,
}: {
  searchParams: Promise<{ menuId?: string }>;
}) {
  const params = await searchParams;

  const menus = await prisma.menu.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      items: {
        orderBy: { sortOrder: "asc" },
        include: { children: true },
      },
    },
  });

  const activeMenu =
    menus.find((item) => item.id === params.menuId) || menus[0] || null;

  return (
    <MenusClient
      menus={menus}
      activeMenu={activeMenu}
      createMenuAction={createMenu}
      deleteMenuAction={deleteMenu}
    />
  );
}