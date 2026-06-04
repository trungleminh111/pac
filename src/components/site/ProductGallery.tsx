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
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          margin: "0 auto",
        }}
      >
        <div
          className="product-details__gallery-top"
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            overflow: "hidden",
            borderRadius: "16px",
            background: "transparent",
            boxShadow: "none",
          }}
        >
          <img
            src={activeImage}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        <div className="product-details__gallery-thumb mt-3">
          <div className="d-flex gap-2 flex-wrap">
            {images.map((image, index) => (
              <button
                type="button"
                key={`${image}-${index}`}
                onClick={() => setActiveImage(image)}
                style={{
                  width: "82px",
                  height: "82px",
                  border:
                    activeImage === image
                      ? "2px solid #c89b3c"
                      : "1px solid transparent",
                  padding: 0,
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <img
                  src={image}
                  alt={title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}