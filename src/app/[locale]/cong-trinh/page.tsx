import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";

const filters = [
  "Tất cả",
  "Villa - Penhouse",
  "Khách sạn - Trung tâm thương mại",
  "Chung cư - Nhà phố",
  "Mẫu BẾP ốp đá đẹp",
  "Mẫu cầu thang ốp đá đẹp",
  "Mẫu nhà vệ sinh ốp đá đẹp",
  "Mẫu sàn thang máy ốp đá đẹp"
];

const works = [
  ["Modern Tiles fitting", "Tile Care", "project-13.png"],
  ["Indoor Court", "Tile Care", "project-12.png"],
  ["Awesome Outdoor Project", "Tile Care", "project-9.png"],
  ["Industrial Flooring", "Tile Care", "project-5.png"],
  ["Eco-Friendly-Flooring", "Tile Care", "project-3.png"],
  ["Laminate Flooring", "Tile Care", "project-11.png"],
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

      <PageHeader title="" bgImage="/assets/images/backgrounds/PACSTONE-CONGTRINH-header.png" />


      <section className="work-page work-page--grid section-space-bottom">
  <div className="container">
    
    {/* KHỐI BỘ LỌC DANH MỤC: Bỏ các thẻ container bọc lồng dư thừa */}
    <div className="row mb-4">
      <div className="col-12">
        <ul className="gallery-filter-grid">
          {filters.map((filter, index) => (
            <li
              key={filter}
              className={`filter-grid-item ${index === 0 ? "active" : ""}`}
            >
              <span className="filter-grid-text">{filter}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* KHỐI DANH SÁCH SẢN PHẨM / CÔNG TRÌNH */}
    <div className="row gutter-y-30">
      {works.map(([title, tagline, image]) => (
        <div className="col-lg-4 col-md-6 col-12" key={title}>
          <div className="work-card h-100">
            
            {/* Ảnh bọc ngoài ép chiều cao cố định chống móp méo */}
            <div className="work-card__image">
              <img
                src={`/assets/images/works/${image}`}
                alt={title}
              />
            </div>

            {/* Nội dung trạng thái bình thường */}
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

            {/* Nội dung trạng thái khi di chuột vào (Hover) */}
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