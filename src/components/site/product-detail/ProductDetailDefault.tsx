import Link from "next/link";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductGallery } from "@/components/site/ProductGallery";
import { AddToCartButton } from "@/components/site/AddToCartButton";
import type {
  Locale,
  ProductCardItem,
  ProductDetailItem,
} from "@/server/products/product.type";
import { FaStar, FaCartShopping } from "react-icons/fa6";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import "@/styles/sanpham.css";
import Banner from "@/components/site/Banner/Banner";

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

function getHtml(content: any) {
  if (!content) return "";
  if (typeof content === "string") return content;
  return content.html || "";
}

function productHref(locale: Locale, slug: string) {
  return locale === "vi" ? `/vi/san-pham/${slug}` : `/en/products/${slug}`;
}

function contactHref(locale: Locale) {
  return locale === "vi" ? "/vi/lien-he" : "/en/contact";
}

function getDynamicAttributes(product: ProductDetailItem) {
  if (!Array.isArray(product.attributes)) return [];

  return product.attributes
    .map((attribute) => ({
      key: attribute.id || attribute.code,
      name: attribute.name || attribute.nameVi || attribute.nameEn || attribute.code,
      value: attribute.value?.trim() || "",
    }))
    .filter((attribute) => attribute.name && attribute.value);
}

