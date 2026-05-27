const slides = ["slider1.png", "slider2.jpg", "slider3.jpg"];

export function Hero() {
  return (
    <section className="main-slider-two hero-slider">
      <div className="main-slider-two__carousel">
        {slides.map((image) => (
          <div className="main-slider-two__item" key={image}>
            <div
              className="main-slider-two__bg"
              style={{
                backgroundImage: `url('/assets/images/slider/${image}')`,
              }}
            />

            <div className="main-slider-two__wrapper container">
              <div className="main-slider-two__left">
                <div className="main-slider-two__content">
                  <p className="main-slider-two__tagline">
                    Chào mừng đến với <br />
                    <strong style={{ fontSize: 20 }}>
                      Công ty cổ phần đá quốc tế Phúc Nam
                    </strong>
                  </p>

                  <h2 className="main-slider-two__title">
                    Nhà cung cấp giải pháp thiết kế,
                    <br />
                    thi công đá ốp lát cao cấp
                    <br />
                    hàng đầu Việt Nam
                  </h2>

                  <a href="/gioi-thieu" className="main-slider-two__btn floens-btn">
                    <span>Tìm hiểu thêm</span>
                    <i className="icon-right-arrow" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}