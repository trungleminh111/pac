"use client";

import { useState } from "react";

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="product-details__img h-100">
      <div className="swiper product-details__gallery-top">
        <div className="swiper-wrapper">
          <div className="swiper-slide">
            <img
              src={activeImage}
              alt={title}
              className="product-details__gallery-top__img"
              
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
              className={`product-details__gallery-thumb-slide swiper-slide ${
                activeImage === image ? "active" : ""
              }`}
              style={{ cursor: "pointer" }}
            >
              <img
                src={image}
                alt={title}
                className="product-details__gallery-thumb__img"
                style={{ height: 50}}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}