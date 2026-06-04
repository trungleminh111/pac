import { prisma } from "@/lib/prisma";
import type { Locale, ProjectCardItem, ProjectDetailItem } from "./project.type";

export async function getProjectsPage(
  locale: Locale = "vi"
): Promise<ProjectCardItem[]> {
  const projects = await prisma.project.findMany({
    where: {
      status: "PUBLISHED",
      translations: {
        some: {
          locale,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    select: {
      id: true,
      thumbnail: true,
      clientName: true,
      projectType: true,
      completedAt: true,
      category: {
        select: {
          nameVi: true,
          nameEn: true,
        },
      },
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

  return projects
    .map((project) => {
      const translation = project.translations[0];

      if (!translation) return null;

      return {
        id: project.id,
        title: translation.title,
        slug: translation.slug,
        excerpt: translation.excerpt || "",
        image: project.thumbnail || "/assets/images/works/project-13.png",
        category:
          locale === "en"
            ? project.category?.nameEn || project.category?.nameVi || ""
            : project.category?.nameVi || "",
        clientName: project.clientName || "",
        projectType: project.projectType || "",
        completedAt: project.completedAt,
      };
    })
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
          locale,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 6,
    select: {
      id: true,
      thumbnail: true,
      clientName: true,
      projectType: true,
      completedAt: true,
      category: {
        select: {
          nameVi: true,
          nameEn: true,
        },
      },
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

  return projects
    .map((project) => {
      const translation = project.translations[0];

      if (!translation) return null;

      return {
        id: project.id,
        title: translation.title,
        slug: translation.slug,
        excerpt: translation.excerpt || "",
        image: project.thumbnail || "/assets/images/works/project-13.png",
        category:
          locale === "en"
            ? project.category?.nameEn || project.category?.nameVi || ""
            : project.category?.nameVi || "",
        clientName: project.clientName || "",
        projectType: project.projectType || "",
        completedAt: project.completedAt,
      };
    })
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
          locale,
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
          nameVi: true,
          nameEn: true,
        },
      },
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
    categoryName:
      locale === "en"
        ? project.category?.nameEn || project.category?.nameVi || ""
        : project.category?.nameVi || "",
  };
}