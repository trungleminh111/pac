import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Locale } from "@prisma/client";
import {
  getProjectBySlug,
  getProjectListingData,
} from "@/server/project/project.query";
import Banner from "@/components/site/Banner/Banner";
import OtherProjectsGallery from "@/components/site/OtherProjectsGallery/OtherProjectsGallery";

export async function generateMetadata({
  params,
}: {
  params: {
    locale: "vi" | "en";
    slug: string;
  };
}): Promise<Metadata> {
  const locale = params.locale === "en" ? "en" : "vi";
  const localeEnum = locale === "en" ? Locale.en : Locale.vi;

  const projectData = await getProjectBySlug({
    slug: params.slug,
    locale: localeEnum,
  });

  if (!projectData || !projectData.translations[0]) {
    return {};
  }

  const translation = projectData.translations[0];

  const structuredData: any =
    translation.structuredData || translation.content || {};
  const blocks = structuredData.blocks || [];

  const block1 =
    blocks.find((item: any) => item.type === "titleTextImageText") ||
    blocks[0] ||
    {};

  const path =
    locale === "vi"
      ? `/vi/cong-trinh/${params.slug}`
      : `/en/projects/${params.slug}`;

  return buildMetadata({
    locale,
    path,
    title: `${translation.title} | P.A.C STONE`,
    description: translation.excerpt || translation.title,
    image: block1.image || "https://pacstone.vn/URL-hinh-share-1200x630.jpg",
    type: "website",
    alternatePaths: {
      vi: `/vi/cong-trinh/${params.slug}`,
      en: `/en/projects/${params.slug}`,
      xDefault: `/vi/cong-trinh/${params.slug}`,
    },
  });
}


const workDetailContent = {
  vi: {
    bannerTitle: "CÔNG TRÌNH",
    infoTitle: "Thông tin công trình",
    customerLabel: "Khách hàng:",
    categoryLabel: "Hạng mục:",
    startDateLabel: "Ngày khởi công:",
    endDateLabel: "Ngày hoàn thành:",
    budgetLabel: "Ngân sách:",
    consultButton: "CẦN TƯ VẤN - BÁO GIÁ",
    shareLabel: "Chia sẻ:",
    otherProjectsTitle: "CÔNG TRÌNH KHÁC",
    dateLocale: "vi-VN",
  },
  en: {
    bannerTitle: "PROJECTS",
    infoTitle: "Project Information",
    customerLabel: "Client:",
    categoryLabel: "Category:",
    startDateLabel: "Start date:",
    endDateLabel: "Completion date:",
    budgetLabel: "Budget:",
    consultButton: "GET CONSULTATION - QUOTE",
    shareLabel: "Share:",
    otherProjectsTitle: "OTHER PROJECTS",
    dateLocale: "en-US",
  },
};

function getCategoryName(
  category:
    | {
        slug?: string | null;
        translations?: {
          locale: string;
          name: string;
        }[];
      }
    | null
    | undefined,
  locale: "vi" | "en"
) {
  const translations = category?.translations || [];

  return (
    translations.find((item) => item.locale === locale)?.name ||
    translations.find((item) => item.locale === "vi")?.name ||
    translations[0]?.name ||
    category?.slug ||
    ""
  );
}

