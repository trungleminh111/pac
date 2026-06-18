import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { getServicesPage } from "@/server/services/service.query";
import type { Locale } from "@/server/services/service.type";
import "@/styles/dichvu.css";

import { LuArrowRight } from "react-icons/lu";
import { FaBuilding, FaImage, FaUtensils } from "react-icons/fa6";
import { MdStairs, MdDesignServices, MdViewColumn } from "react-icons/md";
import Banner from "@/components/site/Banner/Banner";

const iconMap = {
  building: FaBuilding,
  column: MdViewColumn,
  stairs: MdStairs,
  kitchen: FaUtensils,
  image: FaImage,
  design: MdDesignServices,
};

const servicesPageContent = {
  vi: {
    bannerTitle: "DỊCH VỤ",
    viewDetail: "Xem chi tiết",
    emptyText: "Chưa có dịch vụ nào.",
  },
  en: {
    bannerTitle: "SERVICES",
    viewDetail: "View details",
    emptyText: "No services found.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: {
    locale: Locale;
  };
}): Promise<Metadata> {
  const path = params.locale === "en" ? "/en/services" : "/vi/dich-vu";

  return buildMetadata({
    locale: params.locale,
    path,
    title: "Dịch Vụ Thi Công Đá | P.A.C STONE",
    description: "Mô tả dịch vụ",
    image: "",
    type: "website",
    alternatePaths: {
      vi: "/vi/dich-vu",
      en: "/en/services",
      xDefault: "/vi/dich-vu",
    },
  });
}

function serviceHref(locale: Locale, slug: string) {
  return locale === "vi" ? `/vi/dich-vu/${slug}` : `/en/services/${slug}`;
}

export default async function ServicesPage({
  params,
}: {
  params: {
    locale: Locale;
  };
}) {
  const locale = params.locale;
  const content = locale === "en" ? servicesPageContent.en : servicesPageContent.vi;
  const services = await getServicesPage(locale);

  return (
    <div className="page-wrapper">
      <Header locale={locale} />

      {/* <PageHeader
        title=""
        bgImage="/assets/images/backgrounds/PACSTONE-DICHVU-header.png"
      /> */}
      <Banner
        title={content.bannerTitle}
        backgroundImg="/assets/images/backgrounds/service-banner.webp"
        row={3}
        col={7}
      />
      <section className="services-page section-space">
        <div className="container">
          <div className="row gutter-y-30 d-flex justify-center">
            {services.map((service) => {
              const Icon =
                iconMap[service.icon as keyof typeof iconMap] || FaBuilding;

              const href = serviceHref(locale, service.slug);

              return (
                <div className="col-xl-4 col-md-6" key={service.id}>
                  <div className="service-card-two">
                    <div
                      className="service-card-two__bg"
                      style={{
                        backgroundImage:
                          "url('/assets/images/services/service-bg-2-1.png')",
                      }}
                    />

                    <div className="service-card-two__image">
                      <img src={service.image} alt={service.title} />
                    </div>

                    <div className="service-card-two__content">
                      <h3 className="service-card-two__title">
                        <Link href={href}>{service.title}</Link>
                      </h3>

                      <div className="service-card-two__bottom">
                        <Link href={href} className="service-detail-link">
                          <span>
                            {content.viewDetail}
                          </span>
                          <LuArrowRight className="service-detail-arrow" />
                        </Link>

                        <span className="service-card-two__icon">
                          <Icon />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {services.length === 0 && (
              <div className="col-12">
                <p className="text-center">
                  {content.emptyText}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  );
}