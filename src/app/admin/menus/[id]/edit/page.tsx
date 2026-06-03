import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditMenuItemForm from "./menu-item-form";

async function updateMenuItem(id: string, formData: FormData) {
  "use server";

  const labelVi = String(formData.get("labelVi") || "").trim();
  const labelEn = String(formData.get("labelEn") || "").trim();
  const urlVi = String(formData.get("urlVi") || "").trim();
  const urlEn = String(formData.get("urlEn") || "").trim();
  const parentId = String(formData.get("parentId") || "");
  const icon = String(formData.get("icon") || "").trim();
  const target = String(formData.get("target") || "_self");
  const isActive = formData.get("isActive") === "on";

  if (!labelVi) return;

  await prisma.menuItem.update({
    where: {
      id,
    },
    data: {
      labelVi,
      labelEn: labelEn || null,
      urlVi: urlVi || null,
      urlEn: urlEn || null,
      parentId: parentId || null,
      icon: icon || null,
      target,
      isActive,
    },
  });

  redirect("/admin/menus");
}

export default async function EditMenuItemPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const item = await prisma.menuItem.findUnique({
    where: {
      id: params.id,
    },
    include: {
      menu: true,
    },
  });

  if (!item) notFound();

  const parentItems = await prisma.menuItem.findMany({
    where: {
      menuId: item.menuId,
      parentId: null,
      id: {
        not: item.id,
      },
    },
    orderBy: {
      sortOrder: "asc",
    },
    select: {
      id: true,
      labelVi: true,
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });

  const linkOptions = {
    staticLinks: [
      { label: "Trang chủ", vi: "/vi", en: "/en" },
      { label: "Giới thiệu", vi: "/vi/gioi-thieu", en: "/en/about" },
      { label: "Dịch vụ", vi: "/vi/dich-vu", en: "/en/services" },
      { label: "Sản phẩm", vi: "/vi/san-pham", en: "/en/products" },
      { label: "Công trình", vi: "/vi/cong-trinh", en: "/en/projects" },
      { label: "Tin tức", vi: "/vi/tin-tuc", en: "/en/news" },
      { label: "Liên hệ", vi: "/vi/lien-he", en: "/en/contact" },
    ],
    postCategories: categories
      .filter((item) => item.type === "POST")
      .map((item) => ({
        label: `Bài viết / ${item.nameVi}`,
        vi: `/vi/tin-tuc?category=${encodeURIComponent(item.nameVi)}`,
        en: `/en/news?category=${encodeURIComponent(item.nameEn || item.nameVi)}`,
      })),
    productCategories: categories
      .filter((item) => item.type === "PRODUCT")
      .map((item) => ({
        label: `Sản phẩm / ${item.nameVi}`,
        vi: `/vi/san-pham?category=${encodeURIComponent(item.nameVi)}`,
        en: `/en/products?category=${encodeURIComponent(item.nameEn || item.nameVi)}`,
      })),
    serviceCategories: categories
      .filter((item) => item.type === "SERVICE")
      .map((item) => ({
        label: `Dịch vụ / ${item.nameVi}`,
        vi: `/vi/dich-vu?category=${encodeURIComponent(item.nameVi)}`,
        en: `/en/services?category=${encodeURIComponent(item.nameEn || item.nameVi)}`,
      })),
    projectCategories: categories
      .filter((item) => item.type === "PROJECT")
      .map((item) => ({
        label: `Công trình / ${item.nameVi}`,
        vi: `/vi/cong-trinh?category=${encodeURIComponent(item.nameVi)}`,
        en: `/en/projects?category=${encodeURIComponent(item.nameEn || item.nameVi)}`,
      })),
  };

  return (
    <EditMenuItemForm
      item={item}
      parentItems={parentItems}
      linkOptions={linkOptions}
      action={updateMenuItem.bind(null, item.id)}
    />
  );
}