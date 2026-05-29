const posts = [
  ["Có nên dùng đá hoa cương để ốp lát mặt tiền?", "blog-1-1.jpg", "25/05", "2024"],
  ["Nội thất phòng bếp đẹp sử dụng đá Marble", "blog-1-2.jpg", "22/05", "2024"],
  ["Các mẫu hoa văn đá hoa cương đẹp", "blog-1-3.jpg", "08/05", "2024"],
];

export function News() {
  return (
    <section className="blog-one blog-one--home-two section-space-two">
      <div className="container">
        <div className="blog-one__top">
          <div className="row gutter-y-50 align-items-center">
            <div className="col-lg-8">
              <div className="sec-title">
                <h6 className="sec-title__tagline">Tin tức</h6>
                <h3 className="sec-title__title">
                  Cập nhật tin tức
                  <br />& sự kiện nổi bật
                </h3>
              </div>

            </div>

            <div className="col-lg-4">
              <div className="blog-one__top__button">
                <a href="/tin-tuc" className="floens-btn floens-btn--border">
                  <span>Xem tất cả</span>
                  <i>→</i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="row gutter-y-30">
          {posts.map(([title, image, day, year]) => (
            <div className="col-md-6 col-lg-4" key={title}>
              <div className="blog-card blog-card--two">
                <div className="blog-card__content">
                  <h3 className="blog-card__title">
                    <a href="/tin-tuc">{title}</a>
                  </h3>
                </div>

                <div className="blog-card__image">
                  <img src={`/assets/images/blog/${image}`} alt={title} />
                  <a href="/tin-tuc" className="blog-card__image__link">
                    <span className="sr-only">{title}</span>
                  </a>
                </div>

                <div className="blog-card__date">
                  <span className="blog-card__date__day">{day}</span>
                  <span className="blog-card__date__month">{year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}