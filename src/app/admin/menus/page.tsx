import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import MenusClient from "./menus-client";

async function reorderMenuItems(formData: FormData) {
  "use server";

  const raw = String(formData.get("items") || "[]");

  try {
    const items = JSON.parse(raw) as {
      id: string;
      parentId: string | null;
      sortOrder: number;
    }[];

    await prisma.$transaction(
      items.map((item) =>
        prisma.menuItem.update({
          where: { id: item.id },
          data: {
            parentId: item.parentId,
            sortOrder: item.sortOrder,
          },
        })
      )
    );

    revalidatePath("/admin/menus");
  } catch (error) {
    console.error(error);
  }
}

async function deleteMenuItem(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.menuItem.delete({
    where: { id },
  });

  revalidatePath("/admin/menus");
}

export default async function AdminMenusPage() {
  let menu = await prisma.menu.findFirst({
    where: {
      location: "HEADER",
    },
  });

  if (!menu) {
    menu = await prisma.menu.create({
      data: {
        name: "Header menu",
        location: "HEADER",
      },
    });
  }

  const items = await prisma.menuItem.findMany({
    where: {
      menuId: menu.id,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            Quản lý menu Header
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kéo thả để sắp xếp menu cha/con.
          </p>
        </div>

        <Link
          href="/admin/menus/create"
          className="rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white"
        >
          Thêm menu item
        </Link>
      </div>

      <MenusClient
        items={items}
        reorderAction={reorderMenuItems}
        deleteAction={deleteMenuItem}
      />
    </div>
  );
}