import { prisma } from "@/lib/prisma";
import { Locale, PageType, PublishStatus } from "@prisma/client";

type GetPageBySlugParams = {
  slug: string;
  locale?: Locale;
  type?: PageType;
  includeDraft?: boolean;
};

export async function getPageBySlug({
  slug,
  locale = Locale.vi,
  type,
  includeDraft = false,
}: GetPageBySlugParams) {
  return prisma.page.findFirst({
    where: {
      ...(type ? { type } : {}),
      ...(includeDraft ? {} : { status: PublishStatus.PUBLISHED }),
      translations: {
        some: {
          slug,
          locale,
        },
      },
    },
    include: {
      translations: {
        where: { locale },
        take: 1,
      },
    },
  });
}

export async function getPolicyPageBySlug(
  slug: string,
  locale: Locale = Locale.vi,
  includeDraft = false,
) {
  return getPageBySlug({
    slug,
    locale,
    type: PageType.POLICY,
    includeDraft,
  });
}

export async function getPublishedPages(locale: Locale = Locale.vi) {
  return prisma.page.findMany({
    where: {
      status: PublishStatus.PUBLISHED,
    },
    include: {
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

export async function getPublishedPolicyPages(locale: Locale = Locale.vi) {
  return prisma.page.findMany({
    where: {
      type: PageType.POLICY,
      status: PublishStatus.PUBLISHED,
    },
    include: {
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