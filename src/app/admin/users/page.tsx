import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UsersTable from "./users-table";
import { requirePermission } from "@/lib/admin-permissions";

async function deleteUsers(formData: FormData) {
  "use server";

  const ids = formData.getAll("ids").map(String).filter(Boolean);
  if (!ids.length) return;

  await prisma.user.deleteMany({
    where: {
      id: { in: ids },
    },
  });

  redirect("/admin/users");
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string }>;
}) {
  await requirePermission("users");
  const params = await searchParams;

  const q = params.q?.trim() || "";
  const role = params.role || "";

  const users = await prisma.user.findMany({
    where: {
      ...(role ? { role: role as "ADMIN" | "EDITOR" | "AUTHOR" } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <UsersTable
      users={users}
      q={q}
      role={role}
      deleteAction={deleteUsers}
    />
  );
}