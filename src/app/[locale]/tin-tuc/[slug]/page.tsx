import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";

const categories = [
  ["Tin nội bộ", 9],
  ["Xu hướng thiết kế", 12],
  ["Thị trường ngành đá tự nhiên", 10],
];

const latestPosts = [
  ["45+ Mẫu đá ốp cầu thang đẹp 2023", "15/06/2024", "lp-1-1.jpg"],
  ["5 mẹo cải tạo nhà bếp hợp xu hướng", "12/06/2024", "lp-1-2.jpg"],
  ["Kinh Nghiệm Chọn Đá Mặt Bếp Đẹp - Rẻ - Bền", "10/06/2024", "lp-1-3.jpg"],
];

function toSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="page-wrapper">
      <Header />
      <PageHeader title=""   bgImage = "/assets/images/backgrounds/PACSTONE-TINTUCSUKIEN-header.png"/>


      <section className="blog-page blog-page--sidebar section-space">
        <div className="container">
          <div className="row gutter-y-60">
            <div className="col-lg-4">
              <div className="sidebar">
                <aside className="widget-area">
                  <div className="sidebar__form sidebar__single">
                    <h4 className="sidebar__title sidebar__form__title">
                      Tìm kiếm
                    </h4>

                    <form action="#" className="sidebar__search">
                      <input type="text" placeholder="Từ khóa" />
                      <button type="submit" aria-label="search submit">
                        <span className="icon-search" />
                      </button>
                    </form>
                  </div>

                  <div className="sidebar__categories-wrapper sidebar__single">
                    <h4 className="sidebar__title">Danh mục</h4>

                    <ul className="sidebar__categories list-unstyled">
                      {categories.map(([name, count]) => (
                        <li key={name}>
                          <a href={`/${locale}/tin-tuc`}>
                            {name} <span>({count})</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="sidebar__posts-wrapper sidebar__single">
                    <h4 className="sidebar__title sidebar__posts-title">
                      Bài viết nổi bật
                    </h4>

                    <ul className="sidebar__posts list-unstyled">
                      {latestPosts.map(([title, date, image]) => (
                        <li className="sidebar__posts__item" key={title}>
                          <div className="sidebar__posts__image">
                            <img
                              src={`/assets/images/blog/${image}`}
                              alt={title}
                            />
                          </div>

                          <div className="sidebar__posts__content">
                            <p className="sidebar__posts__meta">
                              <a href={`/${locale}/tin-tuc/${toSlug(title)}`}>
                                {date}
                              </a>
                            </p>

                            <h4 className="sidebar__posts__title">
                              <a href={`/${locale}/tin-tuc/${toSlug(title)}`}>
                                {title}
                              </a>
                            </h4>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="sidebar__tags-wrapper sidebar__single">
                    <h4 className="sidebar__title">Tags</h4>

                    <div className="sidebar__tags">
                      <a href={`/${locale}/tin-tuc`}>Đá marble</a>
                      <a href={`/${locale}/tin-tuc`}>Đá phong thủy</a>
                      <a href={`/${locale}/tin-tuc`}>Thiết kế hoa văn đá</a>
                      <a href={`/${locale}/tin-tuc`}>Thị trường đá</a>
                    </div>
                  </div>
                </aside>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="blog-details">
                <div className="blog-card">
                  <h3 className="blog-card__title">
                    Có nên chọn đá hoa cương ốp mặt tiền không?
                  </h3>

                  <div className="blog-card__image">
                    <img
                      src="/assets/images/blog/blog-1-1.jpg"
                      alt="Có nên chọn đá hoa cương ốp mặt tiền không?"
                    />

                    <div className="blog-card__date">
                      <span className="blog-card__date__day">25/05</span>
                      <span className="blog-card__date__month">2024</span>
                    </div>
                  </div>

                  <div className="blog-card__content">
                    <p className="blog-card__text blog-card__text--one">
                      Đá hoa cương ốp mặt tiền đang là lựa chọn hàng đầu của
                      nhiều gia chủ. Dùng đá hoa cương ốp mặt tiền nhằm mang lại
                      sự sang trọng cũng như độ bền cho các công trình. Ngày
                      nay, người ta thường lựa chọn đá hoa cương ốp mặt tiền
                      thay vì những loại gạch được bán thông thường.
                    </p>

                    <h3 className="blog-card__title">
                      Đá hoa cương ốp mặt tiền đảm bảo được độ bền cao
                    </h3>

                    <p className="blog-card__text blog-card__text--one">
                      Thông thường mặt tiền nhà hay tiếp xúc với nắng mưa, các
                      yếu tố tác động thời tiết bên ngoài và của con người nên
                      khi ốp mặt tiền chúng ta cần có một vật liệu đủ bền và
                      chống chịu được các tác động này.
                      <br />
                      <br />
                      Đá hoa cương có nhiều ưu điểm như khả năng chống chịu cao
                      với tác động môi trường bên ngoài, chống thấm tốt, bề mặt
                      cứng, không phai màu, chống trầy xước và chịu được va đập
                      mạnh.
                    </p>

                    <h3 className="blog-card__title">
                      Giá trị thẩm mỹ cao, sang trọng
                    </h3>

                    <p className="blog-card__text blog-card__text--one">
                      Việc ốp đá mặt tiền là cách tốt nhất để thể hiện tính
                      thẩm mỹ của gia chủ trong trang trí nhà cửa. Đá hoa cương
                      có khả năng thay đổi diện mạo ngôi nhà một cách ấn tượng.
                    </p>

                    <div
                      className="blog-details__inner__image"
                      style={{ marginBottom: 15 }}
                    >
                      <img
                        src="/assets/images/blog/blog-d-1-1.jpg"
                        alt="blog details"
                      />
                    </div>

                    <p className="blog-card__text blog-card__text--one">
                      Việc sử dụng đá hoa cương giúp ngôi nhà trở nên thu hút,
                      độc đáo và sang trọng hơn. Đá tự nhiên còn giúp nâng tầm
                      giá trị của công trình.
                    </p>

                    <h3 className="blog-card__title">Chi phí bảo dưỡng thấp</h3>

                    <p className="blog-card__text blog-card__text--one">
                      Đá hoa cương ốp mặt tiền không chỉ bền bỉ mà còn dễ vệ
                      sinh, giúp tiết kiệm chi phí bảo dưỡng cho gia chủ trong
                      quá trình sử dụng.
                    </p>

                    <h3 className="blog-card__title">
                      Mang theo ý nghĩa phong thuỷ, tài lộc
                    </h3>

                    <p className="blog-card__text blog-card__text--two">
                      Việc lựa chọn màu sắc đá ốp theo ngũ hành có ý nghĩa quan
                      trọng trong phong thủy. Sử dụng đá hoa cương phù hợp có
                      thể góp phần thu hút tài lộc và thịnh vượng cho gia chủ.
                    </p>

                    <div className="blog-details__inner">
                      <div className="row gutter-y-30">
                        <div className="col-md-6">
                          <div className="blog-details__inner__image">
                            <img
                              src="/assets/images/products/product-1-1.jpg"
                              alt="blog details"
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="blog-details__inner__image">
                            <img
                              src="/assets/images/products/product-1-2.jpg"
                              alt="blog details"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="blog-details__meta">
                  <div className="blog-details__tags">
                    <h4 className="blog-details__meta__title">Tags:</h4>

                    <div className="blog-details__tags__box">
                      <a href={`/${locale}/tin-tuc`}>Đá phong thủy</a>
                      <a href={`/${locale}/tin-tuc`}>Đá bếp</a>
                      <a href={`/${locale}/tin-tuc`}>Đá marble</a>
                    </div>
                  </div>

                  <div className="blog-details__social">
                    <h4 className="blog-details__meta__title">Chia sẻ:</h4>

                    <div className="details-social">
                      <a href="https://facebook.com">
                        <i className="icon-facebook" />
                      </a>
                      <a href="https://twitter.com">
                        <i className="icon-twitter" />
                      </a>
                      <a href="https://linkedin.com">
                        <i className="icon-linkedin" />
                      </a>
                      <a href="https://youtube.com">
                        <i className="icon-youtube" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}