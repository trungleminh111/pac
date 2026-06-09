import Link from "next/link";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import styles from "./Contruct.module.css";
import Banner from "@/components/site/Banner/Banner";
const filters = [
  "Tất cả",
  "Villa - Penhouse",
  "Khách sạn - Trung tâm thương mại",
  "Chung cư - Nhà phố",
  "Mẫu BẾP ốp đá đẹp",
  "Mẫu cầu thang ốp đá đẹp",
  "Mẫu nhà vệ sinh ốp đá đẹp",
  "Mẫu sàn thang máy ốp đá đẹp",
];

const works = [
  ["Modern Tiles fitting", "Tile Care", "project-13.png", "Villa - Penhouse"],
  ["Indoor Court", "Tile Care", "project-12.png", "Khách sạn - Trung tâm thương mại"],
  ["Awesome Outdoor Project", "Tile Care", "project-9.jpg", "Chung cư - Nhà phố"],
  ["Industrial Flooring", "Tile Care", "project-5.png", "Mẫu BẾP ốp đá đẹp"],
  ["Eco-Friendly-Flooring", "Tile Care", "project-3.png", "Mẫu cầu thang ốp đá đẹp"],
  ["Laminate Flooring", "Tile Care", "project-11.png", "Mẫu nhà vệ sinh ốp đá đẹp"],
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

function pageHref(locale: "vi" | "en", category?: string, page?: number) {
  const base = locale === "vi" ? "/vi/cong-trinh" : "/en/projects";
  const params = new URLSearchParams();

  if (category && category !== "Tất cả") {
    params.set("category", category);
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `${base}?${query}` : base;
}

export default async function WorksPage({
  params,
  searchParams,
}: {
  params: {
    locale: "vi" | "en";
  };
  searchParams?: {
    category?: string;
    page?: string;
  };
}) {
  const locale = params.locale === "en" ? "en" : "vi";

  const activeFilter = searchParams?.category || "Tất cả";
  const currentPage = Number(searchParams?.page || 1);
  const itemsPerPage = 6;

  const filteredWorks =
    activeFilter === "Tất cả"
      ? works
      : works.filter((work) => work[3] === activeFilter);

  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage);

  const paginatedWorks = filteredWorks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="page-wrapper">
      <Header locale={locale} />

      {/* <PageHeader
        title=""
        bgImage="/assets/images/backgrounds/PACSTONE-CONGTRINH-header.png"
      /> */}
      <Banner
        title="CÔNG TRÌNH"
        backgroundImg="/assets/images/backgrounds/contruct-banner.webp"
        row={2}
        col={1}
      />
      <section className="work-page work-page--grid section-space-bottom">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12">
              <ul className="filter-project">
                {filters.map((filter) => (
                  <li
                    key={filter}
                    className={`filter-grid-item ${
                      activeFilter === filter ? "active" : ""
                    } ${filter.length > 18 ? "is-long" : "is-short"}`}
                  >
                    <Link
                      href={pageHref(locale, filter)}
                      className="filter-grid-text"
                    >
                      {filter}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="row gutter-y-30">
            {paginatedWorks.map(([title, tagline, image]) => {
              const href =
                locale === "vi"
                  ? `/vi/cong-trinh/${toSlug(title)}`
                  : `/en/projects/${toSlug(title)}`;

              return (
                <div className="col-lg-4 col-md-6 col-12" key={title}>
                  <div className="work-card h-100">
                    <div className="work-card__image">
                      <img src={`/assets/images/works/${image}`} alt={title} />
                    </div>

                    <div className="work-card__content-show">
                      <div className="work-card__content-inner">
                        <h3 className="work-card__tagline">{tagline}</h3>
                        <h3 className="work-card__title">
                          <Link href={href}>{title}</Link>
                        </h3>
                      </div>
                    </div>

                    <div className="work-card__content-hover">
                      <div className="work-card__content-inner">
                        <h3 className="work-card__tagline">{tagline}</h3>
                        <h3 className="work-card__title">
                          <Link href={href}>{title}</Link>
                        </h3>
                      </div>

                      <Link href={href} className="work-card__link floens-btn">
                        <span className={styles.arrowRight} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredWorks.length > itemsPerPage && (
            <div className="work-pagination">
              {currentPage > 1 && (
                <Link
                  href={pageHref(locale, activeFilter, currentPage - 1)}
                  className="work-pagination__nav work-pagination__prev"
                >
                  ‹
                </Link>
              )}

              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;

                return (
                  <Link
                    key={page}
                    href={pageHref(locale, activeFilter, page)}
                    className={`work-pagination__page ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    {page.toString().padStart(2, "0")}
                  </Link>
                );
              })}

              {currentPage < totalPages && (
                <Link
                  href={pageHref(locale, activeFilter, currentPage + 1)}
                  className="work-pagination__nav work-pagination__next"
                >
                  ›
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}