import { prisma } from "@/lib/prisma";
import { ContentType, Locale as PrismaLocale } from "@prisma/client";
import type {
  AdminLocale,
  AdminProjectDetail,
  AdminProjectItem,
  ProjectCategoryOption,
  ProjectStructuredData,
} from "./project.type";

function toPrismaLocale(locale: AdminLocale) {
  return locale === "en" ? PrismaLocale.en : PrismaLocale.vi;
}

function formatDate(value: Date | null) {
  if (!value) return "";
  return value.toLocaleDateString("vi-VN");
}

function formatDateInput(value: Date | null) {
  if (!value) return "";

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

function defaultStructuredData(): ProjectStructuredData {
  return {
    blocks: [
      {
        type: "titleTextImageText",
        title: "",
        textTop: "",
        image: "",
        textBottom: "",
      },
      {
        type: "twoImagesContent",
        image1: "",
        image2: "",
        content1: "",
        content2: "",
      },
    ],
  };
}

function normalizeStructuredData(value: unknown): ProjectStructuredData {
  if (!value || typeof value !== "object") {
    return defaultStructuredData();
  }

  const data = value as ProjectStructuredData;

  if (!Array.isArray(data.blocks)) {
    return defaultStructuredData();
  }

  const block1 = data.blocks[0];
  const block2 = data.blocks[1];

  return {
    blocks: [
      {
        type: "titleTextImageText",
        title:
          block1?.type === "titleTextImageText" &&
          typeof block1.title === "string"
            ? block1.title
            : "",
        textTop:
          block1?.type === "titleTextImageText" &&
          typeof block1.textTop === "string"
            ? block1.textTop
            : "",
        image:
          block1?.type === "titleTextImageText" &&
          typeof block1.image === "string"
            ? block1.image
            : "",
        textBottom:
          block1?.type === "titleTextImageText" &&
          typeof block1.textBottom === "string"
            ? block1.textBottom
            : "",
      },
      {
        type: "twoImagesContent",
        image1:
          block2?.type === "twoImagesContent" &&
          typeof block2.image1 === "string"
            ? block2.image1
            : "",
        image2:
          block2?.type === "twoImagesContent" &&
          typeof block2.image2 === "string"
            ? block2.image2
            : "",
        content1:
          block2?.type === "twoImagesContent" &&
          typeof block2.content1 === "string"
            ? block2.content1
            : "",
        content2:
          block2?.type === "twoImagesContent" &&
          typeof block2.content2 === "string"
            ? block2.content2
            : "",
      },
    ],
  };
}

export async function getAdminProjects(): Promise<AdminProjectItem[]> {
  const projects = await prisma.project.findMany({
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      status: true,
      thumbnail: true,
      clientName: true,
      projectType: true,
      startedAt: true,
      completedAt: true,
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

  return projects.map((project) => {
    const vi = project.translations.find(
      (item) => item.locale === PrismaLocale.vi
    );
    const en = project.translations.find(
      (item) => item.locale === PrismaLocale.en
    );

    return {
      id: project.id,
      status: project.status as AdminProjectItem["status"],
      thumbnail: project.thumbnail,
      clientName: project.clientName || "",
      projectType: project.projectType || "",
      categoryName: project.category
        ? getCategoryName(project.category.translations)
        : "Không chọn",
      titleVi: vi?.title || "Chưa có tiêu đề",
      titleEn: en?.title || "",
      slugVi: vi?.slug || "",
      slugEn: en?.slug || "",
      startedAt: formatDate(project.startedAt),
      completedAt: formatDate(project.completedAt),
      publishedAt: formatDate(project.publishedAt),
      updatedAt: formatDate(project.updatedAt),
    };
  });
}

export async function getAdminProjectById(
  id: string,
  locale: AdminLocale
): Promise<AdminProjectDetail | null> {
  const prismaLocale = toPrismaLocale(locale);

  const project = await prisma.project.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      status: true,
      thumbnail: true,
      clientName: true,
      projectType: true,
      startedAt: true,
      completedAt: true,
      categoryId: true,
      allowIndex: true,
      translations: {
        where: {
          locale: prismaLocale,
        },
        select: {
          title: true,
          slug: true,
          excerpt: true,
          seoTitle: true,
          seoDescription: true,
          structuredData: true,
        },
      },
    },
  });

  if (!project) return null;

  const translation = project.translations[0] || null;

  return {
    id: project.id,
    status: project.status as AdminProjectDetail["status"],
    thumbnail: project.thumbnail || "",
    clientName: project.clientName || "",
    projectType: project.projectType || "",
    startedAt: formatDateInput(project.startedAt),
    completedAt: formatDateInput(project.completedAt),
    categoryId: project.categoryId || "",
    allowIndex: project.allowIndex,
    activeLocale: locale,
    title: translation?.title || "",
    slug: translation?.slug || "",
    excerpt: translation?.excerpt || "",
    seoTitle: translation?.seoTitle || "",
    seoDescription: translation?.seoDescription || "",
    structuredData: normalizeStructuredData(translation?.structuredData),
  };
}

export async function getProjectFormOptions(): Promise<{
  categories: ProjectCategoryOption[];
}> {
  const categories = await prisma.category.findMany({
    where: {
      type: ContentType.PROJECT,
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