"use client";

import { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { LuUser } from "react-icons/lu";
import {
  FaPaperPlane,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaYoutube,
  FaTimes,
  FaAngleDown,
} from "react-icons/fa";
import { SiZalo } from "react-icons/si";

const menuItems = [
  { label: "TRANG CHỦ", href: "/" },
  { label: "GIỚI THIỆU", href: "/vi/gioi-thieu" },
  {
    label: "DỊCH VỤ",
    href: "/vi/dich-vu",
    children: [
      "Thi Công Đá Ốp Mặt Tiền",
      "Thi Công Đá Ốp Cột",
      "Thi Công Đá Ốp Cầu Thang",
      "Thiết Kế Thi Công Đá Ốp Sàn Thang Máy",
      "Thi Công Đá Ốp Bếp",
      "Thi Công Tranh Đá",
      "Thiết Kế Và Thi Công Hoa Văn Đá",
    ],
  },
  {
    label: "SẢN PHẨM",
    href: "/vi/san-pham",
    children: [
      "Mẫu Đá",
      "Tranh Đá Hoa Văn",
      "Vật Tư Phụ - Phụ Gia",
      "Thiết Bị - Dụng Cụ Ngành Đá",
      "Khuyến Mãi - Thanh Lý",
    ],
  },
  {
    label: "CÔNG TRÌNH",
    href: "/vi/cong-trinh",
    children: [
      "Tất Cả",
      "Villa - Penhouse",
      "Khách Sạn - Trung Tâm Thương Mại",
      "Chung Cư - Nhà Phố",
      "Mẫu Bếp Ốp Đá Đẹp",
      "Mẫu Cầu Thang Ốp Đá Đẹp",
      "Mẫu Nhà Vệ Sinh Ốp Đá Đẹp",
      "Mẫu Sàn Thang Máy Ốp Đá Đẹp",
    ],
  },
  {
    label: "TIN TỨC",
    href: "/vi/tin-tuc",
    children: ["Tin nội bộ", "Xu hướng thiết kế", "Thị trường ngành đá tự nhiên"],
  },
  { label: "LIÊN HỆ", href: "/vi/lien-he" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.toggle(
      "locked",
      mobileOpen || sidebarOpen || searchOpen
    );

    return () => {
      document.body.classList.remove("locked");
    };
  }, [mobileOpen, sidebarOpen, searchOpen]);

  return (
    <>
      <div className="topbar-one">
        <div className="container-fluid">
          <div className="topbar-one__inner">
            <ul className="list-unstyled topbar-one__info">
              <li className="topbar-one__info__item">
                <FaPaperPlane />
                <a href="mailto:Pacstone.cskh@gmail.com">
                  Pacstone.cskh@gmail.com
                </a>
              </li>

              <li className="topbar-one__info__item">
                <FaPhoneAlt />
                <a href="tel:0962757475">0962.757.475</a>
              </li>

              <li className="topbar-one__info__item topbar-one__info__item--address">
                <FaMapMarkerAlt />
                <a
                  href="https://maps.app.goo.gl/nRP811R1RdDnjdrc7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  114 C Hoàng Hoa Thám, Phường Bảy Hiền, TP. HCM
                </a>
              </li>
            </ul>

            <div className="topbar-one__right">
              <div className="topbar-one__social">
                <a href="/">
                  <img
                    src="/assets/images/language/VI.png"
                    alt="VietNam"
                    className="icon-language"
                  />
                </a>
                <span>|</span>
                <a href="/">
                  <img
                    src="/assets/images/language/EN.svg"
                    alt="Eng"
                    className="icon-language"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="main-header main-header--two sticky-header sticky-header--normal">
        <div className="container-fluid">
          <div className="main-header__inner">
            <div className="main-header__logo">
              <a href="/">
                <img
                  src="/assets/images/logo-PACSTONE.webp"
                  alt="Logo P.A.C STONE"
                  className="site-logo"
                />
              </a>
            </div>

            <div className="main-header__left">
              <nav className="main-header__nav main-menu">
                <ul className="main-menu__list">
                  {menuItems.map((item, index) => (
                    <li
                      key={item.label}
                      className={`${index === 0 ? "active" : ""} ${item.children ? "dropdown" : ""
                        }`}
                    >
                      <a href={item.href} className={index === 0 ? "current" : ""}>
                        {item.label}
                      </a>

                      {item.children && (
                        <ul>
                          {item.children.map((child) => (
                            <li key={child}>
                              <a href={item.href}>{child}</a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="main-header__right">
              <button
                type="button"
                className="mobile-nav__btn mobile-nav__toggler"
                onClick={() => setMobileOpen(true)}
                aria-label="Open mobile menu"
              >
                <span />
                <span />
                <span />
              </button>

              <div className="header-icon-right">
                <a
                  href="#"
                  className="search-toggler main-header__search"
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchOpen(true);
                    setMobileOpen(false);
                  }}
                >
                  <GoSearch />
                </a>

                <a href="#" className="icon-user" aria-label="User">
                  <LuUser />
                </a>
              </div>

              <button
                type="button"
                className="main-header__sidebar-btn sidebar-btn__toggler"
                onClick={() => {
                  alert("DEBUG: sidebar button tapped");
                  console.log("DEBUG: sidebar open click");
                  setSidebarOpen(true);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  console.log("DEBUG: sidebar touchend");
                  setSidebarOpen(true);
                }}
                aria-label="Open sidebar"
              >
                <span className="main-header__sidebar-btn__box" />
                <span className="main-header__sidebar-btn__box" />
                <span className="main-header__sidebar-btn__box" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={`mobile-nav__wrapper ${mobileOpen ? "expanded" : ""}`}>
        <div
          className="mobile-nav__overlay mobile-nav__toggler"
          onClick={() => setMobileOpen(false)}
        />

        <div className="mobile-nav__content">
          <span
            className="mobile-nav__close mobile-nav__toggler"
            onClick={() => setMobileOpen(false)}
          >
            <FaTimes />
          </span>

          <div className="logo-box">
            <a href="/" aria-label="logo image">
              <img
                src="/assets/images/logo-PACSTONE.webp"
                width="155"
                alt="Logo P.A.C STONE"
              />
            </a>
          </div>

          <div className="mobile-nav__container">
            <ul className="main-menu__list">
              {menuItems.map((item) => {
                const isOpen = openDropdown === item.label;

                return (
                  <li key={item.label} className={item.children ? "dropdown" : ""}>
                    <div className="mobile-nav__item-row">
                      <a href={item.href}>{item.label}</a>

                      {item.children && (
                        <button
                          type="button"
                          aria-label="dropdown toggler"
                          className={isOpen ? "expanded" : ""}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpenDropdown(isOpen ? null : item.label);
                          }}
                        >
                          <FaAngleDown />
                        </button>
                      )}
                    </div>

                    {item.children && (
                      <ul style={{ display: isOpen ? "block" : "none" }}>
                        {item.children.map((child) => (
                          <li key={child}>
                            <a href={item.href}>{child}</a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <ul className="mobile-nav__contact list-unstyled">
            <li>
              <span className="mobile-nav__contact-icon">
                <FaPaperPlane />
              </span>
              <a href="mailto:Pacstone.cskh@gmail.com">
                Pacstone.cskh@gmail.com
              </a>
            </li>

            <li>
              <span className="mobile-nav__contact-icon">
                <FaPhoneAlt />
              </span>
              <a href="tel:0962757475">0962.757.475</a>
            </li>
          </ul>

          <div className="mobile-nav__social floens-social">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebookF />
              <span className="sr-only">Facebook</span>
            </a>

            <a href="https://zalo.me/0962757475" target="_blank" rel="noreferrer">
              <SiZalo />
              <span className="sr-only">Zalo</span>
            </a>

            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <FaYoutube />
              <span className="sr-only">Youtube</span>
            </a>
          </div>
        </div>
      </div>

      <aside className={`sidebar-one ${sidebarOpen ? "active" : ""}`}>
        <div
          className="sidebar-one__overlay sidebar-btn__toggler"
          onClick={() => setSidebarOpen(false)}
        />

        <div className="sidebar-one__content">
          <span
            className="sidebar-one__close sidebar-btn__toggler"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </span>

          <div className="sidebar-one__logo sidebar-one__item">
            <a href="/" aria-label="logo image">
              <img
                src="/assets/images/logo-PACSTONE.webp"
                width="180"
                alt="Logo P.A.C STONE"
              />
            </a>
          </div>

          <div className="sidebar-one__about sidebar-one__item">
            <p className="sidebar-one__about__text">
              P.A.C STONE chuyên thi công, thiết kế đá ốp lát cao cấp cho nhà phố,
              biệt thự, khách sạn, trung tâm thương mại và các công trình dân dụng.
            </p>
          </div>

          <div className="sidebar-one__info sidebar-one__item">
            <h4 className="sidebar-one__title">Thông tin liên hệ</h4>

            <ul className="sidebar-one__info__list">
              <li>
                <span className="sidebar-contact-icon">
                  <FaMapMarkerAlt />
                </span>
                <address>
                  114 C Hoàng Hoa Thám, Phường Bảy Hiền, TP. HCM
                </address>
              </li>

              <li>
                <span className="sidebar-contact-icon">
                  <FaPaperPlane />
                </span>
                <a href="mailto:Pacstone.cskh@gmail.com">
                  Pacstone.cskh@gmail.com
                </a>
              </li>

              <li>
                <span className="sidebar-contact-icon">
                  <FaPhoneAlt />
                </span>
                <a href="tel:0962757475">0962.757.475</a>
              </li>
            </ul>
          </div>

          <div className="sidebar-one__social floens-social sidebar-one__item">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebookF />
              <span className="sr-only">Facebook</span>
            </a>

            <a href="https://zalo.me/0962757475" target="_blank" rel="noreferrer">
              <SiZalo />
              <span className="sr-only">Zalo</span>
            </a>

            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <FaYoutube />
              <span className="sr-only">Youtube</span>
            </a>
          </div>
        </div>
      </aside>

      <div className={`search-popup ${searchOpen ? "active" : ""}`}>
        <div
          className="search-popup__overlay search-toggler"
          onClick={() => setSearchOpen(false)}
        />

        <div className="search-popup__content">
          <form
            role="search"
            method="get"
            className="search-popup__form"
            action="/vi/tim-kiem"
          >
            <input type="text" name="q" id="search" placeholder="Search Here..." />
            <button type="submit" aria-label="search submit" className="floens-btn">
              <GoSearch />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}