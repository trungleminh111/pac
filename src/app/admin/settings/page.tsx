import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import SettingsForm from "./settings-form";
import { defaultAdminSettings, getPermissionSettings } from "@/lib/settings";

const roles = ["ADMIN", "EDITOR", "AUTHOR"] as const;

const modules = [
  "dashboard",
  "posts",
  "products",
  "services",
  "projects",
  "media",
  "users",
  "categories",
  "attributes",
  "pages",
  "orders",
  "settings",
] as const;

async function saveSettings(
  prevStateOrFormData: FormData | any,
  maybeFormData?: FormData
) {
  "use server";

  const formData =
    maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData;

  const adminSettings = {
    uploadMaxSizeMb: Number(formData.get("uploadMaxSizeMb") || 5),
    uploadAllowedTypes: String(formData.get("uploadAllowedTypes") || ""),
  };

  const permissionSettings: any = {};

  for (const role of roles) {
    permissionSettings[role] = {};

    for (const module of modules) {
      permissionSettings[role][module] =
        role === "ADMIN"
          ? true
          : formData.getAll(`permission.${role}.${module}`).includes("true");
    }
  }

  await prisma.setting.upsert({
    where: { key: "admin_settings" },
    create: {
      key: "admin_settings",
      value: adminSettings,
    },
    update: {
      value: adminSettings,
    },
  });

  await prisma.setting.upsert({
    where: { key: "permission_settings" },
    create: {
      key: "permission_settings",
      value: permissionSettings,
    },
    update: {
      value: permissionSettings,
    },
  });

  revalidatePath("/admin", "layout");
  revalidatePath("/admin/settings");

  redirect("/admin/settings?saved=1");
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;

  const adminRow = await prisma.setting.findUnique({
    where: { key: "admin_settings" },
  });

  const adminSettings = {
    ...defaultAdminSettings,
    ...((adminRow?.value as object) || {}),
  };

  const permissionSettings = await getPermissionSettings();

  const r2Status = {
    accountId: Boolean(process.env.CF_ACCOUNT_ID),
    accessKey: Boolean(process.env.CF_ACCESS_KEY_ID),
    secretKey: Boolean(process.env.CF_SECRET_ACCESS_KEY),
    bucket: process.env.CF_R2_BUCKET_NAME || "",
    cdnUrl: process.env.NEXT_PUBLIC_CDN_URL || "",
  };

  return (
    <SettingsForm
      saved={params.saved === "1"}
      adminSettings={adminSettings}
      permissionSettings={permissionSettings}
      r2Status={r2Status}
      action={saveSettings}
    />
  );
}