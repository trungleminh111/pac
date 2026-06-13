import { prisma } from "@/lib/prisma";
import { ContentType, Locale as PrismaLocale } from "@prisma/client";
import type {
  AdminLocale,
  AdminServiceDetail,
  AdminServiceItem,
  ServiceCategoryOption,
} from "./service.type";

function toPrismaLocale(locale: AdminLocale) {
  return locale === "en" ? PrismaLocale.en : PrismaLocale.vi;
}

function formatDate(value: Date | null) {
  if (!value) return "";
  return value.toLocaleDateString("vi-VN");
}

function formatDateTimeLocal(value: Date | null) {
  if (!value) return "";

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  const hour = String(value.getHours()).padStart(2, "0");
  const minute = String(value.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function getCategoryName(
  translations: { locale: PrismaLocale; name: string }[]
) {
  return (
    translations.find((item) => item.locale === PrismaLocale.vi)?.name ||
    translations[0]?.name ||
    ""
  );
}

function getContentHtml(value: unknown) {
  if (!value || typeof value !== "object") return "";

  const content = value as {
    html?: string;
  };

  return typeof content.html === "string" ? content.html : "";
}

export async function getAdminServices(): Promise<AdminServiceItem[]> {
  const services = await prisma.service.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      status: true,
      thumbnail: true,
      icon: true,
      sortOrder: true,
      publishedAt: true,
      updatedAt: true,
      translations: {
        select: {
          locale: true,
          title: true,
          slug: true,
        },
      },
      category: {
        select: {
          translations: {
            select: {
              locale: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return services.map((service) => {
    const vi = service.translations.find(
      (item) => item.locale === PrismaLocale.vi
    );
    const en = service.translations.find(
      (item) => item.locale === PrismaLocale.en
    );

    return {
      id: service.id,
      status: service.status as AdminServiceItem["status"],
      thumbnail: service.thumbnail,
      icon: service.icon,
      sortOrder: service.sortOrder,
      categoryName: service.category
        ? getCategoryName(service.category.translations)
        : "Không chọn",
      titleVi: vi?.title || "Chưa có tiêu đề",
      titleEn: en?.title || "",
      slugVi: vi?.slug || "",
      slugEn: en?.slug || "",
      publishedAt: formatDate(service.publishedAt),
      updatedAt: formatDate(service.updatedAt),
    };
  });
}

export async function getAdminServiceById(
  id: string,
  locale: AdminLocale
): Promise<AdminServiceDetail | null> {
  const prismaLocale = toPrismaLocale(locale);

  const service = await prisma.service.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      status: true,
      thumbnail: true,
      icon: true,
      sortOrder: true,
      categoryId: true,
      allowIndex: true,
      publishedAt: true,
      translations: {
        where: {
          locale: prismaLocale,
        },
        select: {
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          seoTitle: true,
          seoDescription: true,
        },
      },
    },
  });

  if (!service) return null;

  const translation = service.translations[0] || null;

  return {
    id: service.id,
    status: service.status as AdminServiceDetail["status"],
    thumbnail: service.thumbnail || "",
    icon: service.icon || "",
    sortOrder: service.sortOrder,
    categoryId: service.categoryId || "",
    allowIndex: service.allowIndex,
    publishedAt: formatDateTimeLocal(service.publishedAt),
    activeLocale: locale,
    title: translation?.title || "",
    slug: translation?.slug || "",
    excerpt: translation?.excerpt || "",
    content: getContentHtml(translation?.content),
    seoTitle: translation?.seoTitle || "",
    seoDescription: translation?.seoDescription || "",
  };
}

export async function getServiceFormOptions(): Promise<{
  categories: ServiceCategoryOption[];
}> {
  const categories = await prisma.category.findMany({
    where: {
      type: ContentType.SERVICE,
      isActive: true,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
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
    categories: categories.map((category) => {
      const vi = category.translations.find(
        (item) => item.locale === PrismaLocale.vi
      );
      const en = category.translations.find(
        (item) => item.locale === PrismaLocale.en
      );

      return {
        id: category.id,
        nameVi: vi?.name || category.slug,
        nameEn: en?.name || null,
      };
    }),
  };
}