import Link from "next/link";
import { FaStar } from "react-icons/fa6";
import { getHomeProducts } from "@/server/products/product.query";
import type { Locale } from "@/server/products/product.type";
import ScrollReveal from "@/components/site/ScrollReveal";
import { AddToCartButton } from "@/components/site/AddToCartButton";

function productHref(locale: Locale, slug: string) {
  return locale === "vi" ? `/vi/san-pham/${slug}` : `/en/products/${slug}`;
}

function productListHref(locale: Locale) {
  return locale === "vi" ? "/vi/san-pham" : "/en/products";
}

function contactHref(
  locale: Locale,
  product: {
    id: string;
    title: string;
    slug: string;
  }
) {
  const basePath = locale === "vi" ? "/vi/lien-he" : "/en/contact";
  const productUrl = productHref(locale, product.slug);

  const params = new URLSearchParams({
    productId: product.id,
    productTitle: product.title,
    productUrl,
  });

  return `${basePath}?${params.toString()}`;
}

function isValidCrop(crop: any, src: string) {
  return (
    crop &&
    src &&
    crop.url === src &&
    typeof crop.imageLeftPct === "number" &&
    typeof crop.imageTopPct === "number" &&
    typeof crop.imageWidthPct === "number" &&
    typeof crop.imageHeightPct === "number" &&
    Number.isFinite(crop.imageLeftPct) &&
    Number.isFinite(crop.imageTopPct) &&
    Number.isFinite(crop.imageWidthPct) &&
    Number.isFinite(crop.imageHeightPct) &&
    crop.imageWidthPct > 0 &&
    crop.imageHeightPct > 0
  );
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
          {products.map((product) => {
            const crop = product.styleConfig?.thumbnailCrop;
            const hasCrop = isValidCrop(crop, product.image);

            return (
              <div
                className="col-xl-3 col-lg-3 col-md-6"
                key={`desktop-${product.id}`}
              >
                <ScrollReveal animationClass="fade-in-up" delay="0.2s">
                  <div className="product__item">
                    <div className="product__item__image">
                      <Link href={productHref(locale, product.slug)}>
                        <img
                          src={product.image}
                          alt={product.title}
                          draggable={false}
                          style={{
                            display: "block",
                            userSelect: "none",

                            ...(hasCrop
                              ? {
                                  position: "absolute",
                                  left: `${crop!.imageLeftPct * 100}%`,
                                  top: `${crop!.imageTopPct * 100}%`,
                                  width: `${crop!.imageWidthPct * 100}%`,
                                  height: `${crop!.imageHeightPct * 100}%`,
                                  objectFit: "fill",
                                  maxWidth: "none",
                                  maxHeight: "none",
                                }
                              : {
                                  position: "static",
                                  width: "100%",
                                  height: "100%",
                                  objectFit:
                                    product.styleConfig?.image?.objectFit ||
                                    "cover",
                                  objectPosition: "center",
                                  maxWidth: "100%",
                                  maxHeight: "none",
                                }),
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

                      <h4
                        className="product__item__title"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        <Link href={productHref(locale, product.slug)}>
                          {product.title}
                        </Link>
                      </h4>

                      <div className="product__item__price">
                        {product.price ||
                          (locale === "vi" ? "Liên hệ" : "Contact")}
                      </div>

                      <div className="text-center product-action-combo">
                       <Link href={contactHref(locale, product)} className="floens-btn">
                          <span>{locale === "vi" ? "Liên hệ" : "Contact"}</span>
                        </Link>

                        <div className="product-action-combo__cart">
                          <AddToCartButton productId={product.id} />
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            );
          })}

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
              <i className="icon-right-arrow">→</i>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}