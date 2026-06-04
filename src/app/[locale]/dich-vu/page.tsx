import Link from "next/link";
import { HeaderWrapper as Header } from "@/components/site/HeaderWrapper";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { FaStar, FaCartShopping } from "react-icons/fa6";
import { BsSearch } from "react-icons/bs";
import "@/styles/sanpham.css";

type Locale = "vi" | "en";

const categories = [
  "Mẫu Đá",
  "Tranh Đá - Hoa văn Đá",
  "Vật Tư Phụ - Phụ Gia",
  "Thiết Bị - Dụng Cụ Ngành Đá",
  "Khuyến Mãi - Thanh Lý",
];

const products = [
  ["Marble Xanh MPN001", "10,500,000", "product-1-1.jpg", "Mẫu Đá"],
  ["Marble Vàng MPN002", "8,000,000", "product-1-2.jpg", "Mẫu Đá"],
  ["Marble Trắng MPAC003", "4,000,000", "product-1-3.jpg", "Tranh Đá - Hoa văn Đá"],
  ["Marble Trắng MPAC004", "3,500,000", "product-1-4.jpg", "Tranh Đá - Hoa văn Đá"],
  ["Marble Vàng MPAC005", "6,000,000", "product-1-5.jpg", "Vật Tư Phụ - Phụ Gia"],
  ["Marble Đen MPAC006", "4,500,000", "product-1-6.jpg", "Thiết Bị - Dụng Cụ Ngành Đá"],
  ["Marble Hồng MPAC007", "5,000,000", "product-1-7.jpg", "Khuyến Mãi - Thanh Lý"],
  ["Marble Xanh MPAC008", "3,000,000", "product-1-8.jpg", "Mẫu Đá"],
  ["Marble Đỏ MPAC009", "2,000,000", "product-1-9.jpg", "Mẫu Đá"],
  ["Marble Đỏ MPAC0010", "2,000,000", "product-1-10.jpg", "Mẫu Đá"],
];

function productListHref(locale: Locale) {
  return locale === "vi" ? "/vi/san-pham" : "/en/products";
}

function productDetailHref(locale: Locale, slug: string) {
  return locale === "vi"
    ? `/vi/san-pham/${slug}`
    : `/en/products/${slug}`;
}

function contactHref(locale: Locale) {
  return locale === "vi" ? "/vi/lien-he" : "/en/contact";
}

function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
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

  const activeCategory = searchParams?.category || categories[0];
  const currentPage = Number(searchParams?.page || 1);

  const itemsPerPage = 8;

  const filteredProducts = products.filter(
    ([, , , category]) => category === activeCategory
  );

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
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "50px",
                    }}
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
                    const href = `${productListHref(locale)}?category=${encodeURIComponent(
                      category
                    )}`;

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
                {paginatedProducts.map(([name, price, image]) => {
                  const slug = toSlug(name);

                  return (
                    <div
                      className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12"
                      key={name}
                    >
                      <div className="product__item">
                        <div className="product__item__image">
                          <Link href={productDetailHref(locale, slug)}>
                            <img
                              src={`/assets/images/products/${image}`}
                              alt={name}
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
                            <Link href={productDetailHref(locale, slug)}>
                              {name}
                            </Link>
                          </h4>

                          <div className="product__item__price">{price}</div>

                          <Link
                            href={contactHref(locale)}
                            className="floens-btn product__item__link"
                          >
                            <span>
                              {locale === "vi" ? "Liên hệ" : "Contact"}
                            </span>
                            <FaCartShopping className="product-cart-icon" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredProducts.length > itemsPerPage && (
                  <div className="col-12 mt-5">
                    <div className="product-pagination">
                      {currentPage > 1 && (
                        <Link
                          className="prev-btn"
                          href={`${productListHref(locale)}?category=${encodeURIComponent(
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
                            href={`${productListHref(locale)}?category=${encodeURIComponent(
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
                          href={`${productListHref(locale)}?category=${encodeURIComponent(
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