export default async function WorkDetailPage({
  params,
}: {
  params: {
    locale: "vi" | "en";
    slug: string;
  };
}) {
  const locale = params.locale === "en" ? "en" : "vi";
  const localeEnum = locale === "en" ? Locale.en : Locale.vi;
  const content = workDetailContent[locale];

  const projectData = await getProjectBySlug({
    slug: params.slug,
    locale: localeEnum,
  });

  if (!projectData || !projectData.translations[0]) {
    return null;
  }

  const { works } = await getProjectListingData(localeEnum);

  const currentIndex = works.findIndex((item) => item.slug === params.slug);

  const prevProject = currentIndex > 0 ? works[currentIndex - 1] : null;

  const nextProject =
    currentIndex >= 0 && currentIndex < works.length - 1
      ? works[currentIndex + 1]
      : null;

  const detailHref = (slug: string) =>
    locale === "vi" ? `/vi/cong-trinh/${slug}` : `/en/projects/${slug}`;

  const ProjectPagination = () => (
    <div className="pagination">
      {prevProject ? (
        <Link href={detailHref(prevProject.slug)} className="pagination__arrow">
          <FaChevronLeft />
        </Link>
      ) : (
        <span className="pagination__arrow disabled">
          <FaChevronLeft />
        </span>
      )}

      {works.map((item, index) => (
        <Link
          key={item.slug}
          href={detailHref(item.slug)}
          className={`pagination__item ${
            index === currentIndex ? "active" : ""
          }`}
        >
          {(index + 1).toString().padStart(2, "0")}
        </Link>
      ))}

      {nextProject ? (
        <Link href={detailHref(nextProject.slug)} className="pagination__arrow">
          <FaChevronRight />
        </Link>
      ) : (
        <span className="pagination__arrow disabled">
          <FaChevronRight />
        </span>
      )}
    </div>
  );
  
  const translation = projectData.translations[0];
  const structuredData: any =
    translation.structuredData || translation.content || {};
  const blocks = structuredData.blocks || [];

  const block1 =
    blocks.find((item: any) => item.type === "titleTextImageText") ||
    blocks[0] ||
    {};

  const block2 =
    blocks.find((item: any) => item.type === "twoImagesContent") ||
    blocks[1] ||
    {};
  const otherProjects = works
  .filter((item) => item.slug !== params.slug)
  .map((item) => ({
    slug: item.slug,
    title: item.title,
    image: item.image,
    type: item.type,
  }));
  const project = {
    title: translation.title,
    intro: translation.excerpt || "",
    mainImage: block1.image || "",
    content1: block1.textTop || "",
    subTitle: block1.title || "",
    content2: block1.textBottom || "",
    gallery: [block2.image1, block2.image2].filter(Boolean),
    content3: block2.content1 || "",
    content4: block2.content2 || "",
    info: {
      customer: projectData.clientName || "",
      category: getCategoryName(projectData.category, locale),
      startDate: projectData.startedAt
        ? projectData.startedAt.toLocaleDateString(content.dateLocale)
        : "",
      endDate: projectData.completedAt
        ? projectData.completedAt.toLocaleDateString(content.dateLocale)
        : "",
      budget: projectData.budget || "",
    },
  };
  return (
    <div className="page-wrapper">
      <Header locale={locale} />

      <Banner
        title={content.bannerTitle}
        backgroundImg="/assets/images/backgrounds/contruct-banner.webp"
        row={3}
        col={1}
      />

      <section className="work-details section-space service-laptop">
        <div className="container">
          <div className="row gutter-y-60">
            <div className="col-lg-8 work-details__inner work-details__inner__image">
              <h2 className="work-details__title text-justify">
                {project.title}
              </h2>

              <p className="work-details__text text-justify">
                {project.content1}
              </p>

              <img src={project.mainImage} alt={project.title} />

              <p className="work-details__text work-details__text--two text-justify">
                {project.content2}
              </p>
            </div>

            <div className="col-lg-4">
              <aside className="work-details__sidebar">
                <h3 className="work-details__sidebar__title">
                  {content.infoTitle}
                </h3>

                <div className="work-details__sidebar__inner">
                  <div className="work-details__sidebar__info work-details__sidebar__info--client">
                    <h4 className="work-details__sidebar__info__title work-details__sidebar__info__title--client">
                      {content.customerLabel}
                    </h4>
                    <a
                      href="#"
                      className="work-details__sidebar__info__text work-details__sidebar__info__text--link"
                    >
                      {project.info.customer}
                    </a>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      {content.categoryLabel}
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      {project.info.category}
                    </p>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      {content.startDateLabel}
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      {project.info.startDate}
                    </p>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      {content.endDateLabel}
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      {project.info.endDate}
                    </p>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      {content.budgetLabel}
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      {project.info.budget}
                    </p>
                  </div>
                </div>
              </aside>
            </div>

            <div className="col-lg-4 mt-0 work-details__inner work-details__inner__image">
              <div className="work-details__inner d-flex gap-4 flex-column">
                {project.gallery.map((image) => (
                  <div key={image}>
                    <img src={image} alt={project.title} />
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-8 mt-0 d-flex flex-column pb-4">
              <h3 className="work-details__title text-justify">
                {project.subTitle}
              </h3>

              <p className="work-details__text text-justify">
                {project.content3}
              </p>

              <p className="work-details__text text-justify">
                {project.content4}
              </p>

              <div
                className="product-details__socials mt-auto bottom-bar"
                style={{ paddingBottom: 38 }}
              >
                <a href="#" className="floens-btn btn-consult">
                  {content.consultButton}
                </a>

                <ProjectPagination />

                <div className="details-social">
                  <h3 className="product-details__socials__title">
                    {content.shareLabel}
                  </h3>

                  <Link href="https://facebook.com" target="_blank">
                    <i className="icon-facebook">
                      <FaFacebookF />
                    </i>
                  </Link>

                  <Link href="https://zalo.com" target="_blank">
                    <img src="/assets/images/Icon_of_Zalo.svg.webp" alt="Zalo" />
                  </Link>

                  <Link href="https://youtube.com" target="_blank">
                    <i className="icon-youtube">
                      <FaYoutube />
                    </i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="work-details section-space service-tablet-phone">
        <div className="container">
          <div className="row gutter-y-60">
            <div className="col-lg-8">
              <div className="work-details__content">
                <h3 className="work-details__title text-justify">
                  {project.title}
                </h3>

                <p className="work-details__text work-details__text--one text-justify">
                  {project.content1}
                </p>

                <div className="work-details__image work-details__inner work-details__inner__image">
                  <img src={project.mainImage} alt={project.title} />
                </div>

                <p className="work-details__text work-details__text--two text-justify">
                  {project.content2}
                </p>

                <h3 className="work-details__title text-justify mt-0">
                  {project.subTitle}
                </h3>

                <p className="work-details__text work-details__text--three text-justify">
                  {project.content3}
                </p>

                <div className="work-details__inner">
                  <div className="row gutter-y-30">
                    {project.gallery[0] && (
                      <div className="col-lg-6 work-details__inner work-details__inner__image">
                        <img src={project.gallery[0]} alt={project.title} />
                      </div>
                    )}

                    <p className="work-details__text work-details__text--four text-justify">
                      {project.content4}
                    </p>

                    {project.gallery[1] && (
                      <div className="col-lg-6 my-0 work-details__inner work-details__inner__image">
                        <img src={project.gallery[1]} alt={project.title} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <aside className="work-details__sidebar">
                <h3 className="work-details__sidebar__title">
                  {content.infoTitle}
                </h3>

                <div className="work-details__sidebar__inner">
                  <div className="work-details__sidebar__info work-details__sidebar__info--client">
                    <h4 className="work-details__sidebar__info__title work-details__sidebar__info__title--client">
                      {content.customerLabel}
                    </h4>
                    <a
                      href="#"
                      className="work-details__sidebar__info__text work-details__sidebar__info__text--link"
                    >
                      {project.info.customer}
                    </a>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      {content.categoryLabel}
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      {project.info.category}
                    </p>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      {content.startDateLabel}
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      {project.info.startDate}
                    </p>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      {content.endDateLabel}
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      {project.info.endDate}
                    </p>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      {content.budgetLabel}
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      {project.info.budget}
                    </p>
                  </div>
                </div>
              </aside>

              <div className="mt-auto bottom-bar-phone">
                <a href="#" className="floens-btn btn-consult">
                  {content.consultButton}
                </a>

                <div className="details-social">
                  <h3 className="product-details__socials__title">
                    {content.shareLabel}
                  </h3>

                  <Link href="https://facebook.com" target="_blank">
                    <i className="icon-facebook">
                      <FaFacebookF />
                    </i>
                  </Link>

                  <Link href="https://zalo.com" target="_blank">
                    <img src="/assets/images/Icon_of_Zalo.svg.webp" alt="Zalo" />
                  </Link>

                  <Link href="https://youtube.com" target="_blank">
                    <i className="icon-youtube">
                      <FaYoutube />
                    </i>
                  </Link>
                </div>

                <ProjectPagination />
              </div>

              <div
                className="product-details__socials mt-auto bottom-bar-tablet"
                style={{ paddingBottom: 38 }}
              >
                <a href="#" className="floens-btn btn-consult">
                  {content.consultButton}
                </a>

                <ProjectPagination />

                <div className="details-social">
                  <h3 className="product-details__socials__title">
                    {content.shareLabel}
                  </h3>

                  <div>
                    <Link href="https://facebook.com" target="_blank">
                      <i className="icon-facebook">
                        <FaFacebookF />
                      </i>
                    </Link>

                    <Link href="https://zalo.com" target="_blank">
                      <img
                        src="/assets/images/Icon_of_Zalo.svg.webp"
                        alt="Zalo"
                      />
                    </Link>

                    <Link href="https://youtube.com" target="_blank">
                      <i className="icon-youtube">
                        <FaYoutube />
                      </i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        <OtherProjectsGallery
          title={content.otherProjectsTitle}
          projects={otherProjects}
          locale={locale}
        />        
      <Footer locale={locale} />
    </div>
  );
}