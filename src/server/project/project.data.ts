import { prisma } from "@/lib/prisma";
import { Locale as PrismaLocale } from "@prisma/client";
import type { Locale, ProjectCardItem, ProjectDetailItem } from "./project.type";

const DEFAULT_PROJECT_IMAGE = "/assets/images/works/project-13.png";

type CategoryWithTranslations = {
  slug: string;
  translations: {
    locale: PrismaLocale;
    name: string;
    slug: string | null;
  }[];
} | null;

function toPrismaLocale(locale: Locale): PrismaLocale {
  return locale === "en" ? PrismaLocale.en : PrismaLocale.vi;
}

function getFallbackLocales(locale: Locale): PrismaLocale[] {
  const currentLocale = toPrismaLocale(locale);

  return Array.from(new Set([currentLocale, PrismaLocale.vi]));
}

function getCategoryName(locale: Locale, category?: CategoryWithTranslations) {
  if (!category) return "";

  const prismaLocale = toPrismaLocale(locale);

  return (
    category.translations.find((item) => item.locale === prismaLocale)?.name ||
    category.translations.find((item) => item.locale === PrismaLocale.vi)
      ?.name ||
    category.translations[0]?.name ||
    category.slug ||
    ""
  );
}

function projectCardSelect(locale: Locale) {
  return {
    id: true,
    thumbnail: true,
    clientName: true,
    projectType: true,
    completedAt: true,
    category: {
      select: {
        slug: true,
        translations: {
          where: {
            locale: {
              in: getFallbackLocales(locale),
            },
          },
          select: {
            locale: true,
            name: true,
            slug: true,
          },
        },
      },
    },
    translations: {
      where: {
        locale: toPrismaLocale(locale),
      },
      select: {
        title: true,
        slug: true,
        excerpt: true,
      },
    },
  };
}

function mapProjectCard(
  locale: Locale,
  project: {
    id: string;
    thumbnail: string | null;
    clientName: string | null;
    projectType: string | null;
    completedAt: Date | null;
    category: CategoryWithTranslations;
    translations: {
      title: string;
      slug: string;
      excerpt: string | null;
    }[];
  }
): ProjectCardItem | null {
  const translation = project.translations[0];

  if (!translation) return null;

  return {
    id: project.id,
    title: translation.title,
    slug: translation.slug,
    excerpt: translation.excerpt || "",
    image: project.thumbnail || DEFAULT_PROJECT_IMAGE,
    category: getCategoryName(locale, project.category),
    clientName: project.clientName || "",
    projectType: project.projectType || "",
    completedAt: project.completedAt,
  };
}

export async function getProjectsPage(
  locale: Locale = "vi"
): Promise<ProjectCardItem[]> {
  const projects = await prisma.project.findMany({
    where: {
      status: "PUBLISHED",
      translations: {
        some: {
          locale: toPrismaLocale(locale),
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    select: projectCardSelect(locale),
  });

  return projects
    .map((project) => mapProjectCard(locale, project))
    .filter((project): project is ProjectCardItem => project !== null);
}

export async function getHomeProjects(
  locale: Locale = "vi"
): Promise<ProjectCardItem[]> {
  const projects = await prisma.project.findMany({
    where: {
      status: "PUBLISHED",
      translations: {
        some: {
          locale: toPrismaLocale(locale),
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 6,
    select: projectCardSelect(locale),
  });

  return projects
    .map((project) => mapProjectCard(locale, project))
    .filter((project): project is ProjectCardItem => project !== null);
}

export async function getProjectBySlug(
  locale: Locale,
  slug: string
): Promise<ProjectDetailItem | null> {
  const project = await prisma.project.findFirst({
    where: {
      status: "PUBLISHED",
      translations: {
        some: {
          locale: toPrismaLocale(locale),
          slug,
        },
      },
    },
    select: {
      id: true,
      status: true,
      thumbnail: true,
      gallery: true,
      clientName: true,
      projectType: true,
      startedAt: true,
      completedAt: true,
      budget: true,
      categoryId: true,
      allowIndex: true,
      publishedAt: true,
      category: {
        select: {
          slug: true,
          translations: {
            where: {
              locale: {
                in: getFallbackLocales(locale),
              },
            },
            select: {
              locale: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      translations: {
        where: {
          locale: toPrismaLocale(locale),
          slug,
        },
        select: {
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          seoTitle: true,
          seoDescription: true,
          structuredData: true,
        },
      },
    },
  });

  if (!project) return null;

  const translation = project.translations[0];

  if (!translation) return null;

  return {
    id: project.id,
    status: project.status,
    thumbnail: project.thumbnail,
    gallery: project.gallery,
    clientName: project.clientName,
    projectType: project.projectType,
    startedAt: project.startedAt,
    completedAt: project.completedAt,
    budget: project.budget,
    categoryId: project.categoryId,
    allowIndex: project.allowIndex,
    publishedAt: project.publishedAt,
    title: translation.title,
    slug: translation.slug,
    excerpt: translation.excerpt || "",
    content: translation.content,
    seoTitle: translation.seoTitle || "",
    seoDescription: translation.seoDescription || "",
    structuredData: translation.structuredData,
    categoryName: getCategoryName(locale, project.category),
  };
}