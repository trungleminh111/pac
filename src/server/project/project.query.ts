import { prisma } from "@/lib/prisma";
import { ContentType, Locale, PublishStatus } from "@prisma/client";

type GetProjectBySlugParams = {
  slug: string;
  locale?: Locale;
  includeDraft?: boolean;
};

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
      category: true,
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
    },
    include: {
      category: true,
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
      NOT: [
        { slug: "all" },
        { nameVi: "Tất cả" },
        { nameEn: "All" },
      ],
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  return [
    {
      label: locale === Locale.en ? "All" : "Tất cả",
      slug: "all",
    },
    ...categories.map((category) => ({
      label:
        locale === Locale.en && category.nameEn
          ? category.nameEn
          : category.nameVi,
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
        type: project.projectType || "Tile Care",
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