import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { getProductsPage } from "@/server/products/product.query";
import type { Locale } from "@/server/products/product.type";
import { FaStar, FaCartShopping } from "react-icons/fa6";
import { BsSearch } from "react-icons/bs";
import "@/styles/sanpham.css";

function productListHref(locale: Locale) {
  return locale === "vi" ? "/vi/san-pham" : "/en/products";
}

function productDetailHref(locale: Locale, slug: string) {
  return locale === "vi" ? `/vi/san-pham/${slug}` : `/en/products/${slug}`;
}

function contactHref(locale: Locale) {
  return locale === "vi" ? "/vi/lien-he" : "/en/contact";
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: {
    locale: Locale;
  };
  searchParams?: {
    category?: string;
    page?: string;
  };
}) {
  const locale = params.locale;
  const products = await getProductsPage(locale);

  const categories = Array.from(
    new Set(products.map((product) => product.categoryName).filter(Boolean))
  );

  const activeCategory = searchParams?.category || categories[0] || "";
  const currentPage = Number(searchParams?.page || 1);
  const itemsPerPage = 8;

  const filteredProducts = activeCategory
    ? products.filter((product) => product.categoryName === activeCategory)
    : products;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="page-wrapper">
      <Header locale={locale} />

      <PageHeader
        title={locale === "vi" ? "Sản phẩm" : "Products"}
        bgImage="/assets/images/backgrounds/PACSTONE-SANPHAM-header.png"
      />

      <section className="product-page product-page--left section-space-bottom">
        <div className="container">
          <div className="row align-items-stretch gy-4 mb-5">
            <div className="col-xl-4 col-md-12 col-12">
              <div
                className="product__search-box product__sidebar__item h-100"
                style={{ margin: 0, display: "flex" }}
              >
                <form
                  action={productListHref(locale)}
                  className="product__search w-100"
                  style={{ display: "flex", position: "relative" }}
                >
                  <input
                    type="text"
                    name="q"
                    placeholder={
                      locale === "vi" ? "Tìm sản phẩm" : "Search products"
                    }
                    style={{ width: "100%", height: "100%", minHeight: "50px" }}
                  />

                  <button
                    type="submit"
                    aria-label="search submit"
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                    }}
                  >
                    <span className="icon-search">
                      <BsSearch />
                    </span>
                  </button>
                </form>
              </div>
            </div>

            <div className="col-xl-8 col-md-12 col-12">
              <div
                className="product__categories"
                style={{ margin: 0, height: "100%" }}
              >
                <ul className="list-unstyled">
                  {categories.map((category) => {
                    const href = `${productListHref(
                      locale
                    )}?category=${encodeURIComponent(category)}`;

                    return (
                      <li
                        key={category}
                        className={activeCategory === category ? "active" : ""}
                      >
                        <Link href={href}>
                          <button type="button" data-text={category}>
                            <span>{category}</span>
                          </button>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          <hr
            className="mb-5"
            style={{ borderTop: "1px solid #e1dad5", opacity: 0.5 }}
          />

          <div className="row">
            <div className="col-xl-12 col-lg-12">
              <div className="row gutter-y-30">
                {paginatedProducts.map((product) => (
                  <div
                    className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12"
                    key={product.id}
                  >
                    <div className="product__item">
                      <div className="product__item__image">
                        <Link href={productDetailHref(locale, product.slug)}>
                          <img
                            src={product.image}
                            alt={product.title}
                            style={{ height: "180px" }}
                          />
                        </Link>
                      </div>

                      <div className="product__item__content">
                        <div className="floens-ratings product__item__ratings">
                          <div className="rating-stars">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <FaStar key={index} />
                            ))}
                          </div>
                        </div>

                        <h4 className="product__item__title">
                          <Link href={productDetailHref(locale, product.slug)}>
                            {product.title}
                          </Link>
                        </h4>

                        <div className="product__item__price">
                          {product.price || (locale === "vi" ? "Liên hệ" : "Contact")}
                        </div>

                        <Link
                          href={contactHref(locale)}
                          className="floens-btn product__item__link"
                        >
                          <span>{locale === "vi" ? "Liên hệ" : "Contact"}</span>
                          <FaCartShopping className="product-cart-icon" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredProducts.length > itemsPerPage && (
                  <div className="col-12 mt-5">
                    <div className="product-pagination">
                      {currentPage > 1 && (
                        <Link
                          className="prev-btn"
                          href={`${productListHref(
                            locale
                          )}?category=${encodeURIComponent(
                            activeCategory
                          )}&page=${currentPage - 1}`}
                        >
                          ‹
                        </Link>
                      )}

                      {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;

                        return (
                          <Link
                            key={page}
                            className={`page-number ${
                              currentPage === page ? "active" : ""
                            }`}
                            href={`${productListHref(
                              locale
                            )}?category=${encodeURIComponent(
                              activeCategory
                            )}&page=${page}`}
                          >
                            {page.toString().padStart(2, "0")}
                          </Link>
                        );
                      })}

                      {currentPage < totalPages && (
                        <Link
                          className="next-btn"
                          href={`${productListHref(
                            locale
                          )}?category=${encodeURIComponent(
                            activeCategory
                          )}&page=${currentPage + 1}`}
                        >
                          ›
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {filteredProducts.length === 0 && (
                  <div className="col-12">
                    <p className="text-center">
                      {locale === "vi"
                        ? "Chưa có sản phẩm nào."
                        : "No products found."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}