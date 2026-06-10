import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getPermissionSettings } from "@/lib/settings";

export type AdminModule =
  | "dashboard"
  | "posts"
  | "products"
  | "services"
  | "projects"
  | "media"
  | "users"
  | "categories"
  | "menus"
  | "pages"
  | "settings";

export async function getCurrentAdminRole() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (session.user as any).role as "ADMIN" | "EDITOR" | "AUTHOR";
}

export async function canAccessModule(module: AdminModule) {
  const role = await getCurrentAdminRole();
  const permissions = await getPermissionSettings();

  return Boolean(permissions?.[role]?.[module]);
}

export async function requirePermission(module: AdminModule) {
  const role = await getCurrentAdminRole();
  const permissions = await getPermissionSettings();

  if (!permissions?.[role]?.[module]) {
    redirect("/admin");
  }

  return role;
}