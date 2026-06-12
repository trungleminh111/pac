"use client";
import { useState } from "react";
import type { ProductDetailItem } from "@/server/products/product.type";

function getMarginTop(margin?: string): string {
  if (!margin) return "0px";
  return margin.trim().split(/\s+/)[0];
}

function getMarginBottom(margin?: string): string {
  if (!margin) return "0px";
  return margin.trim().split(/\s+/)[2] || "0px";
}

export function ProductGallery({
  images,
  title,
  product,
}: {
  images: string[];
  title: string;
  product: ProductDetailItem;
}) {
  const [activeImage, setActiveImage] = useState(images[0]);
  const margin = product.styleConfig?.card?.margin;
  const marginTop = getMarginTop(margin);
  const marginBottom = getMarginBottom(margin);
  const imageHeight = product.styleConfig?.image?.height || "180px";
  const computedHeight = margin
    ? `calc(${imageHeight} + ${marginTop} + ${marginBottom})`
    : imageHeight;


  return (
    <div className="product-details__img h-100">
      <div className="swiper product-details__gallery-top">
        <div className="swiper-wrapper">
          <div className="swiper-slide d-flex">
            <img
              src={activeImage}
              alt={title}
              className="product-details__gallery-top__img"
              style={{
                padding: margin || "0px",
                width: product.styleConfig?.image?.width || "100%",
                height: "100%",
                objectFit: product.styleConfig?.image?.objectFit || "cover",
              }}
            />
          </div>
        </div>
      </div>

      <div className="swiper product-details__gallery-thumb">
        <div className="swiper-wrapper d-flex gap-2">
          {images.map((image, idx) => (
            <div
              key={`${image}-${idx}`}
              onClick={() => setActiveImage(image)}
              className={`product-details__gallery-thumb-slide swiper-slide ${activeImage === image ? "active" : ""
                }`}
              style={{ cursor: "pointer" }}
            >
              <img
                src={image}
                alt={title}
                className="product-details__gallery-thumb__img"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}