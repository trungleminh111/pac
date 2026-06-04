import Link from "next/link";
import { FaStar, FaCartShopping } from "react-icons/fa6";
import { getHomeProducts } from "@/server/products/product.query";
import type { Locale } from "@/server/products/product.type";

function productHref(locale: Locale, slug: string) {
  return locale === "vi" ? `/vi/san-pham/${slug}` : `/en/products/${slug}`;
}

function productListHref(locale: Locale) {
  return locale === "vi" ? "/vi/san-pham" : "/en/products";
}

function contactHref(locale: Locale) {
  return locale === "vi" ? "/vi/lien-he" : "/en/contact";
}

export async function Products({ locale }: { locale: Locale }) {
  const products = await getHomeProducts(locale);

  return (
    <section className="product-home">
      <div
        className="product-home__bg"
        style={{
          backgroundImage: "url('/assets/images/backgrounds/shop-bg-1.png')",
        }}
      />

      <div className="container">
        <div className="sec-title sec-title--center">
          <h3 className="sec-title__title">
            {locale === "vi"
              ? "Khám phá các sản phẩm nổi bật"
              : "Explore featured products"}
          </h3>
        </div>

        <div className="row gutter-y-30">
          {products.map((product) => (
            <div className="col-xl-3 col-lg-3 col-md-6" key={product.id}>
              <div className="product__item">
                <div className="product__item__image">
                  <Link href={productHref(locale, product.slug)}>
                    <img src={product.image} alt={product.title} />
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
                    <Link href={productHref(locale, product.slug)}>
                      {product.title}
                    </Link>
                  </h4>

                  <div className="product__item__price">
                    {product.price || (locale === "vi" ? "Liên hệ" : "Contact")}
                  </div>

                  <div>
                    <Link
                      href={contactHref(locale)}
                      className="floens-btn product__item__link"
                    >
                      <span>{locale === "vi" ? "Liên hệ" : "Contact"}</span>
                      <span>|</span>
                      <FaCartShopping className="product-cart-icon" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="col-12">
              <p className="text-center">
                {locale === "vi"
                  ? "Chưa có sản phẩm nào."
                  : "No products found."}
              </p>
            </div>
          )}
        </div>

        {products.length > 0 && (
          <div className="mt-5 text-center">
            <Link href={productListHref(locale)} className="floens-btn">
              <span>
                {locale === "vi" ? "Xem tất cả sản phẩm" : "View all products"}
              </span>
                <i className="icon-right-arrow" >→</i>
            </Link>
          
          </div>
        )}
      </div>
    </section>
  );
}