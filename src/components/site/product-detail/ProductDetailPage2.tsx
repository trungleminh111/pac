import Link from "next/link";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductGallery } from "@/components/site/ProductGallery";
import type {
  Locale,
  ProductCardItem,
  ProductDetailItem,
} from "@/server/products/product.type";
import { FaStar, FaCartShopping } from "react-icons/fa6";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import "@/styles/sanpham.css";

function getGallery(product: ProductDetailItem) {
  const images: string[] = [];

  if (product.thumbnail) images.push(product.thumbnail);

  if (Array.isArray(product.gallery)) {
    product.gallery.forEach((item) => {
      if (typeof item === "string" && item && !images.includes(item)) {
        images.push(item);
      }
    });
  }

  return images.length > 0 ? images : ["/assets/images/products/product-1-1.jpg"];
}

function productHref(locale: Locale, slug: string) {
  return locale === "vi" ? `/vi/san-pham/${slug}` : `/en/products/${slug}`;
}

export function ProductDetailPage2({
  locale,
  product,
  relatedProducts,
}: {
  locale: Locale;
  product: ProductDetailItem;
  relatedProducts: ProductCardItem[];
}) {
  const gallery = getGallery(product);

  return (
    <div className="page-wrapper">
      <Header locale={locale} />

      <PageHeader
        title=""
        bgImage="/assets/images/backgrounds/PACSTONE-SANPHAM-header.png"
      />

      <section className="product-details section-space">
        <div className="container">
          <div className="row gutter-y-50 align-items-stretch">
            <div className="col-lg-6 col-xl-6">
              <ProductGallery images={gallery} title={product.title} />
            </div>

            <div className="col-lg-6 col-xl-6">
              <div className="product-details__content h-100 d-flex flex-column">
                <div className="product-details__top">
                  <div className="product-details__top__left">
                    <h3 className="product-details__name">{product.title}</h3>
                  </div>
                </div>

                <div className="product-details__review">
                  <div className="floens-ratings">
                    <div className="rating-stars">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <FaStar key={index} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="detail-product-title d-flex gap-3 flex-column">
                  {product.origin && (
                    <div className="product-details__meta-item">
                      <span className="fw-bold text-dark">
                        {locale === "vi" ? "Xuất Xứ:" : "Origin:"}
                      </span>
                      <span className="ms-2 text-secondary">{product.origin}</span>
                    </div>
                  )}

                  <div className="product-details__specs mt-2">
                    <h5 className="fw-bold text-dark mb-2" style={{ fontSize: 16 }}>
                      {locale === "vi" ? "Thông Số Kỹ Thuật" : "Specifications"}
                    </h5>

                    <ul className="list-unstyled d-flex flex-column gap-1 ps-0">
                      {product.material && <li>{locale === "vi" ? "Chủng loại:" : "Material:"} {product.material}</li>}
                      {product.size && <li>{locale === "vi" ? "Kích thước:" : "Size:"} {product.size}</li>}
                      {product.color && <li>{locale === "vi" ? "Màu sắc:" : "Color:"} {product.color}</li>}
                      {product.sku && <li>SKU: {product.sku}</li>}
                    </ul>
                  </div>

                  {product.excerpt && (
                    <div className="product-details__excerpt mt-2">
                      <h5 className="fw-bold text-dark mb-2" style={{ fontSize: 16 }}>
                        {locale === "vi" ? "Ứng Dụng" : "Application"}
                      </h5>
                      <p className="product-application-text">{product.excerpt}</p>
                    </div>
                  )}
                </div>

                <div className="product-details__info mt-auto pt-4">
                  <h4 className="product-details__price">
                    {product.price || (locale === "vi" ? "Liên hệ" : "Contact")}
                  </h4>

                  <Link
                    href={locale === "vi" ? "/vi/lien-he" : "/en/contact"}
                    className="floens-btn product__item__link"
                  >
                    <span>{locale === "vi" ? "Liên hệ" : "Contact"}</span>
                    <FaCartShopping className="product-cart-icon" />
                  </Link>

                  <div className="product-details__socials">
                    <h3 className="product-details__socials__title">
                      {locale === "vi" ? "Chia sẻ:" : "Share:"}
                    </h3>
                    <div className="details-social">
                      <Link href="https://facebook.com" target="_blank"><FaFacebookF /></Link>
                      <Link href="https://zalo.com" target="_blank">
                        <img src="/assets/images/Icon_of_Zalo.svg.webp" alt="Zalo" />
                      </Link>
                      <Link href="https://youtube.com" target="_blank"><FaYoutube /></Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="product-details__description-wrapper">
          <div className="container">
            <div className="product-details__description">
              <h3 className="product-details__description__title">
                {locale === "vi" ? "SẢN PHẨM TƯƠNG TỰ" : "RELATED PRODUCTS"}
              </h3>
            </div>

            <div className="row gutter-y-30">
              {relatedProducts.map((item) => (
                <div className="col-xl-3 col-lg-3 col-md-6" key={item.id}>
                  <div className="product__item">
                    <div className="product__item__image">
                      <Link href={productHref(locale, item.slug)}>
                        <img src={item.image} alt={item.title} />
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
                        <Link href={productHref(locale, item.slug)}>
                          {item.title}
                        </Link>
                      </h4>

                      <div className="product__item__price">{item.price}</div>

                      <Link
                        href={productHref(locale, item.slug)}
                        className="floens-btn product__item__link"
                      >
                        <span>{locale === "vi" ? "Liên hệ" : "Contact"}</span>
                        <FaCartShopping className="product-cart-icon" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}