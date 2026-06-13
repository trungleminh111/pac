import Link from "next/link";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { getProductsPage, getProductCategories } from "@/server/products/product.query";
import type { Locale } from "@/server/products/product.type";
import { FaStar, FaCartShopping } from "react-icons/fa6";
import { BsSearch } from "react-icons/bs";
import "@/styles/sanpham.css";
import styles from "./Product.module.css";
import Banner from "@/components/site/Banner/Banner";
import { AddToCartButton } from "@/components/site/AddToCartButton";
import { ProductFilter } from "@/components/site/ProductFilter";

function productListHref(locale: Locale) {
  return locale === "vi" ? "/vi/san-pham" : "/en/products";
}

function productDetailHref(locale: Locale, slug: string) {
  return locale === "vi" ? `/vi/san-pham/${slug}` : `/en/products/${slug}`;
}

function contactHref(locale: Locale) {
  return locale === "vi" ? "/vi/lien-he" : "/en/contact";
}

function buildHref(
  locale: Locale,
  params: {
    category?: string;
    q?: string;
    page?: number;
  }
) {
  const search = new URLSearchParams();

  if (params.category) search.set("category", params.category);
  if (params.q) search.set("q", params.q);
  if (params.page && params.page > 1) search.set("page", String(params.page));

  const query = search.toString();

  return query
    ? `${productListHref(locale)}?${query}`
    : productListHref(locale);
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
    q?: string;
    page?: string;
  };
}) {
  const locale = params.locale;
  const productsPage = await getProductsPage({
    locale,
    page: 1,
    pageSize: 999,
  });
  const products = productsPage.products;
  const categories = await getProductCategories(locale);

  const activeCategory = searchParams?.category || categories[0]?.slug || "";
  const q = searchParams?.q?.trim() || "";
  const currentPage = Number(searchParams?.page || 1);
  const itemsPerPage = 12;

  const filteredProducts = products.filter((product) => {
    const matchCategory = activeCategory
      ? product.categorySlug === activeCategory
      : true;

    const matchSearch = q
      ? product.title.toLowerCase().includes(q.toLowerCase())
      : true;

    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="page-wrapper">
      <Header locale={locale} />

      {/* <PageHeader
        title=""
        bgImage="/assets/images/backgrounds/PACSTONE-SANPHAM-header.png"
      /> */}
      <Banner
        title="SẢN PHẨM"
        backgroundImg="/assets/images/backgrounds/product-banner.webp"
        row={2}
        col={3}
      />

      <section className="product-page product-page--left section-space-bottom">
        <div className="container">
          <ProductFilter
            locale={locale}
            categories={categories}
            activeCategory={activeCategory}
            q={q}
          />
          <hr
            className="mb-5"
            style={{ borderTop: "1px solid #e1dad5", opacity: 0.5 }}
          />

          <div className="row d-none d-md-block">
            <div className="col-xl-12 col-lg-12">
              <div className="row gutter-y-30">
                {paginatedProducts.map((product) => (
                  <div
                    className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12"
                    key={product.id}
                  >
                    <div className="product__item">
                      <div className="product__item__image">
                        <Link href={productDetailHref(locale, product.slug)}
                        >
                          <img
                            src={product.image}
                            alt={product.title}
                            style={{
                              padding: product.styleConfig?.card?.margin || "0px",
                              aspectRatio: "4/3",
                              width: "100%",
                              objectFit: product.styleConfig?.image?.objectFit || "cover",
                            }}
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

                        <h4 className="product__item__title" style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}>
                          <Link href={productDetailHref(locale, product.slug)}>
                            {product.title}
                          </Link>
                        </h4>

                        <div className="product__item__price">
                          {product.price ||
                            (locale === "vi" ? "Liên hệ" : "Contact")}
                        </div>

                        <div className="mt-5 text-center product-action-combo">
                          <Link href={contactHref(locale)} className="floens-btn">
                            <span>{locale === "vi" ? "Liên hệ" : "Contact"}</span>
                          </Link>

                          <div className="product-action-combo__cart">
                            <AddToCartButton productId={product.id} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredProducts.length > itemsPerPage && (
                  <div className="col-12 mt-5">
                    <div className="product-pagination">
                      {currentPage > 1 && (
                        <Link
                          className="pagination__arrow"
                          href={buildHref(locale, {
                            category: activeCategory,
                            q,
                            page: currentPage - 1,
                          })}
                        >
                          ‹
                        </Link>
                      )}

                      {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;

                        return (
                          <Link
                            key={page}
                            className={`page-number ${currentPage === page ? "active" : ""
                              }`}
                            href={buildHref(locale, {
                              category: activeCategory,
                              q,
                              page,
                            })}
                          >
                            {page.toString().padStart(2, "0")}
                          </Link>
                        );
                      })}

                      {currentPage < totalPages && (
                        <Link
                          className="pagination__arrow"
                          href={buildHref(locale, {
                            category: activeCategory,
                            q,
                            page: currentPage + 1,
                          })}
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
                        ? "Không tìm thấy sản phẩm phù hợp."
                        : "No matching products found."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row d-block d-md-none">
            <div className="col-xl-12 col-lg-12">
              <div className="row gutter-y-30">
                {paginatedProducts.map((product) => (
                  <div
                    className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12"
                    key={product.id}
                  >
                    <div className="product__item">
                      <div className="product__item__image">
                        <Link href={productDetailHref(locale, product.slug)}
                        >
                          <img
                            src={product.image}
                            alt={product.title}
                            style={{
                              padding: product.styleConfig?.card?.margin || "0px",
                              aspectRatio: "4/3",
                              width: "100%",
                              objectFit: product.styleConfig?.image?.objectFit || "cover",
                            }}
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

                        <h4 className="product__item__title" style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}>
                          <Link href={productDetailHref(locale, product.slug)}>
                            {product.title}
                          </Link>
                        </h4>

                        <div className="product__item__price">
                          {product.price ||
                            (locale === "vi" ? "Liên hệ" : "Contact")}
                        </div>

                        <div className="mt-5 text-center product-action-combo">
                          <Link href={contactHref(locale)} className="floens-btn">
                            <span>{locale === "vi" ? "Liên hệ" : "Contact"}</span>
                          </Link>

                          <div className="product-action-combo__cart">
                            <AddToCartButton productId={product.id} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredProducts.length > itemsPerPage && (
                  <div className="col-12 mt-5">
                    <div className="product-pagination">
                      {currentPage > 1 && (
                        <Link
                          className="pagination__arrow"
                          href={buildHref(locale, {
                            category: activeCategory,
                            q,
                            page: currentPage - 1,
                          })}
                        >
                          ‹
                        </Link>
                      )}

                      {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;

                        return (
                          <Link
                            key={page}
                            className={`page-number ${currentPage === page ? "active" : ""
                              }`}
                            href={buildHref(locale, {
                              category: activeCategory,
                              q,
                              page,
                            })}
                          >
                            {page.toString().padStart(2, "0")}
                          </Link>
                        );
                      })}

                      {currentPage < totalPages && (
                        <Link
                          className="pagination__arrow"
                          href={buildHref(locale, {
                            category: activeCategory,
                            q,
                            page: currentPage + 1,
                          })}
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
                        ? "Không tìm thấy sản phẩm phù hợp."
                        : "No matching products found."}
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