export function ProductDetailDefault({
  locale,
  product,
  relatedProducts,
}: {
  locale: Locale;
  product: ProductDetailItem;
  relatedProducts: ProductCardItem[];
}) {

  const gallery = getGallery(product);
  const contentHtml = getHtml(product.content);
  const dynamicAttributes = getDynamicAttributes(product);
  const hasDynamicAttributes = dynamicAttributes.length > 0;

  const legacyOrigin = !hasDynamicAttributes ? product.origin?.trim() || "" : "";
  const legacyMaterial = product.material?.trim() || "";
  const legacySize = product.size?.trim() || "";
  const legacyColor = product.color?.trim() || "";
  const legacyThickness = product.thickness?.trim() || "";
  const legacyDensity = product.density?.trim() || "";
  const legacyHardness = product.hardness?.trim() || "";

  return (
    <div className="page-wrapper">
      <Header locale={locale} />
{/* 
      <PageHeader
        title=""
        bgImage="/assets/images/backgrounds/PACSTONE-SANPHAM-header.png"
      /> */}

       <Banner
        title="SẢN PHẨM"
        backgroundImg="/assets/images/backgrounds/product-banner.webp"
        row={2}
        col={3}
      />
      <section className="product-details section-space">
        <div className="container">
          <div className="row gutter-y-50 align-items-stretch circle-product">
            <div className="col-lg-6 col-xl-6">
              <ProductGallery images={gallery} title={product.title} product={product} />
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
                  {legacyOrigin && (
                    <div className="product-details__meta-item ">
                      <span className="fw-bold text-dark">
                        {locale === "vi" ? "Xuất Xứ" : "Origin"}
                      </span>
                      <span className="ms-2 text-secondary">
                        {legacyOrigin}
                      </span>
                    </div>
                  )}

                  <div className="product-details__specs">
                    <h5 className="mt-2 fw-bold text-dark mb-0" style={{ fontSize: 16 }}>
                      {locale === "vi" ? "Thông Số Kỹ Thuật" : "Specifications"}
                    </h5>

                    <ul className="list-unstyled d-flex flex-column ps-0 mb-0" style={{ color: "#6c757d" }}>
                      {product.sku?.trim() && (
                        <li>SKU: {product.sku.trim()}</li>
                      )}

                      {hasDynamicAttributes ? (
                        dynamicAttributes.map((attribute) => (
                          <li key={attribute.key}>
                            {attribute.name}: {attribute.value}
                          </li>
                        ))
                      ) : (
                        <>
                          <li>{locale === "vi" ? "Chất liệu:" : "Material:"} {legacyMaterial}</li>

                          <li>{locale === "vi" ? "Kích thước:" : "Size:"} {legacySize}</li>

                          <li>{locale === "vi" ? "Màu sắc:" : "Color:"} {legacyColor}</li>

                          <li>{locale === "vi" ? "Độ dày:" : "Thickness:"} {legacyThickness}</li>

                          <li>{locale === "vi" ? "Khối lượng riêng:" : "Density:"} {legacyDensity}</li>

                          <li>{locale === "vi" ? "Độ cứng:" : "Hardness:"} {legacyHardness}</li>
                        </>
                      )}
                    </ul>
                  </div>

                  {product.excerpt && (
                    <div className="product-application-text-wrapper mt-0">
                      <h5 className="fw-bold text-dark mb-0" style={{ fontSize: 16 }}>
                        {locale === "vi" ? "Ứng dụng" : "Excerpt"}
                      </h5>
                      <input
                        type="checkbox"
                        id="toggleExcerpt"
                        className="toggle-excerpt"
                      />

                      <p className="product-application-text mb-0">
                        {product.excerpt}
                      </p>

                      {product.excerpt.length > 150 && (
                        <label
                          htmlFor="toggleExcerpt"
                          className="excerpt-toggle-btn"
                        >
                          Xem thêm...
                        </label>
                      )}
                    </div>
                  )}
                </div>

                <div className="product-details__info mt-auto pt-4">
                  <h4 className="product-details__price">
                    {product.salePrice || product.price || (locale === "vi" ? "Liên hệ" : "Contact")}
                  </h4>

                  <div className="text-center product-action-combo">
                    <Link href={contactHref(locale)} className="floens-btn">
                      <span>{locale === "vi" ? "Liên hệ" : "Contact"}</span>
                    </Link>

                    <div className="product-action-combo__cart">
                      <AddToCartButton productId={product.id} />
                    </div>
                  </div>

                  <div className="product-details__socials">
                    <h3 className="product-details__socials__title">
                      {locale === "vi" ? "Chia sẻ:" : "Share:"}
                    </h3>
                    <div className="details-social">
                      <Link href="https://facebook.com" target="_blank">  <i className="icon-facebook" >
                        <FaFacebookF /></i></Link>
                      <Link href="https://zalo.com" target="_blank">
                        <img src="/assets/images/Icon_of_Zalo.svg.webp" alt="Zalo" />
                      </Link>
                      <Link href="https://youtube.com" target="_blank">
                        <i className="icon-youtube">
                          <FaYoutube /></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="product-details__description-wrapper">
          <div className="container">
            <div className="product-details__description mb-2">
              <h2 className="product-details__description__title">
                {locale === "vi"
                  ? "CÁC DÒNG SẢN PHẨM CHÍNH"
                  : "MAIN PRODUCT LINES"}
              </h2>
              <p className="product-details__description__subtitle">
                {locale === "vi"
                  ? "Chúng tôi nhận thiết kế và thi công đa dạng hoa văn đá theo yêu cầu:"
                  : "We provide custom design and installation services for a wide range of stone patterns upon request:"}
              </p>
            </div>

            <div className="product-details__description d-none d-md-block ">
              <div className="row gutter-y-30">
                {relatedProducts.map((item) => (

                  <div
                    className="col-xl-3 col-lg-3 col-md-6"
                    key={item.id}
                  >
                    <div className="product__item">
                      <div className="product__item__image">
                        <Link href={productHref(locale, item.slug)}
                          style={{
                            margin: item.styleConfig?.card?.margin
                          }}>
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{
                              width: item.styleConfig?.image?.width || "100%",
                              height: item.styleConfig?.image?.height || "180px",
                              objectFit: item.styleConfig?.image?.objectFit || "cover",
                            }}
                          />

                        </Link>
                        <div className="product-image-overlay">

                        </div>
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

                        <div className="product__item__price">
                          {item.salePrice || item.price}
                        </div>

                        <div>
                          <div className="text-center product-action-combo">
                            <Link href={contactHref(locale)} className="floens-btn">
                              <span>{locale === "vi" ? "Liên hệ" : "Contact"}</span>
                            </Link>

                            <div className="product-action-combo__cart">
                              <AddToCartButton productId={item.id} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>
                ))}
              </div>
            </div>
            <div className="product-details__description d-block d-md-none">
              <div className="row gutter-y-30">
                {relatedProducts.map((item) => (

                  <div
                    className="col-xl-3 col-lg-3 col-md-6"
                    key={item.id}
                  >
                    <div className="product__item">
                      <div className="product__item__image">
                        <Link href={productHref(locale, item.slug)}>
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              width: "auto",
                              height: "auto",
                              objectFit: "contain",
                            }}
                          />

                        </Link>
                        <div className="product-image-overlay">
                          {/* {item.title} */}
                        </div>
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

                        <div className="product__item__price">
                          {item.salePrice || item.price}
                        </div>

                        <div>
                          <div className="text-center product-action-combo">
                            <Link href={contactHref(locale)} className="floens-btn">
                              <span>{locale === "vi" ? "Liên hệ" : "Contact"}</span>
                            </Link>

                            <div className="product-action-combo__cart">
                              <AddToCartButton productId={item.id} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section >

      <Footer />
    </div >
  );
}