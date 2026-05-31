import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { FaStar } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
import "@/styles/sanpham.css";

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
  ["Marble Xanh MPN001", "10,500,000", "product-1-1.jpg"],
  ["Marble Vàng MPN002", "8,000,000", "product-1-2.jpg"],
  ["Marble Trắng MPN003", "4,000,000", "product-1-3.jpg"],
  ["Marble Trắng MPN004", "3,500,000", "product-1-4.jpg"],
  ["Marble Vàng MPN005", "6,000,000", "product-1-5.jpg"],
  ["Marble Đen MPN006", "4,500,000", "product-1-6.jpg"],
  ["Marble Hồng MPN007", "5,000,000", "product-1-7.jpg"],
  ["Marble Xanh MPN008", "3,000,000", "product-1-8.jpg"],
  ["Marble Đỏ MPN009", "2,000,000", "product-1-9.jpg"],
];

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

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
            <div className="col-xl-4 col-md-5 col-12">
              {/* Thêm class h-100 để ô phình to lấp đầy chiều cao bằng với cụm categories */}
              <div className="product__search-box product__sidebar__item h-100" style={{ margin: 0, display: 'flex' }}>
                <form action="#" className="product__search w-100" style={{ display: 'flex', position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="Tìm sản phẩm" 
                    style={{ width: '100%', height: '100%', minHeight: '50px' }}
                  />
                  <button type="submit" aria-label="search submit" style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none' }}>
                    <span className="icon-search" />
                  </button>
                </form>
              </div>
            </div>

            {/* Cột categories bên phải */}
            <div className="col-xl-8 col-md-7 col-12">
              <div className="product__categories" style={{ margin: 0, height: '100%' }}>
                <ul className="list-unstyled">
                  {categories.map((category) => (
                    <li key={category}>
                      <a href={`/${locale}/san-pham`} data-text={category}>
                        <span>{category}</span>
                      </a>
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
                {products.map(([name, price, image]) => (
                  <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12" key={name}>
                    <div className="product__item">
                      <div className="product__item__image">
                        <img
                          src={`/assets/images/products/${image}`}
                          alt={name}
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
                  <ul className="post-pagination justify-content-center">
                    <li>
                      <a href="#">
                        <span className="icon-arrow-left" />
                        <GrPrevious />
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
                        <GrNext />
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