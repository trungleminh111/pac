"use client";

import { use, useState } from "react";
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
  "Mẫu sàn thang máy ốp đá đẹp",
];

const works = [
  ["Modern Tiles fitting", "Tile Care", "project-13.png", "Villa - Penhouse"],
  ["Indoor Court", "Tile Care", "project-12.png", "Khách sạn - Trung tâm thương mại"],
  ["Awesome Outdoor Project", "Tile Care", "project-9.png", "Chung cư - Nhà phố"],
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

export default function WorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
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
      <Header />

      <PageHeader
        title=""
        bgImage="/assets/images/backgrounds/PACSTONE-CONGTRINH-header.png"
      />

      <section className="work-page work-page--grid section-space-bottom">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12">
              <ul className="filter-project">
                {filters.map((filter) => (
                  <li
                    key={filter}
                    onClick={() => {
                      setActiveFilter(filter);
                      setCurrentPage(1);
                    }}
                    className={`filter-grid-item ${activeFilter === filter ? "active" : ""
                      } ${filter.length > 18 ? "is-long" : "is-short"}`}
                  >
                    <span className="filter-grid-text">{filter}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="row gutter-y-30">
            {paginatedWorks.map(([title, tagline, image]) => (
              <div className="col-lg-4 col-md-6 col-12" key={title}>
                <div className="work-card h-100">
                  <div className="work-card__image">
                    <img src={`/assets/images/works/${image}`} alt={title} />
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
          {filteredWorks.length > itemsPerPage && (
            <div className="work-pagination">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="work-pagination__btn"
              >
                Prev
              </button>

              <span className="work-pagination__text">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="work-pagination__btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}