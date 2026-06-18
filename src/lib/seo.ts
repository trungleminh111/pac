import type { Metadata } from "next";

export const SITE_URL = "https://pacstone.vn";
export const SITE_NAME = "P.A.C STONE";

type Locale = "vi" | "en";

type SeoParams = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image: string;
  type?: "website" | "product";
  alternatePaths?: {
    vi: string;
    en: string;
    xDefault?: string;
  };
};

export function absoluteUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  image,
  type = "website",
  alternatePaths,
}: SeoParams): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  const pathWithoutLocale = path.replace(/^\/(vi|en)/, "");

  const viHref = alternatePaths
    ? absoluteUrl(alternatePaths.vi)
    : `${SITE_URL}/vi${pathWithoutLocale}`;

  const enHref = alternatePaths
    ? absoluteUrl(alternatePaths.en)
    : `${SITE_URL}/en${pathWithoutLocale}`;

  const xDefaultHref = alternatePaths?.xDefault
    ? absoluteUrl(alternatePaths.xDefault)
    : viHref;

  return {
    title,
    description,

    alternates: {
      canonical: url,
      languages: {
        vi: viHref,
        en: enHref,
        "x-default": xDefaultHref,
      },
    },

    openGraph: {
      title,
      description,
      images: [imageUrl],
      url,
      type: type as any,
      siteName: SITE_NAME,
      locale: locale === "vi" ? "vi_VN" : "en_US",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}