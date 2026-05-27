const projects = [
  ["Thi công ốp đá nhà vệ sinh", "Khách sạn Golf Valley", "project-1-1.jpg"],
  ["Thi công tranh đá", "Biệt thự nhà Đoàn Di Băng", "project-1-2.jpg"],
  ["Thi công đá ốp bếp", "Nhà phố anh Đình Chương", "project-1-3.jpg"],
  ["Thi công đá ốp cầu thang", "Biệt thự Hằng Nga", "project-1-4.jpg"],
];

export function Projects() {
  return (
    <section className="projects-one">
      <div
        className="projects-one__bg"
        style={{
          backgroundImage: "url('/assets/images/backgrounds/projects-bg-1.png')",
        }}
      />

      <div className="projects-one__container container-fluid">
        <div className="row gutter-y-30">
          {projects.map(([tagline, title, image]) => (
            <div className="col-xl-3 col-lg-6 col-md-6" key={title}>
              <div className="project-card">
                <a href="/cong-trinh" className="project-card__image">
                  <img src={`/assets/images/works/${image}`} alt={title} />
                </a>

                <div className="project-card__content">
                  <h3 className="project-card__tagline">{tagline}</h3>

                  <div className="project-card__links">
                    <div className="project-card__links__inner">
                      <h3 className="project-card__title">
                        <a href="/cong-trinh">{title}</a>
                      </h3>

                      <a href="/cong-trinh" className="project-card__link floens-btn">
                        <span className="icon-right-arrow" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-7 projects-one__content-col">
            <div className="projects-one__content">
              <div className="sec-title sec-title--border">
                <h6 className="sec-title__tagline">Dự án</h6>
                <h3 className="sec-title__title">
                  Khám phá các dự án đã thực hiện
                </h3>
              </div>

              <p className="projects-one__text text-justify">
                Chúng tôi tự hào mang đến cho khách hàng những dự án ốp đá hoa
                cương không chỉ đẹp về mặt thẩm mỹ mà còn vững chắc về mặt kỹ
                thuật. Với hơn 25 năm kinh nghiệm trong ngành, chúng tôi đã
                thực hiện thành công hàng loạt các dự án từ những căn hộ cao
                cấp đến các trung tâm thương mại lớn.
              </p>

              <div className="projects-one__button">
                <a
                  href="/cong-trinh"
                  className="projects-one__btn floens-btn floens-btn--border"
                >
                  <span>Xem tất cả</span>
                  <i className="icon-right-arrow" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}