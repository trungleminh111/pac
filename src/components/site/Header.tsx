"use client";

import { useEffect, useState } from "react";
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
import Link from "next/link";
import {
  FaFilePdf,
  FaBoxesPacking,
  FaScaleBalanced,
  FaUserShield,
  FaCommentDots
} from "react-icons/fa6";
import { SiZalo } from "react-icons/si";

const menuItems = [
  { label: "TRANG CHỦ", href: "/" },
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

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [fileName, setFileName] = useState("File thiết kế của bạn (Nếu có)");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };
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

                <a href="#" className="icon-user"
                  type="button"
                  style={{ color: "var(--floens-black, #000)" }}
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open sidebar">

                  <FiUser />
                </a>
              </div>

              {/* <button
                type="button"
                className="main-header__sidebar-btn sidebar-btn__toggler"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <span className="main-header__sidebar-btn__box" />
                <span className="main-header__sidebar-btn__box" />
                <span className="main-header__sidebar-btn__box" />
              </button> */}
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
                    <a href={item.href}>
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
                    </a>

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

        <div className="sidebar-one__content " style={{
          backgroundImage: "url('/assets/images/shapes/slidebar-PACSTONE.jpg')",
        }}>
          <span
            className="sidebar-one__close sidebar-btn__toggler"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </span>

          <div className="sidebar-one__logo sidebar-one__item mb-4">
            <a
              href="/"
              aria-label="logo image"
              className="d-flex justify-content-center align-items-center w-100"
            >
              <img
                src="/assets/images/logo-PACSTONE.webp"
                className="img-fluid mx-auto d-block"
                style={{
                  maxWidth: "180px",
                  width: "100%",
                }}
                alt="Logo P.A.C STONE"
              />
            </a>
          </div>

          <div className="sidebar-one__menu-utilities sidebar-one__item">
            <ul className="sidebar-util-list">

              {/* 1. Hướng dẫn sử dụng web */}
              <li>
                <Link href="/assets/documents/huong-dan-su-dung.pdf" target="_blank" className="sidebar-util-link">
                  <div className="util-icon-box pdf-type">
                    <FaFilePdf />
                  </div>
                  <div className="util-text-box">
                    <span className="util-title">Hướng dẫn sử dụng Web</span>
                    <span className="util-badge">Tải xuống PDF</span>
                  </div>
                </Link>
              </li>

              {/* 2. Quản lý đơn hàng */}
              <li>
                <div className="sidebar-util-link disabled-item">
                  <div className="util-icon-box">
                    <FaBoxesPacking />
                  </div>
                  <div className="util-text-box">
                    <span className="util-title">Quản lý đơn hàng</span>
                    <span className="util-badge development">Phát triển sau</span>
                  </div>
                </div>
              </li>

              {/* 3. Hồ sơ pháp lý */}
              <li>
                <Link href="/assets/documents/ho-so-phap-ly-pac-stone.pdf" target="_blank" className="sidebar-util-link">
                  <div className="util-icon-box pdf-type">
                    <FaFilePdf />
                  </div>
                  <div className="util-text-box">
                    <span className="util-title">Hồ sơ pháp lý P.A.C STONE</span>
                    <span className="util-badge">Tải xuống PDF</span>
                  </div>
                </Link>
              </li>


              {/* 5. Nút Zalo OA */}
              <li className="mt-2">
                <Link href="https://zalo.me/YOUR_ZALO_OA_ID" target="_blank" className="sidebar-util-zalo-btn">
                  <FaCommentDots className="zalo-btn-icon" />
                  <span>NHẮN TIN ZALO OA NGAY</span>
                </Link>
              </li>

            </ul>
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