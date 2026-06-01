"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const colors = [
  "marble-color-1.png",
  "marble-color-2.png",
  "marble-color-3.png",
  "marble-color-4.png",
  "marble-color-5.png",
  "marble-color-6.png",
];

export function ClientCarousel() {
  return (
    <div
      className="client-carousel client-carousel--two"
      style={{ width: "100%", maxWidth: "100%" }}
    >
      <Swiper
        modules={[Autoplay]}
        slidesPerView={5}
        loop
        speed={700}
        spaceBetween={65}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        touchStartPreventDefault={false}
        simulateTouch={true}
        allowTouchMove={true}
        edgeSwipeDetection="prevent"
        edgeSwipeThreshold={30}
        breakpoints={{
          0: { slidesPerView: 2, spaceBetween: 30 },
          500: { slidesPerView: 3, spaceBetween: 40 },
          768: { slidesPerView: 4, spaceBetween: 50 },
          992: { slidesPerView: 5, spaceBetween: 70 },
          1200: { slidesPerView: 5, spaceBetween: 50 },
        }}
      >
        {colors.map((image) => (
          <SwiperSlide key={image}>
            <div className="client-carousel__one__item">
              <a href="/san-pham/color-1">
                <img
                  src={`/assets/images/resources/${image}`}
                  alt="marble color"
                />
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}