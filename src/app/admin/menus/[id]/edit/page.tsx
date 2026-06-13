import { notFound, redirect } from "next/navigation";
import { ContentType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import EditMenuItemForm from "./menu-item-form";

function getCategoryName(
  category: {
    slug: string;
    translations?: {
      locale: string;
      name: string;
    }[];
  },
  locale: "vi" | "en"
) {
  const translations = category.translations || [];

  return (
    translations.find((item) => item.locale === locale)?.name ||
    translations.find((item) => item.locale === "vi")?.name ||
    translations[0]?.name ||
    category.slug
  );
}

function getCategoryLinkOption(
  item: {
    slug: string;
    translations?: {
      locale: string;
      name: string;
    }[];
  },
  labelPrefix: string,
  viBase: string,
  enBase: string
) {
  const nameVi = getCategoryName(item, "vi");
  const nameEn = getCategoryName(item, "en");

  return {
    label: `${labelPrefix} / ${nameVi}`,
    vi: `${viBase}?category=${encodeURIComponent(nameVi)}`,
    en: `${enBase}?category=${encodeURIComponent(nameEn || nameVi)}`,
  };
}

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
    select: {
      id: true,
      type: true,
      slug: true,
      translations: {
        select: {
          locale: true,
          name: true,
        },
      },
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
      .filter((item) => item.type === ContentType.POST)
      .map((item) =>
        getCategoryLinkOption(
          item,
          "Bài viết",
          "/vi/tin-tuc",
          "/en/news"
        )
      ),
    productCategories: categories
      .filter((item) => item.type === ContentType.PRODUCT)
      .map((item) =>
        getCategoryLinkOption(
          item,
          "Sản phẩm",
          "/vi/san-pham",
          "/en/products"
        )
      ),
    serviceCategories: categories
      .filter((item) => item.type === ContentType.SERVICE)
      .map((item) =>
        getCategoryLinkOption(
          item,
          "Dịch vụ",
          "/vi/dich-vu",
          "/en/services"
        )
      ),
    projectCategories: categories
      .filter((item) => item.type === ContentType.PROJECT)
      .map((item) =>
        getCategoryLinkOption(
          item,
          "Công trình",
          "/vi/cong-trinh",
          "/en/projects"
        )
      ),
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