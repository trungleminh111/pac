"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { GoSearch } from "react-icons/go";
import { FiUser } from "react-icons/fi";
import {
  FaPaperPlane,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaYoutube,
  FaTimes,
  FaAngleDown,
} from "react-icons/fa";
import {
  FaFilePdf,
  FaBoxesPacking,
  FaCommentDots,
} from "react-icons/fa6";
import { SiZalo } from "react-icons/si";

type Locale = "vi" | "en";

type HeaderProps = {
  locale?: Locale;
};

function getMenuItems(locale: Locale) {
  if (locale === "en") {
    return [
      { label: "HOME", href: "/en" },
      { label: "ABOUT", href: "/en/about" },
      {
        label: "SERVICES",
        href: "/en/services",
        children: [
          "Facade Stone Cladding",
          "Column Stone Cladding",
          "Stair Stone Cladding",
          "Elevator Floor Stone Design & Installation",
          "Kitchen Stone Cladding",
          "Stone Artwork Installation",
          "Stone Pattern Design & Installation",
        ],
      },
      {
        label: "PRODUCTS",
        href: "/en/products",
        children: [
          "Stone Samples",
          "Stone Artwork & Patterns",
          "Accessories & Additives",
          "Stone Tools & Equipment",
          "Promotions & Clearance",
        ],
      },
      {
        label: "PROJECTS",
        href: "/en/projects",
        children: [
          "All",
          "Villa - Penthouse",
          "Hotel - Shopping Mall",
          "Apartment - Townhouse",
          "Kitchen Stone Designs",
          "Stair Stone Designs",
          "Bathroom Stone Designs",
          "Elevator Floor Stone Designs",
        ],
      },
      {
        label: "NEWS",
        href: "/en/news",
        children: ["Company News", "Design Trends", "Natural Stone Market"],
      },
      { label: "CONTACT", href: "/en/contact" },
    ];
  }

  return [
    { label: "TRANG CHỦ", href: "/vi" },
    { label: "GIỚI THIỆU", href: "/vi/gioi-thieu" },
    {
      label: "DỊCH VỤ",
      href: "/vi/dich-vu",
      children: [
        "Thi công ốp đá mặt tiền",
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
}

export function Header({ locale = "vi" }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const menuItems = useMemo(() => getMenuItems(locale), [locale]);

  const homeHref = locale === "vi" ? "/vi" : "/en";
  const viHref = "/vi";
  const enHref = "/en";

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
                <a href="mailto:Pacstone.cskh@gmail.com">Pacstone.cskh@gmail.com</a>
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
                <Link href={viHref}>
                  <img
                    src="/assets/images/language/VI.png"
                    alt="Vietnamese"
                    className="icon-language"
                  />
                </Link>
                <span>|</span>
                <Link href={enHref}>
                  <img
                    src="/assets/images/language/EN.svg"
                    alt="English"
                    className="icon-language"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="main-header main-header--two sticky-header sticky-header--normal">
        <div className="container-fluid">
          <div className="main-header__inner">
            <div className="main-header__logo">
              <Link href={homeHref}>
                <img
                  src="/assets/images/logo-PACSTONE.webp"
                  alt="Logo P.A.C STONE"
                  className="site-logo"
                />
              </Link>
            </div>

            <div className="main-header__left">
              <nav className="main-header__nav main-menu">
                <ul className="main-menu__list">
                  {menuItems.map((item, index) => (
                    <li
                      key={item.label}
                      className={`${index === 0 ? "active" : ""} ${
                        item.children ? "dropdown" : ""
                      }`}
                    >
                      <Link
                        href={item.href}
                        className={index === 0 ? "current" : ""}
                      >
                        {item.label}
                      </Link>

                      {item.children && (
                        <ul>
                          {item.children.map((child) => (
                            <li key={child}>
                              <Link href={item.href}>{child}</Link>
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
              <div
                className="mobile-nav__btn mobile-nav__toggler"
                onClick={() => setMobileOpen(true)}
              >
                <span />
                <span />
                <span />
              </div>

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

                <a
                  href="#"
                  className="icon-user"
                  style={{ color: "var(--floens-black, #000)" }}
                  onClick={(e) => {
                    e.preventDefault();
                    setSidebarOpen(true);
                  }}
                  aria-label="Open sidebar"
                >
                  <FiUser />
                </a>
              </div>
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
            <Link href={homeHref} aria-label="logo image">
              <img
                src="/assets/images/logo-PACSTONE.webp"
                width="155"
                alt="Logo P.A.C STONE"
              />
            </Link>
          </div>

          <div className="mobile-nav__container">
            <ul className="main-menu__list">
              {menuItems.map((item) => {
                const isOpen = openDropdown === item.label;

                return (
                  <li key={item.label} className={item.children ? "dropdown" : ""}>
                    <Link href={item.href}>
                      {item.label}

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
                    </Link>

                    {item.children && (
                      <ul style={{ display: isOpen ? "block" : "none" }}>
                        {item.children.map((child) => (
                          <li key={child}>
                            <Link href={item.href}>{child}</Link>
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
              <a href="mailto:Pacstone.cskh@gmail.com">Pacstone.cskh@gmail.com</a>
            </li>

            <li>
              <span className="mobile-nav__contact-icon">
                <FaPhoneAlt />
              </span>
              <a href="tel:0962757475">0962.757.475</a>
            </li>
          </ul>

          <div className="main-footer__social floens-social">
            <a href="https://facebook.com" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://zalo.me" aria-label="Zalo">
              <SiZalo />
            </a>
            <a href="https://youtube.com" aria-label="Youtube">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      <aside className={`sidebar-one ${sidebarOpen ? "active" : ""}`}>
        <div
          className="sidebar-one__overlay sidebar-btn__toggler"
          onClick={() => setSidebarOpen(false)}
        />

        <div
          className="sidebar-one__content"
          style={{
            backgroundImage: "url('/assets/images/shapes/slidebar-PACSTONE.jpg')",
          }}
        >
          <span
            className="sidebar-one__close sidebar-btn__toggler"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </span>

          <div className="sidebar-one__logo sidebar-one__item mb-4">
            <Link
              href={homeHref}
              aria-label="logo image"
              className="d-flex justify-content-center align-items-center w-100"
            >
              <img
                src="/assets/images/logo-PACSTONE.webp"
                className="img-fluid mx-auto d-block"
                style={{ maxWidth: "180px", width: "100%" }}
                alt="Logo P.A.C STONE"
              />
            </Link>
          </div>

          <div className="sidebar-one__menu-utilities sidebar-one__item">
            <ul className="sidebar-util-list">
              <li>
                <Link
                  href="/assets/documents/huong-dan-su-dung.pdf"
                  target="_blank"
                  className="sidebar-util-link"
                >
                  <div className="util-icon-box pdf-type">
                    <FaFilePdf />
                  </div>
                  <div className="util-text-box">
                    <span className="util-title">
                      {locale === "vi" ? "Hướng dẫn sử dụng Web" : "Website User Guide"}
                    </span>
                    <span className="util-badge">
                      {locale === "vi" ? "Tải xuống PDF" : "Download PDF"}
                    </span>
                  </div>
                </Link>
              </li>

              <li>
                <div className="sidebar-util-link disabled-item">
                  <div className="util-icon-box">
                    <FaBoxesPacking />
                  </div>
                  <div className="util-text-box">
                    <span className="util-title">
                      {locale === "vi" ? "Quản lý đơn hàng" : "Order Management"}
                    </span>
                    <span className="util-badge development">
                      {locale === "vi" ? "Phát triển sau" : "Coming soon"}
                    </span>
                  </div>
                </div>
              </li>

              <li>
                <Link
                  href="/assets/documents/ho-so-phap-ly-pac-stone.pdf"
                  target="_blank"
                  className="sidebar-util-link"
                >
                  <div className="util-icon-box pdf-type">
                    <FaFilePdf />
                  </div>
                  <div className="util-text-box">
                    <span className="util-title">
                      {locale === "vi"
                        ? "Hồ sơ pháp lý P.A.C STONE"
                        : "P.A.C STONE Legal Profile"}
                    </span>
                    <span className="util-badge">
                      {locale === "vi" ? "Tải xuống PDF" : "Download PDF"}
                    </span>
                  </div>
                </Link>
              </li>

              <li className="mt-2">
                <Link
                  href="https://zalo.me/YOUR_ZALO_OA_ID"
                  target="_blank"
                  className="sidebar-util-zalo-btn"
                >
                  <FaCommentDots className="zalo-btn-icon" />
                  <span>
                    {locale === "vi" ? "NHẮN TIN ZALO OA NGAY" : "MESSAGE ZALO OA NOW"}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-one__info sidebar-one__item">
            <h4 className="sidebar-one__title">
              {locale === "vi" ? "Thông tin liên hệ" : "Contact Information"}
            </h4>

            <ul className="sidebar-one__info__list">
              <li>
                <span className="sidebar-contact-icon">
                  <FaMapMarkerAlt />
                </span>
                <address>114 C Hoàng Hoa Thám, Phường Bảy Hiền, TP. HCM</address>
              </li>

              <li>
                <span className="sidebar-contact-icon">
                  <FaPaperPlane />
                </span>
                <a href="mailto:Pacstone.cskh@gmail.com">Pacstone.cskh@gmail.com</a>
              </li>

              <li>
                <span className="sidebar-contact-icon">
                  <FaPhoneAlt />
                </span>
                <a href="tel:0962757475">0962.757.475</a>
              </li>
            </ul>
          </div>

          <div className="main-footer__social floens-social" style={{ marginBottom: "70px" }}>
            <a href="https://facebook.com" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://zalo.me" aria-label="Zalo">
              <SiZalo />
            </a>
            <a href="https://youtube.com" aria-label="Youtube">
              <FaYoutube />
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
            action={locale === "vi" ? "/vi/tim-kiem" : "/en/search"}
          >
            <input
              type="text"
              name="q"
              id="search"
              placeholder={locale === "vi" ? "Tìm kiếm..." : "Search here..."}
            />
            <button type="submit" aria-label="search submit" className="floens-btn">
              <GoSearch />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}