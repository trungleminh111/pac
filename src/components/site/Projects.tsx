"use client";

import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

const projects = [
  ["project-1-1.jpg", "project-1-2.jpg"],
  ["project-1-3.jpg", "project-1-4.jpg"],
];

export function Projects() {
  return (
    <section className="projects-one  pt-sm-3  pt-md-3  pt-lg-5   pt-xl-5   pb-xxl-3 pb-sm-3  pb-md-3  pb-lg-5   pb-xl-5   pb-xxl-3  ">
      <div className="projects-one__container">
        <div className="projects-one__left projects-one__col projects-one__col--left">
          <Swiper
            modules={[Navigation, Autoplay]}
            loop
            speed={700}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            navigation={{
              prevEl: ".project-prev",
              nextEl: ".project-next",
            }}
            className="projects-one__slider"
          >
            {projects.map(([image1, image2]) => (
              <SwiperSlide key={image1}>
                <div className="projects-one__images">
                  <img src={`/assets/images/works/${image1}`} alt="" />
                  <img src={`/assets/images/works/${image2}`} alt="" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Mobile only */}
          <div className="navigation-wrapper justify-content-center d-flex d-md-none pb-2 pt-2">
            <button className="nav-btn-pair prev project-prev" type="button">
              <span className="circle-base"></span>
              <span className="arrow-line"></span>
            </button>

            <button className="nav-btn-pair next project-next" type="button">
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
              <button className="nav-btn-pair prev project-prev" type="button">
                <span className="circle-base"></span>
                <span className="arrow-line"></span>
              </button>

              <button className="nav-btn-pair next project-next" type="button">
                <span className="circle-base"></span>
                <span className="arrow-line"></span>
              </button>
            </div>

            <a
              href="/cong-trinh"
              className="project-btn floens-btn floens-btn--border"
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