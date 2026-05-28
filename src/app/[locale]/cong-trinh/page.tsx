import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";

const filters = [
  "Tất cả",
  "Villa - Penhouse",
  "Khách sạn - Trung tâm thương mại",
  "Chung cư - Nhà phố",
  "Mẫu ốp đá cầu thang đẹp",
  "Mẫu ốp đá bếp đẹp",
  "Mẫu ốp nhà vệ sinh đẹp",
];

const works = [
  ["Modern Tiles fitting", "Tile Care", "work-1-1.jpg"],
  ["Indoor Court", "Tile Care", "work-1-2.jpg"],
  ["Awesome Outdoor Project", "Tile Care", "work-1-3.jpg"],
  ["Industrial Flooring", "Tile Care", "work-1-4.jpg"],
  ["Eco-Friendly-Flooring", "Tile Care", "work-1-5.jpg"],
  ["Laminate Flooring", "Tile Care", "work-1-6.jpg"],
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

export default async function WorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="page-wrapper">
      <Header />

      <PageHeader title="CÔNG TRÌNH" />

      <section className="work-page work-page--grid section-space-bottom">
        <div className="container-fluid">
          <div className="text-center">
            <ul className="list-unstyled post-filter gallery-one__filter__list">
              {filters.map((filter, index) => (
                <li key={filter} className={index === 0 ? "active" : ""}>
                  <span>{filter}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="container">
          <div className="row gutter-y-30">
            {works.map(([title, tagline, image]) => (
              <div className="col-lg-4 col-md-6" key={title}>
                <div className="work-card">
                  <div className="work-card__image">
                    <img
                      src={`/assets/images/works/${image}`}
                      alt={title}
                    />
                  </div>

                  <div className="work-card__content-show">
                    <div className="work-card__content-inner">
                      <h3 className="work-card__tagline">{tagline}</h3>
                      <h3 className="work-card__title">
                        <a href={`/${locale}/cong-trinh/${toSlug(title)}`}>
                          {title}
                        </a>
                      </h3>
                    </div>
                  </div>

                  <div className="work-card__content-hover">
                    <div className="work-card__content-inner">
                      <h3 className="work-card__tagline">{tagline}</h3>
                      <h3 className="work-card__title">
                        <a href={`/${locale}/cong-trinh/${toSlug(title)}`}>
                          {title}
                        </a>
                      </h3>
                    </div>

                    <a
                      href={`/${locale}/cong-trinh/${toSlug(title)}`}
                      className="work-card__link floens-btn"
                    >
                      <span className="icon-right-arrow" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}