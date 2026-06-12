"use client";

import { useRef } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { LuMoveRight } from "react-icons/lu";
import "swiper/css";

type ProjectItem = {
  title: string;
  image: string;
  type: string;
  slug: string;
};

export function ProjectsClient({ projects }: { projects: ProjectItem[] }) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="projects-one">
      <div className="projects-one__container">
        <div className="projects-one__left projects-one__col projects-one__col--left">
          <Swiper
            modules={[Autoplay]}
            loop
            speed={700}
            slidesPerView={1.33}
            spaceBetween={30}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 1.33,
                spaceBetween: 30,
              },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="projects-one__slider"
          >
            {projects.map((project) => (
              <SwiperSlide key={project.slug}>
                <div className="project-card">
                  <img
                    src={project.image}
                    alt={project.title}
                  />
                  <div className="project-card__type">
                    {project.type}
                  </div>


                  <div className="project-card__overlay">
                    <h3>{project.title} </h3>
                    <span>
                      <LuMoveRight />
                    </span>

                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="navigation-wrapper justify-content-center d-flex d-md-none pb-2 pt-2">
            <button
              className="nav-btn-pair prev"
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <span className="circle-base"></span>
              <span className="arrow-line"></span>
            </button>

            <button
              className="nav-btn-pair next"
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <span className="circle-base"></span>
              <span className="arrow-line"></span>
            </button>
          </div>
        </div>

        <div className="projects-one__content">
          <div className="sec-title sec-title--border">
            <h6 className="sec-title__tagline">Dự án</h6>
            <h3 className="sec-title__title">
              Khám phá các dự án đã thực hiện
            </h3>
          </div>

          <p className="projects-one__text">
            Chúng tôi tự hào mang đến cho khách hàng những dự án ốp đá hoa cương
            không chỉ đẹp về mặt thẩm mỹ mà còn vững chắc về mặt kỹ thuật. Với
            hơn 20 năm kinh nghiệm trong ngành, chúng tôi đã thực hiện thành
            công hàng loạt các dự án từ những căn hộ cao cấp đến các trung tâm
            thương mại lớn, mỗi dự án đều phản ánh sự tận tâm và chuyên môn cao
            của đội ngũ thợ lành nghề của chúng tôi.
          </p>

          <div className="projects-one__bottom">
            {/* Desktop only */}
            <div className="navigation-wrapper d-none d-md-flex">
              <button
                className="nav-btn-pair prev"
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
              >
                <span className="circle-base"></span>
                <span className="arrow-line"></span>
              </button>

              <button
                className="nav-btn-pair next"
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
              >
                <span className="circle-base"></span>
                <span className="arrow-line"></span>
              </button>
            </div>
            <a
              href="/cong-trinh"
              className=" floens-btn floens-btn--border"
            >
              <span>Xem tất cả</span>
              <i>→</i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}