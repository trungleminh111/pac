"use client";
import { use, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { FaStar } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import Link from "next/link"; // Đã thêm để tránh bug router action
import "@/styles/sanpham.css";
import { FaFacebookF } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { LuArrowRight } from "react-icons/lu";
const products = [
  ["Marble xanh", "10,500,000", "product-1-1.jpg", "Thiết kế hoa văn dạng tròn, phù hợp với đại sảnh, sảnh tròn, trung tâm"],
  ["Marble vàng", "8,000,000", "product-1-2.jpg", "Thiết kế hoa văn dạng vuông, cân đối, ohuf hợp nhiều không gian"],
  ["Marble trắng", "4,000,000", "product-1-3.jpg", "Thiết kế hoa văn dạng chữ nhật, trang trí thảm sàn, phòng khách, hành lang"],
  ["Marble đen", "5,000,000", "product-1-6.jpg", "Thiết kế theo phong cách của riêng bạn"],
];
const product = {
  name: "Marble Xanh MPAC001",
  price: "10,500,000",
  origin: "Ấn Độ",
  specs: [
    { label: "Chủng loại", value: "đá Marble tự nhiên" },
    { label: "Kích thước", value: "Khổ lớn (theo yêu cầu của khách hàng)" },
    { label: "Độ dày", value: "2cm" },
    { label: "Khối lượng riêng", value: "2,71 g/m3" },
    { label: "Độ cứng", value: "4Mohs" },
  ],
  images: [
    "circle2.png",
    "circle5.png",
    "circle6.png",
    "circle7.png",
  ],
};

const works = [
  ["Modern Tiles fitting", "Tile Care", "project-13.png"],
  ["Indoor Court", "Tile Care", "project-12.png"],
  ["Awesome Outdoor Project", "Tile Care", "project-9.png"],
  ["Industrial Flooring", "Tile Care", "project-5.png"],
  ["Eco-Friendly-Flooring", "Tile Care", "project-3.png"],
  ["Laminate Flooring", "Tile Care", "project-11.png"],
];

function toSlug(text: string) {
  
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = use(params);

  const [activeImage, setActiveImage] = useState(product.images[0]);

  return (
    <div className="page-wrapper">
      <Header />

      <PageHeader title="" bgImage="/assets/images/backgrounds/PACSTONE-SANPHAM-header.png" />

      <section className="product-details section-space">
        <div className="container">
          {/* align-items-stretch giúp cột nội dung bên phải có chiều cao bằng khít cột ảnh bên trái */}
          <div className="row gutter-y-50 align-items-stretch circle-product">

            {/* KHỐI ẢNH BÊN TRÁI */}
            <div className="col-lg-6 col-xl-6">
              <div className="product-details__img h-100">
                <div className="swiper product-details__gallery-top">
                  <div className="swiper-wrapper">
                    <div className="swiper-slide">
                      <img
                        src={`/assets/images/products/${activeImage}`}
                        alt={product.name}
                        className="product-details__gallery-top__img"
                      />
                    </div>
                  </div>
                </div>

                <div className="swiper product-details__gallery-thumb">
                  <div className="swiper-wrapper d-flex gap-2">
                    {product.images.map((image, idx) => (
                      <div
                        className={`product-details__gallery-thumb-slide swiper-slide ${activeImage === image ? "active" : ""
                          }`}
                        key={`${image}-${idx}`}
                        onClick={() => setActiveImage(image)}
                      >
                        <img
                          src={`/assets/images/products/${image}`}
                          alt={product.name}
                          className="product-details__gallery-thumb__img"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* KHỐI THÔNG TIN BÊN PHẢI */}
            <div className="col-lg-6 col-xl-6">
              {/* Thêm style flex d-flex để quản lý vị trí nội dung bên trong */}
              <div className="product-details__content h-100 d-flex flex-column">

                <div className="product-details__top">
                  <div className="product-details__top__left">
                    <h3 className="product-details__name">{product.name}</h3>
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

                  <div className="product-details__meta-item">
                    <span className="fw-bold text-dark">Xuất Xứ:</span>
                    <span className="ms-2 text-secondary">{product.origin}</span>
                  </div>

                  <div className="product-details__specs mt-2">
                    <h5 className="fw-bold text-dark mb-2" style={{ fontSize: "16px" }}>Thông Số Kỹ Thuật</h5>
                    <ul className="list-unstyled d-flex flex-column gap-1 ps-0">
                      {product.specs.map((spec, index) => (
                        <li key={index} className="product-details__spec-line">
                          <span className="text-dark" style={{ fontWeight: 500 }}>{spec.label}:</span>
                          <span className="ms-2 text-secondary">{spec.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="product-details__excerpt mt-2">
                    <h5 className="fw-bold text-dark mb-2" style={{ fontSize: "16px" }}>Ứng Dụng</h5>
                    {/* nội dung ứng dụng */}
                  </div>
                </div>
                <div className="product-details__info mt-auto pt-4">
                  <h4 className="product-details__price">{product.price}</h4>
                  <div>
                    <Link href={`/${locale}/lien-he`} className="floens-btn product__item__link">
                      <span>Liên hệ</span>
                      <FaCartShopping className="product-cart-icon" />
                    </Link>
                  </div>

                  <div className="product-details__socials">
                    <h3 className="product-details__socials__title">Chia sẻ:</h3>
                    <div className="details-social">
                      <Link href="https://facebook.com" target="_blank">
                        <i className="icon-facebook" >
                          <FaFacebookF /></i>
                      </Link>
                      <Link href="https://zalo.com" target="_blank">
                        <img
                          src="/assets/images/Icon_of_Zalo.svg.webp"
                        />
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
            <div className="product-details__description">
              <h3 className="product-details__description__title">
                CÁC DÒNG SẢN PHẨM CHÍNH
              </h3>
            </div>
            <div className="product-details__description">

              <div className="row gutter-y-30">
                {products.map(([name, price, image, description]) => (
                  <div className="col-xl-3 col-lg-3 col-md-6" key={name}>
                    <div className="product__item">
                      <div className="product__item__image">
                        <a href="/san-pham">
                          <img src={`/assets/images/products/${image}`} alt={name} />
                          <div className="product-image-overlay">
                            <p>{description}</p>
                          </div>
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

                          <a href="/lien-he" className="floens-btn product__item__link">
                            <span>Liên hệ</span>
                            <FaCartShopping className="product-cart-icon" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="container pt-5 pb-5">
          <h3>ỨNG DỤNG THỰC TẾ</h3>
          <p className="h5">Một số công trình tiêu biểu đã thi công</p>
          <Swiper
            modules={[Autoplay, Navigation]}
            slidesPerView={3}
            spaceBetween={30}
            loop={true}
            navigation={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 3,
              },
            }}
          >
            {works.map(([title, tagline, image]) => (
              <SwiperSlide key={title}>
                <div className="work-card h-100">
                  <div className="work-card__image">
                    <img src={`/assets/images/works/${image}`} alt={title} />
                  </div>

                  <div className="work-card__content-show">
                    <div className="work-card__content-inner">
                      <h3 className="work-card__tagline">{tagline}</h3>
                      <h3 className="work-card__title">
                        <a href={`/${locale}/cong-trinh/${toSlug(title)}`}>
                          {title}
                        </a>
                      </h3>
                    </div>
                  </div>

                  <div className="work-card__content-hover">
                    <div className="work-card__content-inner">
                      <h3 className="work-card__tagline">{tagline}</h3>
                      <h3 className="work-card__title">
                        <a href={`/${locale}/cong-trinh/${toSlug(title)}`}>
                          {title}
                        </a>
                      </h3>
                    </div>

                    <a
                      href={`/${locale}/cong-trinh/${toSlug(title)}`}
                      className="work-card__link floens-btn"
                    >
                      <LuArrowRight />
                    </a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>


      </section>

      <Footer />
    </div>
  );
}