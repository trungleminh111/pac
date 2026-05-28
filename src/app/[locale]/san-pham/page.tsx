import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";

const colors = [
  "marble-color-1.png",
  "marble-color-2.png",
  "marble-color-3.png",
  "marble-color-4.png",
  "marble-color-5.png",
  "marble-color-6.png",
];

const categories = [
  "Đá Hoa Cương - Granite",
  "Đá Cẩm Thạch - Marble",
  "Đá Onyx",
  "Đá Limestone",
  "Đá Quartzite",
  "Tranh Đá",
  "Hoa Văn Đá",
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

        <PageHeader title=""   bgImage = "/assets/images/backgrounds/PACSTONE-SANPHAM-header.png"/>


      <section className="product-page product-page--left section-space-bottom">
        <div className="container">
          <div className="row gutter-y-60">
            <div className="col-xl-3 col-lg-4">
              <aside className="product__sidebar">
                <div className="product__search-box product__sidebar__item">
                  <form action="#" className="product__search">
                    <input type="text" placeholder="Tìm sản phẩm" />
                    <button type="submit" aria-label="search submit">
                      <span className="icon-search" />
                    </button>
                  </form>
                </div>

                <div className="product__price-ranger product__sidebar__item">
                  <h3 className="product__sidebar__title">Màu sắc</h3>

                  <div className="product-details__color__box">
                    {colors.map((color) => (
                      <button
                        type="button"
                        className="product-details__color__btn"
                        key={color}
                      >
                        <img
                          src={`/assets/images/resources/${color}`}
                          alt="color"
                          width="40"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="product__categories product__sidebar__item">
                  <h3 className="product__sidebar__title product__categories__title">
                    Danh mục
                  </h3>

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
              </aside>
            </div>

            <div className="col-xl-9 col-lg-8">
              <div className="row gutter-y-30">
                {products.map(([name, price, image]) => (
                  <div className="col-xl-4 col-lg-6 col-md-6" key={name}>
                    <div className="product__item">
                      <div className="product__item__image">
                        <img
                          src={`/assets/images/products/${image}`}
                          alt={name}
                        />
                      </div>

                      <div className="product__item__content">
                        <div className="floens-ratings product__item__ratings">
                          <span className="icon-star" />
                          <span className="icon-star" />
                          <span className="icon-star" />
                          <span className="icon-star" />
                          <span className="icon-star" />
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
                          <i className="icon-cart" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="col-12">
                  <ul className="post-pagination">
                    <li>
                      <a href="#">
                        <span className="icon-arrow-left" />
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