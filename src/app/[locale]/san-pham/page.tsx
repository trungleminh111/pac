"use client";

import { use, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { FaStar } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
import "@/styles/sanpham.css";
import { BsSearch } from "react-icons/bs";
const colors = [
  "marble-color-1.png",
  "marble-color-2.png",
  "marble-color-3.png",
  "marble-color-4.png",
  "marble-color-5.png",
  "marble-color-6.png",
];

const categories = [
  "Mẫu Đá",
  "Tranh Đá - Hoa văn Đá",
  "Vật Tư Phụ - Phụ Gia",
  "Thiết Bị - Dụng Cụ Ngành Đá",
  "Khuyến Mãi - Thanh Lý"
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

export default function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const allCategories = [...categories];

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
      <Header />

      <PageHeader title="" bgImage="/assets/images/backgrounds/PACSTONE-SANPHAM-header.png" />

      <section className="product-page product-page--left section-space-bottom">

        <div className="container">

          {/* ===================================================
              HÀNG 1: KHU VỰC BỘ LỌC (TÌM KIẾM & CATEGORIES)
             =================================================== */}
          {/* Thêm align-items-stretch giúp ép hai cột có chiều cao (height) bằng khít nhau */}
          <div className="row align-items-stretch gy-4 mb-5">

            {/* Cột tìm kiếm bên trái */}
            <div className="col-xl-4 col-md-12 col-12">
              {/* Thêm class h-100 để ô phình to lấp đầy chiều cao bằng với cụm categories */}
              <div className="product__search-box product__sidebar__item h-100" style={{ margin: 0, display: 'flex' }}>
                <form action="#" className="product__search w-100" style={{ display: 'flex', position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Tìm sản phẩm"
                    style={{ width: '100%', height: '100%', minHeight: '50px' }}
                  />
                  <button type="submit" aria-label="search submit" style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none' }}>
                    <span className="icon-search"><BsSearch /></span>
                  </button>
                </form>
              </div>
            </div>

            {/* Cột categories bên phải */}
            <div className="col-xl-8 col-md-12 col-12">
              <div className="product__categories" style={{ margin: 0, height: '100%' }}>
                <ul className="list-unstyled">
                  {allCategories.map((category) => (
                    <li
                      key={category}
                      className={activeCategory === category ? "active" : ""}
                      onClick={() => {
                        setActiveCategory(category);
                        setCurrentPage(1);
                      }}
                    >
                      <button type="button" data-text={category}>
                        <span>{category}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          <hr className="mb-5" style={{ borderTop: '1px solid #e1dad5', opacity: 0.5 }} />

          {/* ===================================================
              HÀNG 2: DANH SÁCH SẢN PHẨM Ở DƯỚI
             =================================================== */}
          <div className="row">
            <div className="col-xl-12 col-lg-12">
              <div className="row gutter-y-30">
                {paginatedProducts.map(([name, price, image]) => (
                  <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12" key={name}>
                    <div className="product__item">
                      <div className="product__item__image">
                        <img
                          src={`/assets/images/products/${image}`}
                          alt={name}
                          style={{ height: '180px' }}
                        />
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
                          <a href={`/${locale}/san-pham/${name.toLowerCase().replaceAll(" ", "-")}`}>
                            {name}
                          </a>
                        </h4>

                        <div className="product__item__price">{price}</div>

                        <a
                          href={`/${locale}/lien-he`}
                          className="floens-btn product__item__link"
                        >
                          <span>Liên hệ</span>
                          <FaCartShopping className="product-cart-icon" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Phân trang bài viết */}
                <div className="col-12 mt-5">
                  {filteredProducts.length > itemsPerPage && (
                    <div className="product-pagination">
                      <button
                        className="prev-btn"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                      >
                        ‹
                      </button>

                      {Array.from({ length: totalPages }, (_, index) => (
                        <button
                          key={index}
                          className={`page-number ${currentPage === index + 1 ? "active" : ""
                            }`}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {(index + 1).toString().padStart(2, "0")}
                        </button>
                      ))}

                      <button
                        className="next-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                      >
                        ›
                      </button>
                    </div>
                  )}
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