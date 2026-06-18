import type { MetadataRoute } from "next";
import { Locale as PrismaLocale } from "@prisma/client";
import { SITE_URL } from "@/lib/seo";
import { getProductsPage } from "@/server/products/product.query";
import { getServicesPage } from "@/server/services/service.query";
import { getProjectListingData } from "@/server/project/project.query";
import { getPostsPage } from "@/server/post/post.data";

type SitemapItem = {
  url: string;
};

function uniqueUrls(items: SitemapItem[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.url)) return false;

    seen.add(item.url);
    return true;
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    viProductsPage,
    enProductsPage,
    viServices,
    enServices,
    viProjectsData,
    enProjectsData,
    viPosts,
    enPosts,
  ] = await Promise.all([
    getProductsPage({
      locale: "vi",
      page: 1,
      pageSize: 9999,
    }),

    getProductsPage({
      locale: "en",
      page: 1,
      pageSize: 9999,
    }),

    getServicesPage("vi"),
    getServicesPage("en"),

    getProjectListingData(PrismaLocale.vi),
    getProjectListingData(PrismaLocale.en),

    getPostsPage("vi"),
    getPostsPage("en"),
  ]);

  const staticUrls: SitemapItem[] = [
    {
      url: `${SITE_URL}/vi`,
    },
    {
      url: `${SITE_URL}/en`,
    },

    {
      url: `${SITE_URL}/vi/san-pham`,
    },
    {
      url: `${SITE_URL}/en/products`,
    },

    {
      url: `${SITE_URL}/vi/dich-vu`,
    },
    {
      url: `${SITE_URL}/en/services`,
    },

    {
      url: `${SITE_URL}/vi/cong-trinh`,
    },
    {
      url: `${SITE_URL}/en/projects`,
    },

    {
      url: `${SITE_URL}/vi/tin-tuc`,
    },
    {
      url: `${SITE_URL}/en/news`,
    },

    {
      url: `${SITE_URL}/vi/gioi-thieu`,
    },
    {
      url: `${SITE_URL}/en/about`,
    },

    {
      url: `${SITE_URL}/vi/lien-he`,
    },
    {
      url: `${SITE_URL}/en/contact`,
    },

    {
      url: `${SITE_URL}/vi/gio-hang`,
    },
    {
      url: `${SITE_URL}/en/gio-hang`,
    },
  ];

  const productUrls: SitemapItem[] = [
    ...viProductsPage.products.map((product) => ({
      url: `${SITE_URL}/vi/san-pham/${product.slug}`,
    })),

    ...enProductsPage.products.map((product) => ({
      url: `${SITE_URL}/en/products/${product.slug}`,
    })),
  ];

  const serviceUrls: SitemapItem[] = [
    ...viServices.map((service) => ({
      url: `${SITE_URL}/vi/dich-vu/${service.slug}`,
    })),

    ...enServices.map((service) => ({
      url: `${SITE_URL}/en/services/${service.slug}`,
    })),
  ];

  const projectUrls: SitemapItem[] = [
    ...viProjectsData.works.map((project) => ({
      url: `${SITE_URL}/vi/cong-trinh/${project.slug}`,
    })),

    ...enProjectsData.works.map((project) => ({
      url: `${SITE_URL}/en/projects/${project.slug}`,
    })),
  ];

  const postUrls: SitemapItem[] = [
    ...viPosts.map((post) => ({
      url: `${SITE_URL}/vi/tin-tuc/${post.slug}`,
    })),

    ...enPosts.map((post) => ({
      url: `${SITE_URL}/en/news/${post.slug}`,
    })),
  ];

  return uniqueUrls([
    ...staticUrls,
    ...productUrls,
    ...serviceUrls,
    ...projectUrls,
    ...postUrls,
  ]);
}