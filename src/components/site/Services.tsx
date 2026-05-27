const services = [
  ["Thi công đá ốp mặt tiền", "service1.jpg", "icon-tile"],
  ["Thi công đá ốp cột", "service2.jpg", "icon-parquet"],
  ["Thi công đá ốp cầu thang", "service3.jpg", "icon-tiles"],
  ["Thi công đá ốp bếp", "service4.jpg", "icon-carpet"],
  ["Thi công tranh đá", "service5.jpg", "icon-wood-board"],
  ["Thiết kế hoa văn đá", "service6.jpg", "icon-stones"],
];

export function Services() {
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
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row gutter-y-30">
          {services.map(([title, image, icon]) => (
            <div className="col-xl-4 col-lg-4 col-md-6" key={title}>
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
                    <a href="/dich-vu" className="service-card-two__link floens-btn">
                      <span>Xem chi tiết</span>
                      <i className="icon-right-arrow" />
                    </a>
                    <span className={`service-card-two__icon ${icon}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}