import Link from "next/link";
import { Locale } from "@prisma/client";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { getProjectListingData } from "@/server/project/project.query";
import styles from "./Contruct.module.css";

function pageHref(locale: Locale, categorySlug?: string, page?: number) {
  const base = locale === Locale.vi ? "/vi/cong-trinh" : "/en/projects";
  const params = new URLSearchParams();

  if (categorySlug && categorySlug !== "all") {
    params.set("category", categorySlug);
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `${base}?${query}` : base;
}

function projectHref(locale: Locale, slug: string) {
  return locale === Locale.vi
    ? `/vi/cong-trinh/${slug}`
    : `/en/projects/${slug}`;
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
  const locale = params.locale === "en" ? Locale.en : Locale.vi;

  const { filters, works } = await getProjectListingData(locale);

  const activeFilter = searchParams?.category || "all";
  const currentPage = Number(searchParams?.page || 1);
  const itemsPerPage = 6;

  const filteredWorks =
    activeFilter === "all"
      ? works
      : works.filter((work) => work.categorySlug === activeFilter);

  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage);

  const paginatedWorks = filteredWorks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="page-wrapper">
      <Header locale={locale} />

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
                    key={filter.slug}
                    className={`filter-grid-item ${
                      activeFilter === filter.slug ? "active" : ""
                    } ${filter.label.length > 18 ? "is-long" : "is-short"}`}
                  >
                    <Link
                      href={pageHref(locale, filter.slug)}
                      className="filter-grid-text"
                    >
                      {filter.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="row gutter-y-30">
            {paginatedWorks.map((work) => {
              const href = projectHref(locale, work.slug);

              return (
                <div className="col-lg-4 col-md-6 col-12" key={work.slug}>
                  <div className="work-card h-100">
                    <div className="work-card__image">
                      <img src={work.image} alt={work.title} />
                    </div>

                    <div className="work-card__content-show">
                      <div className="work-card__content-inner">
                        <h3 className="work-card__tagline">{work.type}</h3>
                        <h3 className="work-card__title">
                          <Link href={href}>{work.title}</Link>
                        </h3>
                      </div>
                    </div>

                    <div className="work-card__content-hover">
                      <div className="work-card__content-inner">
                        <h3 className="work-card__tagline">{work.type}</h3>
                        <h3 className="work-card__title">
                          <Link href={href}>{work.title}</Link>
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