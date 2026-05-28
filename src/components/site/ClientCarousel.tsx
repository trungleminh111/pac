"use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

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
    <div className="client-carousel client-carousel--two">
      <div className="container">
        <Swiper
          modules={[Autoplay]}
          loop={true}
           speed={700}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          slidesPerView={5}
          spaceBetween={40}
          breakpoints={{
            0: { slidesPerView: 2 },
            576: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1200: { slidesPerView: 5 },
          }}
        >
          {colors.map((image) => (
            <SwiperSlide key={image}>
              <div className="client-carousel__one__item">
                <a href="/san-pham">
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
    </div>
  );
}