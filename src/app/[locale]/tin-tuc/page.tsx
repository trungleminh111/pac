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

const posts = [
  [
    "Có nên chọn đá hoa cương ốp mặt tiền không?",
    "Đá hoa cương ốp mặt tiền đang là lựa chọn hàng đầu của nhiều gia chủ. Dùng đá hoa cương ốp mặt tiền nhằm mang lại sự sang trọng cũng như độ bền cho các công trình.",
    "25/05",
    "2024",
    "blog-1-1.jpg",
  ],
  [
    "Nội Thất Phòng Bếp Đẹp Sử Dụng Đá Marble",
    "Thiết kế nội thất nhà bếp với đá marble mang đến vẻ đẹp sang trọng, tinh tế với những đường vân đá tự nhiên.",
    "22/05",
    "2024",
    "blog-1-2.jpg",
  ],
  [
    "Các Mẫu Hoa Văn Đá Hoa Cương Đẹp",
    "Đá hoa văn đề cao vẻ đẹp, đường vân sáng và họa tiết tinh xảo mang đến sự sang trọng đẳng cấp.",
    "08/05",
    "2024",
    "blog-1-3.jpg",
  ],
  [
    "Mệnh Kim Chọn Tranh Đá Màu Gì Để Phát Tài, May Mắn?",
    "Mệnh Kim tượng trưng cho kim loại, phù hợp với những gam màu và chất liệu đá mang ý nghĩa phong thủy tốt.",
    "09/04",
    "2024",
    "blog-1-4.jpg",
  ],
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

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="page-wrapper">
      <Header />

      <PageHeader title="TIN TỨC" />

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
              <div className="row gutter-y-30">
                {[...posts, ...posts].map(([title, summary, day, year, image], index) => (
                  <div className="col-xl-6 col-lg-12 col-md-6" key={`${title}-${index}`}>
                    <div className="blog-card">
                      <div className="blog-card__image">
                        <img
                          src={`/assets/images/blog/${image}`}
                          alt={title}
                        />
                        <a
                          href={`/${locale}/tin-tuc/${toSlug(title)}`}
                          className="blog-card__image__link"
                        >
                          <span className="sr-only">{title}</span>
                        </a>
                      </div>

                      <div className="blog-card__date">
                        <span className="blog-card__date__day">{day}</span>
                        <span className="blog-card__date__month">{year}</span>
                      </div>

                      <div className="blog-card__content">
                        <h3 className="blog-card__title">
                          <a href={`/${locale}/tin-tuc/${toSlug(title)}`}>
                            {title}
                          </a>
                        </h3>

                        <p className="blog-card__text blog-card__summary">
                          {summary}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="col-12">
                  <ul className="post-pagination">
                    <li>
                      <a href="#">
                        <span className="icon-arrow-left" />
                      </a>
                    </li>
                    <li className="active">
                      <a href="#">01</a>
                    </li>
                    <li>
                      <a href="#">02</a>
                    </li>
                    <li>
                      <a href="#">03</a>
                    </li>
                    <li>
                      <a href="#">
                        <span className="icon-arrow-right" />
                      </a>
                    </li>
                  </ul>
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