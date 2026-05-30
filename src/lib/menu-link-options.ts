import { prisma } from "@/lib/prisma";

export const staticMenuLinks = [
  { label: "Trang chủ", vi: "/vi", en: "/en" },
  { label: "Giới thiệu", vi: "/vi/gioi-thieu", en: "/en/about" },
  { label: "Sản phẩm", vi: "/vi/san-pham", en: "/en/products" },
  { label: "Dịch vụ", vi: "/vi/dich-vu", en: "/en/services" },
  { label: "Công trình", vi: "/vi/cong-trinh", en: "/en/projects" },
  { label: "Tin tức", vi: "/vi/tin-tuc", en: "/en/news" },
  { label: "Liên hệ", vi: "/vi/lien-he", en: "/en/contact" },
];

export async function getMenuLinkOptions() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

  return {
    staticLinks: staticMenuLinks,

    postCategories: categories
      .filter((item) => item.type === "POST")
      .map((item) => ({
        label: item.nameVi,
        vi: `/vi/tin-tuc/${item.slug}`,
        en: `/en/news/${item.slug}`,
      })),

    productCategories: categories
      .filter((item) => item.type === "PRODUCT")
      .map((item) => ({
        label: item.nameVi,
        vi: `/vi/san-pham/${item.slug}`,
        en: `/en/products/${item.slug}`,
      })),

    serviceCategories: categories
      .filter((item) => item.type === "SERVICE")
      .map((item) => ({
        label: item.nameVi,
        vi: `/vi/dich-vu/${item.slug}`,
        en: `/en/services/${item.slug}`,
      })),

    projectCategories: categories
      .filter((item) => item.type === "PROJECT")
      .map((item) => ({
        label: item.nameVi,
        vi: `/vi/cong-trinh/${item.slug}`,
        en: `/en/projects/${item.slug}`,
      })),
  };
}