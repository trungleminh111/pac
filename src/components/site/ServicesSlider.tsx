"use client";

import { useRef } from "react";
import Link from "next/link";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

import { FaBuilding, FaImage, FaUtensils } from "react-icons/fa6";
import { MdStairs, MdDesignServices, MdViewColumn } from "react-icons/md";
import { LuArrowRight } from "react-icons/lu";
import type { ServiceCardItem, Locale } from "@/server/services/service.type";

const iconMap = {
  building: FaBuilding,
  column: MdViewColumn,
  stairs: MdStairs,
  kitchen: FaUtensils,
  image: FaImage,
  design: MdDesignServices,
};

function serviceHref(locale: Locale, slug: string) {
  return locale === "vi" ? `/vi/dich-vu/${slug}` : `/en/services/${slug}`;
}

export function ServicesSlider({
  services,
  locale,
}: {
  services: ServiceCardItem[];
  locale: Locale;
}) {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  return (
    <section className="services-two section-space-two pt-5">
      <div className="container">
        <div className="services-two__top">
          <div className="row gutter-y-50 align-items-center">
            <div className="col-lg-8 col-md-10">
              <div className="sec-title">
                <h6 className="sec-title__tagline">
                  {locale === "vi" ? "Dịch vụ" : "Services"}
                </h6>
                <h3 className="sec-title__title">
                  {locale === "vi"
                    ? "Chúng tôi cung cấp các dịch vụ tốt nhất cho Bạn"
                    : "We provide the best services for you"}
                </h3>
              </div>
            </div>

            <div className="col-lg-4 d-none d-md-flex justify-content-lg-end">
              <div className="projects-one__bottom services-slider-nav">
                <div className="navigation-wrapper d-none d-md-flex">
                  <button ref={prevRef} className="nav-btn-pair prev services-prev" type="button">
                    <span className="circle-base" />
                    <span className="arrow-line" />
                  </button>

                  <button ref={nextRef} className="nav-btn-pair next services-next" type="button">
                    <span className="circle-base" />
                    <span className="arrow-line" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <Swiper
          modules={[Autoplay, Navigation]}
          loop={services.length > 3}
          speed={700}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper: SwiperType) => {
            if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          slidesPerView={3}
          spaceBetween={30}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 15 },
            768: { slidesPerView: 2, spaceBetween: 30 },
            1200: { slidesPerView: 3, spaceBetween: 30 },
            1600: { slidesPerView: 4, spaceBetween: 30 },
          }}
          className="services-two__carousel"
        >
          {services.map((service) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap] || FaBuilding;
            const href = serviceHref(locale, service.slug);

            return (
              <SwiperSlide key={service.id}>
                <div className="item">
                  <div className="service-card-two">
                    <div
                      className="service-card-two__bg"
                      style={{
                        backgroundImage: "url('/assets/images/services/service-bg-2-1.png')",
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
                          <span>{locale === "vi" ? "Xem chi tiết" : "View detail"}</span>
                          <LuArrowRight className="service-detail-arrow" />
                        </Link>

                        <span className="service-card-two__icon">
                          <Icon />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}