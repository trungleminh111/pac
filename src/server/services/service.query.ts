import { prisma } from "@/lib/prisma";
import type { Locale, ServiceCardItem, ServiceDetailItem } from "./service.type";

export async function getHomeServices(
  locale: Locale = "vi"
): Promise<ServiceCardItem[]> {
  const services = await prisma.service.findMany({
    where: {
      status: "PUBLISHED",
      translations: {
        some: {
          locale,
        },
      },
    },
    orderBy: {
      sortOrder: "asc",
    },
    select: {
      id: true,
      thumbnail: true,
      icon: true,
      translations: {
        where: {
          locale,
        },
        select: {
          title: true,
          slug: true,
          excerpt: true,
        },
      },
    },
  });

  return services
    .map((service) => {
      const translation = service.translations[0];

      if (!translation) return null;

      return {
        id: service.id,
        title: translation.title,
        slug: translation.slug,
        excerpt: translation.excerpt || "",
        image: service.thumbnail || "/assets/images/services/service1.jpg",
        icon: service.icon || "building",
      };
    })
    .filter((service): service is ServiceCardItem => service !== null);
}

export async function getServicesPage(
  locale: Locale = "vi"
): Promise<ServiceCardItem[]> {
  return getHomeServices(locale);
}

export async function getServiceBySlug(
  locale: Locale,
  slug: string
): Promise<ServiceDetailItem | null> {
  const service = await prisma.service.findFirst({
    where: {
      status: "PUBLISHED",
      translations: {
        some: {
          locale,
          slug,
        },
      },
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
          locale,
          slug,
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

  const translation = service.translations[0];

  if (!translation) return null;

  return {
    id: service.id,
    status: service.status,
    thumbnail: service.thumbnail,
    icon: service.icon,
    sortOrder: service.sortOrder,
    categoryId: service.categoryId,
    allowIndex: service.allowIndex,
    publishedAt: service.publishedAt,
    title: translation.title,
    slug: translation.slug,
    excerpt: translation.excerpt || "",
    content: translation.content,
    seoTitle: translation.seoTitle || "",
    seoDescription: translation.seoDescription || "",
  };
}