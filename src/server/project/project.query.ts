import { prisma } from "@/lib/prisma";
import { ContentType, Locale, PublishStatus } from "@prisma/client";

type GetProjectBySlugParams = {
  slug: string;
  locale?: Locale;
  includeDraft?: boolean;
};

type CategoryTranslationItem = {
  locale: Locale;
  name: string;
};

function getCategoryName(
  translations: CategoryTranslationItem[],
  locale: Locale = Locale.vi
) {
  return (
    translations.find((item) => item.locale === locale)?.name ||
    translations[0]?.name ||
    ""
  );
}

function getProjectTypeText(
  project: {
    projectType: string | null;
    category?: {
      slug: string;
      translations: CategoryTranslationItem[];
    } | null;
  },
  locale: Locale
) {
  const categoryName = project.category
    ? getCategoryName(project.category.translations, locale)
    : "";

  if (categoryName) return categoryName;

  if (locale === Locale.en) {
    return project.projectType && project.projectType !== "Thi công ốp đá"
      ? project.projectType
      : "Stone Installation";
  }

  return project.projectType || "Thi công ốp đá";
}

function isAllCategory(translations: CategoryTranslationItem[]) {
  const viName =
    translations.find((item) => item.locale === Locale.vi)?.name || "";
  const enName =
    translations.find((item) => item.locale === Locale.en)?.name || "";

  return (
    viName.trim().toLowerCase() === "tất cả" ||
    enName.trim().toLowerCase() === "all"
  );
}

export async function getProjectBySlug({
  slug,
  locale = Locale.vi,
  includeDraft = false,
}: GetProjectBySlugParams) {
  return prisma.project.findFirst({
    where: {
      ...(includeDraft ? {} : { status: PublishStatus.PUBLISHED }),
      translations: {
        some: {
          slug,
          locale,
        },
      },
    },
    include: {
      category: {
        include: {
          translations: true,
        },
      },
      translations: {
        where: { locale },
        take: 1,
      },
    },
  });
}

export async function getPublishedProjects(locale: Locale = Locale.vi) {
  return prisma.project.findMany({
    where: {
      status: PublishStatus.PUBLISHED,
      translations: {
        some: {
          locale,
        },
      },
    },
    include: {
      category: {
        include: {
          translations: true,
        },
      },
      translations: {
        where: { locale },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function getProjectFilters(locale: Locale = Locale.vi) {
  const categories = await prisma.category.findMany({
    where: {
      type: ContentType.PROJECT,
      isActive: true,
      slug: {
        not: "all",
      },
    },
    orderBy: {
      sortOrder: "asc",
    },
    include: {
      translations: true,
    },
  });

  const cleanCategories = categories.filter(
    (category) => !isAllCategory(category.translations)
  );

  return [
    {
      label: locale === Locale.en ? "All" : "Tất cả",
      slug: "all",
    },
    ...cleanCategories.map((category) => ({
      label: getCategoryName(category.translations, locale) || category.slug,
      slug: category.slug,
    })),
  ];
}

export async function getProjectWorks(locale: Locale = Locale.vi) {
  const projects = await getPublishedProjects(locale);

  return projects
    .filter((project) => project.translations[0])
    .map((project) => {
      const translation = project.translations[0];

      return {
        title: translation.title,
        type: getProjectTypeText(project, locale),
        image: project.thumbnail || "",
        categorySlug: project.category?.slug || "",
        slug: translation.slug,
      };
    });
}

export async function getProjectListingData(locale: Locale = Locale.vi) {
  const [filters, works] = await Promise.all([
    getProjectFilters(locale),
    getProjectWorks(locale),
  ]);

  return {
    filters,
    works,
  };
}

export async function getHomeProjectSlides(locale: Locale = Locale.vi) {
  const projects = await prisma.project.findMany({
    where: {
      status: PublishStatus.PUBLISHED,
      translations: {
        some: {
          locale,
        },
      },
    },
    include: {
      category: {
        include: {
          translations: true,
        },
      },
      translations: {
        where: { locale },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 8,
  });

  return projects
    .filter((project) => project.translations[0])
    .map((project) => {
      const translation = project.translations[0];

      return {
        title: translation.title,
        image: project.thumbnail || "",
        type: getProjectTypeText(project, locale),
        slug: translation.slug,
      };
    });
}