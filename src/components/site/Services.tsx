"use client";

import { useRef } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

import type { IconType } from "react-icons";
import { FaBuilding, FaImage, FaUtensils } from "react-icons/fa6";
import { MdStairs, MdDesignServices, MdViewColumn } from "react-icons/md";
import { LuArrowRight } from "react-icons/lu";

type ServiceItem = {
  title: string;
  image: string;
  Icon: IconType;
};

const services: ServiceItem[] = [
  { title: "Thi Công Đá Ốp Mặt Tiền", image: "service1.jpg", Icon: FaBuilding },
  { title: "Thi Công Đá Ốp Cột", image: "service2.jpg", Icon: MdViewColumn },
  { title: "Thi Công Đá Ốp Cầu Thang", image: "service3.jpg", Icon: MdStairs },
  {
    title: "Thiết kế thi công đá ốp sàn thang máy",
    image: "service3.jpg",
    Icon: MdStairs,
  },
  { title: "Thi Công Đá Ốp Bếp", image: "service4.jpg", Icon: FaUtensils },
  { title: "Thi Công Tranh Đá", image: "service1.jpg", Icon: FaImage },
  {
    title: "Thiết Kế Và Thi Công Hoa Văn Đá",
    image: "service2.jpg",
    Icon: MdDesignServices,
  },
];

export function Services() {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  return (
    <section className="services-two section-space-two">
      <div className="container">
        <div className="services-two__top">
          <div className="row gutter-y-50 align-items-center">
            <div className="col-lg-8 col-md-10">
              <div className="sec-title">
                <h6 className="sec-title__tagline">Dịch vụ</h6>
                <h3 className="sec-title__title">
                  Chúng tôi cung cấp các dịch vụ tốt nhất cho Bạn
                </h3>
              </div>
            </div>

            <div className="col-lg-4 d-none d-md-flex justify-content-lg-end">
              <div className="projects-one__bottom services-slider-nav">
                <div className="navigation-wrapper d-none d-md-flex">
                  <button
                    ref={prevRef}
                    className="nav-btn-pair prev services-prev"
                    type="button"
                    aria-label="Previous slide"
                  >
                    <span className="circle-base"></span>
                    <span className="arrow-line"></span>
                  </button>

                  <button
                    ref={nextRef}
                    className="nav-btn-pair next services-next"
                    type="button"
                    aria-label="Next slide"
                  >
                    <span className="circle-base"></span>
                    <span className="arrow-line"></span>
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
          loop
          speed={700}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper: SwiperType) => {
            if (
              swiper.params.navigation &&
              typeof swiper.params.navigation !== "boolean"
            ) {
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
          {services.map(({ title, image, Icon }) => (
            <SwiperSlide key={title}>
              <div className="item">
                <div className="service-card-two">
                  <div
                    className="service-card-two__bg"
                    style={{
                      backgroundImage:
                        "url('/assets/images/services/service-bg-2-1.png')",
                    }}
                  />

                  <div className="service-card-two__image">
                    <img src={`/assets/images/services/${image}`} alt={title} />
                  </div>

                  <div className="service-card-two__content">
                    <h3 className="service-card-two__title">
                      <a href="/dich-vu">{title}</a>
                    </h3>

                    <div className="service-card-two__bottom">
                      <a href="/dich-vu" className="service-detail-link">
                        <span>Xem chi tiết</span>
                        <LuArrowRight className="service-detail-arrow" />
                      </a>

                      <span className="service-card-two__icon">
                        <Icon />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}