import { FaStar } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
const products = [
  ["Marble xanh", "10,500,000", "product-1-1.jpg"],
  ["Marble vàng", "8,000,000", "product-1-2.jpg"],
  ["Marble trắng", "4,000,000", "product-1-3.jpg"],
  ["Marble đen", "5,000,000", "product-1-6.jpg"],
];

export function Products() {
  return (
    <section className="product-home ">
      <div
        className="product-home__bg"
        style={{
          backgroundImage: "url('/assets/images/backgrounds/shop-bg-1.png')",
        }}
      />

      <div className="container">
        <div className="sec-title sec-title--center">
          <h3 className="sec-title__title">Khám phá các sản phẩm nổi bật</h3>
        </div>

        <div className="row gutter-y-30">
          {products.map(([name, price, image]) => (
            <div className="col-xl-3 col-lg-3 col-md-6" key={name}>
              <div className="product__item">
                <div className="product__item__image">
                  <a href="/san-pham">
                    <img src={`/assets/images/products/${image}`} alt={name} />
                  </a>
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
                    <a href="/san-pham">{name}</a>
                  </h4>

                  <div className="product__item__price">{price}</div>
                  <div>

                    <a href="/lien-he" className="floens-btn product__item__link ">
                      <span>Liên hệ</span>
                      <span>|</span>
                      <FaCartShopping className="product-cart-icon" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}