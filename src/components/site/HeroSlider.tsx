"use client"; // Bắt buộc phải có trong Next.js (App Router) để dùng State

import { useState, useEffect } from "react";
import { GrPrevious, GrNext } from "react-icons/gr";
import "@/styles/heroslide.css";

type Locale = "vi" | "en";

// 1. Khai báo danh sách 3 slide động (Có thể thay đổi nội dung tùy ý)
const heroContent = {
  vi: {
    button: "Tìm hiểu thêm",
    href: "/vi/gioi-thieu",
    slides: [
      {
        image: "3.jpg",
        subtitle: "Chào mừng đến với",
        title: "P.A.C STONE",
        desc: "Đẳng cấp Công Trình Việt",
      },
      {
        image: "slider2.jpg",
        subtitle: "Giải pháp kiến trúc",
        title: "ĐÁ ỐP LÁT CAO CẤP",
        desc: "Sang trọng - Tinh tế - Trường tồn",
      }
    ],
  },
  en: {
    button: "Learn more",
    href: "/en/about",
    slides: [
      {
        image: "3.jpg",
        subtitle: "Welcome to",
        title: "P.A.C STONE",
        desc: "Premium Value for Vietnamese Projects",
      },
      {
        image: "slider2.jpg",
        subtitle: "Architectural solutions",
        title: "PREMIUM STONE CLADDING",
        desc: "Elegant - Refined - Timeless",
      }
    ],
  },
};

export function Hero({ locale = "vi" }: { locale?: Locale }) {
  const content = heroContent[locale] || heroContent.vi;
  const slides = content.slides;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [locale]);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 10000);

    return () => clearInterval(slideInterval);
  }, [slides.length]);

  return (
    <section className="main-slider-two hero-slider">
      <div className="main-slider-two__carousel">
        
        {slides.map((slide, index) => (
          <div 
            className={`main-slider-two__item ${index === currentIndex ? "active" : ""}`} 
            key={index}
          >
            {/* Sử dụng thẻ img chuẩn hoặc Next Image để bọc ảnh thay vì dùng background-image, giúp quản lý aspect-ratio tốt hơn */}
            <div className="hero-bg-wrapper">
              <img
                src={`/assets/images/slider/${slide.image}`}
                alt={slide.title}
                className="main-slider-two__bg"
              />
            </div>

            <div className="main-slider-two__wrapper">
              <div className="hero-content">
                <p className="hero-subtitle">{slide.subtitle}</p>
                <h1 className="hero-title">{slide.title}</h1>
                <h2 className="hero-desc">{slide.desc}</h2>
              </div>
              <div className="conteiner-btn">
                <a href={content.href} className="hero-btn">
                  <span>{content.button}</span>
                  <i className="icon-right-arrow">→</i>
                </a>
              </div>
            </div>
          </div>
        ))}

        <div className="slider-arrow-bottom">
          <div className="arrow-btn-click" onClick={handlePrev}>
            <GrPrevious /><GrPrevious />
          </div>
          <span className="divider">|</span>
          <div className="arrow-btn-click" onClick={handleNext}>
            <GrNext /><GrNext />
          </div>
        </div>

      </div>
    </section>
  );
}