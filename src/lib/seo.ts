import type { Metadata } from "next";

export const SITE_URL = "https://pacstone.vn";
export const SITE_NAME = "P.A.C STONE";
export const DEFAULT_OG_IMAGE =
  "https://pub-cbcc93445b0c42eda9fea9d3440439a2.r2.dev/media/2026/1781778876754-e420fdca-b15e-430f-bfc5-ca4c78539be3.webp";

type Locale = "vi" | "en";

type SeoParams = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image?: string | null;
  type?: "website" | "product";
  alternatePaths?: {
    vi: string;
    en: string;
    xDefault?: string;
  };
};

export function absoluteUrl(url?: string | null) {
  const safeUrl = url?.trim() || DEFAULT_OG_IMAGE;

  if (safeUrl.startsWith("http://") || safeUrl.startsWith("https://")) {
    return safeUrl;
  }

  return `${SITE_URL}${safeUrl.startsWith("/") ? safeUrl : `/${safeUrl}`}`;
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