export function About() {
  return (
    <section className="about-two section-space">
      <div
        className="about-two__bg"
        style={{
          backgroundImage: "url('/assets/images/backgrounds/bg-about.png')",
        }}
      />

      <div className="container">
        <div className="row gutter-y-60">
          <div className="col-lg-6">
            <div className="about-two__image">
              <div className="about-two__image__inner">
                <img
                  src="/assets/images/about/about-2-3.jpg"
                  alt="about"
                  className="about-two__image__one"
                />

                <div className="about-two__image__inner__inner">
                  <img
                    src="/assets/images/about/about-2-2.jpg"
                    alt="about"
                    className="about-two__image__two"
                  />
                </div>

                <div className="experience about-two__experience">
                  <div className="experience__inner">
                    <h3
                      className="experience__year"
                      style={{
                        backgroundImage:
                          "url('/assets/images/shapes/reliable-shape-1-1.png')",
                      }}
                    >
                      25
                      <br />
                      <span style={{ fontSize: 22 }}>năm</span>
                    </h3>
                    <p className="experience__text">kinh nghiệm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="about-two__content">
              <div className="sec-title sec-title--border">
                <h6 className="sec-title__tagline">Giới thiệu</h6>
                <h3 className="sec-title__title">
                  CÔNG TY CỔ PHẦN ĐÁ QUỐC TẾ PHÚC NAM
                </h3>
              </div>

              <div className="about-two__content__text">
                <h5 className="about-two__text-title">
                  Chúng tôi mang đến đẳng cấp công trình Việt.
                </h5>

                <p className="about-two__text">
                  Công ty Cổ phần Đá quốc tế Phúc Nam là một trong những nhà
                  cung cấp hàng đầu tại Việt Nam về các sản phẩm và giải pháp
                  ốp lát đá cao cấp được nhập khẩu từ các quốc gia có nền công
                  nghiệp đá phát triển như Italy, Tây Ban Nha, và Brazil.
                  <br />
                  <br />
                  Đặc biệt, với đội ngũ thiết kế và thi công chuyên nghiệp,
                  Phúc Nam cam kết mang đến sự hoàn hảo và sang trọng cho mọi
                  không gian sống.
                </p>
              </div>

              <div className="about-two__list">
                <div className="about-two__list__left">
                  <div className="about-two__list__item">
                    <span className="icon-tick" />
                    Chất lượng vượt trội
                  </div>
                  <div className="about-two__list__item">
                    <span className="icon-tick" />
                    Thiết kế độc đáo
                  </div>
                </div>

                <div className="about-two__list__right">
                  <div className="about-two__list__item">
                    <span className="icon-tick" />
                    Thi công chuyên nghiệp
                  </div>
                  <div className="about-two__list__item">
                    <span className="icon-tick" />
                    Bảo hành tận tâm
                  </div>
                </div>
              </div>

              <div className="about-two__button">
                <a href="/gioi-thieu" className="floens-btn">
                  <span>Xem thêm</span>
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