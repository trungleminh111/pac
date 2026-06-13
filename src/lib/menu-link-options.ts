import { prisma } from "@/lib/prisma";
import { ContentType, Locale } from "@prisma/client";

export const staticMenuLinks = [
  { label: "Trang chủ", vi: "/vi", en: "/en" },
  { label: "Giới thiệu", vi: "/vi/gioi-thieu", en: "/en/about" },
  { label: "Sản phẩm", vi: "/vi/san-pham", en: "/en/products" },
  { label: "Dịch vụ", vi: "/vi/dich-vu", en: "/en/services" },
  { label: "Công trình", vi: "/vi/cong-trinh", en: "/en/projects" },
  { label: "Tin tức", vi: "/vi/tin-tuc", en: "/en/news" },
  { label: "Liên hệ", vi: "/vi/lien-he", en: "/en/contact" },
];

function getCategoryName(
  category: {
    slug: string;
    translations?: {
      locale: Locale;
      name: string;
    }[];
  },
  locale: Locale = Locale.vi
) {
  const translations = category.translations || [];

  return (
    translations.find((item) => item.locale === locale)?.name ||
    translations.find((item) => item.locale === Locale.vi)?.name ||
    translations[0]?.name ||
    category.slug
  );
}

export async function getMenuLinkOptions() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
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

  return {
    staticLinks: staticMenuLinks,

    postCategories: categories
      .filter((item) => item.type === ContentType.POST)
      .map((item) => ({
        label: getCategoryName(item, Locale.vi),
        vi: `/vi/tin-tuc/${item.slug}`,
        en: `/en/news/${item.slug}`,
      })),

    productCategories: categories
      .filter((item) => item.type === ContentType.PRODUCT)
      .map((item) => ({
        label: getCategoryName(item, Locale.vi),
        vi: `/vi/san-pham/${item.slug}`,
        en: `/en/products/${item.slug}`,
      })),

    serviceCategories: categories
      .filter((item) => item.type === ContentType.SERVICE)
      .map((item) => ({
        label: getCategoryName(item, Locale.vi),
        vi: `/vi/dich-vu/${item.slug}`,
        en: `/en/services/${item.slug}`,
      })),

    projectCategories: categories
      .filter((item) => item.type === ContentType.PROJECT)
      .map((item) => ({
        label: getCategoryName(item, Locale.vi),
        vi: `/vi/cong-trinh/${item.slug}`,
        en: `/en/projects/${item.slug}`,
      })),
  };
}