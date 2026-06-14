import { prisma } from "@/lib/prisma";

export const defaultAdminSettings = {
  uploadMaxSizeMb: 5,
  uploadAllowedTypes: "image/jpeg,image/png,image/webp,image/gif",
};

export const defaultPermissionSettings = {
  ADMIN: {
    dashboard: true,
    posts: true,
    products: true,
    services: true,
    projects: true,
    media: true,
    users: true,
    categories: true,
    menus: true,
    pages: true,
    attributes: true,
    orders: true,
    settings: true,
  },
  EDITOR: {
    dashboard: true,
    posts: true,
    products: true,
    services: true,
    projects: true,
    media: true,
    users: false,
    categories: true,
    menus: false,
    pages: false,
    attributes: true,
    orders: true,
    settings: false,
  },
  AUTHOR: {
    dashboard: true,
    posts: true,
    products: false,
    services: false,
    projects: false,
    media: true,
    users: false,
    categories: false,
    menus: false,
    pages: false,
    attributes: true,
    orders: true,
    settings: false,
  },
};

export async function getAdminSettings() {
  const row = await prisma.setting.findUnique({
    where: { key: "admin_settings" },
  });

  return {
    ...defaultAdminSettings,
    ...((row?.value as object) || {}),
  };
}

export async function getPermissionSettings() {
  const row = await prisma.setting.findUnique({
    where: { key: "permission_settings" },
  });

  const value = (row?.value as any) || {};

  return {
    ADMIN: {
      ...defaultPermissionSettings.ADMIN,
      ...(value.ADMIN || {}),
      dashboard: true,
      posts: true,
      products: true,
      services: true,
      projects: true,
      media: true,
      users: true,
      categories: true,
      menus: true,
      pages: true,
      attributes: true,
      orders: true,
      settings: true,
    },
    EDITOR: {
      ...defaultPermissionSettings.EDITOR,
      ...(value.EDITOR || {}),
    },
    AUTHOR: {
      ...defaultPermissionSettings.AUTHOR,
      ...(value.AUTHOR || {}),
    },
  };
}