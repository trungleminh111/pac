"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoSearch } from "react-icons/go";
import { FiUser, FiShoppingCart } from "react-icons/fi";
import { MdMailOutline } from "react-icons/md";
import { CartDrawer } from "@/components/site/cart/CartDrawer";
import {
  FaPaperPlane,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaYoutube,
  FaTimes,
  FaAngleDown,
} from "react-icons/fa";
import { FaFilePdf, FaBoxesPacking, FaCommentDots } from "react-icons/fa6";
import { SiZalo } from "react-icons/si";
import React from 'react';
import { LuUpload } from 'react-icons/lu';
import { IoClose } from 'react-icons/io5';

type Locale = "vi" | "en";

type CartDrawerItem = {
  id: string;
  title: string;
  image: string;
  price: string;
  quantity: number;
};

type DynamicMenuItem = {
  id: string;
  label: string;
  href: string;
  target?: string | null;
  children?: DynamicMenuItem[];
};

type HeaderProps = {
  locale?: Locale;
  dynamicMenuItems?: DynamicMenuItem[];
  cartItems?: CartDrawerItem[];
  cartTotal?: string;
  isLoggedIn?: boolean;
};

function getChildren(item: DynamicMenuItem) {
  return item.children || [];
}

function targetValue(target?: string | null) {
  return target === "_blank" ? "_blank" : undefined;
}

function relValue(target?: string | null) {
  return target === "_blank" ? "noopener noreferrer" : undefined;
}

function cleanPath(url: string) {
  return url.split("?")[0].replace(/\/$/, "");
}

function isMenuActive(pathname: string, item: DynamicMenuItem) {
  const currentPath = cleanPath(pathname);
  const itemPath = cleanPath(item.href || "#");

  if (!itemPath || itemPath === "#") return false;
  if (currentPath === itemPath) return true;

  return getChildren(item).some((child) => {
    const childPath = cleanPath(child.href || "#");
    return currentPath === childPath || currentPath.startsWith(`${childPath}/`);
  });
}
function productListHref(locale: Locale) {
  return locale === "vi" ? "/vi/san-pham" : "/en/products";
}

export function Header({
  locale = "vi",
  dynamicMenuItems = [],
  cartItems = [],
  cartTotal = "0đ",
  isLoggedIn = false,
}: HeaderProps) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const menuItems = useMemo(() => dynamicMenuItems, [dynamicMenuItems]);

  const homeHref = locale === "vi" ? "/vi" : "/en";
  const viHref = "/vi";
  const enHref = "/en";
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    // Khóa cuộn trang khi mở bất kỳ popup/sidebar nào
    document.body.classList.toggle(
      "locked",
      mobileOpen || sidebarOpen || searchOpen || isOpen
    );

    return () => {
      document.body.classList.remove("locked");
    };
  }, [mobileOpen, sidebarOpen, searchOpen, isOpen]);
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      {/* 1. TOPBAR */}
      <div className="topbar-one">
        <div className="container-fluid">
          <div className="topbar-one__inner">
            <ul className="list-unstyled topbar-one__info">
              <li className="topbar-one__info__item">
                <MdMailOutline />
                <a href="mailto:Pacstone.cskh@gmail.com">Pacstone.cskh@gmail.com</a>
              </li>
              <li className="topbar-one__info__item">
                <FaPhoneAlt />
                <a href="tel:0962757475">0962.757.475</a>
              </li>
              <li className="topbar-one__info__item topbar-one__info__item--address">
                <FaMapMarkerAlt />
                <a href="https://maps.app.goo.gl/nRP811R1RdDnjdrc7" target="_blank" rel="noopener noreferrer">
                  114 C Hoàng Hoa Thám, Phường Bảy Hiền, TP. HCM
                </a>
              </li>
            </ul>
            <div className="topbar-one__right">
              <div className="topbar-one__social">
                <Link href={viHref}>
                  <img src="/assets/images/language/VI.png" alt="Vietnamese" className="icon-language" />
                </Link>
                <span>|</span>
                <Link href={enHref}>
                  <img src="/assets/images/language/EN.svg" alt="English" className="icon-language" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header
        className={`main-header main-header--two ${isSticky ? "main-header--sticky" : ""
          }`}
      >
        <div className="container-fluid">
          <div className="main-header__inner">
            <div className="main-header__logo">
              <Link href={homeHref}>
                <img src="/assets/images/logo-PACSTONE.webp" alt="Logo P.A.C STONE" className="site-logo" />
              </Link>
            </div>
            <div className="main-header__left">
              <nav className="main-header__nav main-menu">
                <ul className="main-menu__list">
                  {menuItems.map((item) => {
                    const children = getChildren(item);
                    const active = isMenuActive(pathname, item);
                    return (
                      <li key={item.id} className={`${active ? "active" : ""} ${children.length > 0 ? "dropdown" : ""}`}>
                        <Link href={item.href} target={targetValue(item.target)} rel={relValue(item.target)} className={`menu-link text-uppercase ${active ? "current" : ""}`}>
                          {item.label}
                        </Link>
                        {children.length > 0 && (
                          <ul>
                            {children.map((child) => (
                              <li key={child.id}>
                                <Link href={child.href || item.href} target={targetValue(child.target)} rel={relValue(child.target)}>
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
            <div className="main-header__right">
              <div className="mobile-nav__btn mobile-nav__toggler" onClick={() => setMobileOpen(true)}>
                <span /><span /><span />
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

                <CartDrawer
                  items={cartItems}
                  total={cartTotal}
                  cartHref={locale === "vi" ? "/vi/gio-hang" : "/en/gio-hang"}
                  checkoutHref={locale === "vi" ? "/vi/thanh-toan" : "/en/thanh-toan"}
                  isLoggedIn={isLoggedIn}
                  loginHref={locale === "vi" ? "/login" : "/login"}
                />

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

      {/* 3. MOBILE NAVIGATION */}
      <div className={`mobile-nav__wrapper ${mobileOpen ? "expanded" : ""}`}>
        <div className="mobile-nav__overlay mobile-nav__toggler" onClick={() => setMobileOpen(false)} />
        <div className="mobile-nav__content" style={{ backgroundImage: "url('/assets/images/shapes/slidebar-PACSTONE.jpg')" }}>
          <span className="mobile-nav__close mobile-nav__toggler" onClick={() => setMobileOpen(false)}><FaTimes /></span>
          <div className="logo-box">
            <Link href={homeHref} aria-label="logo image">
              <img src="/assets/images/logo-PACSTONE.webp" width="155" alt="Logo P.A.C STONE" />
            </Link>
          </div>
          <div className="mobile-nav__container">
            <ul className="main-menu__list">
              {menuItems.map((item) => {
                const children = getChildren(item);
                const isOpenDropdown = openDropdown === item.id;
                return (
                  <li key={item.id} className={children.length > 0 ? "dropdown" : ""}>
                    <Link href={item.href} target={targetValue(item.target)} rel={relValue(item.target)}>
                      {item.label}
                      {children.length > 0 && (
                        <button type="button" aria-label="dropdown toggler" className={isOpenDropdown ? "expanded" : ""} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenDropdown(isOpenDropdown ? null : item.id); }}>
                          <FaAngleDown />
                        </button>
                      )}
                    </Link>
                    {children.length > 0 && (
                      <ul style={{ display: isOpenDropdown ? "block" : "none" }}>
                        {children.map((child) => (
                          <li key={child.id}>
                            <Link href={child.href || item.href} target={targetValue(child.target)} rel={relValue(child.target)}>
                              {child.label}
                            </Link>
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
            <li><span className="mobile-nav__contact-icon"><MdMailOutline /></span><a href="mailto:Pacstone.cskh@gmail.com">Pacstone.cskh@gmail.com</a></li>
            <li><span className="mobile-nav__contact-icon"><FaPhoneAlt /></span><a href="tel:0962757475">0962.757.475</a></li>
          </ul>
          <div className="main-footer__social floens-social">
            <a href="https://www.facebook.com/dahoacuongpac?rdid=cxhxaMBS0BOL3mV7&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18fuq8z3U5%2F#" target="_blank" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://zalo.me" aria-label="Zalo"><SiZalo /></a>
            <a href="https://youtube.com" aria-label="Youtube"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* 4. SIDEBAR RIGHT */}
      <aside className={`sidebar-one ${sidebarOpen ? "active" : ""}`}>
        <div className="sidebar-one__overlay sidebar-btn__toggler" onClick={() => setSidebarOpen(false)} />
        <div className="sidebar-one__content" style={{ backgroundImage: "url('/assets/images/shapes/slidebar-PACSTONE.jpg')" }}>
          <span className="sidebar-one__close sidebar-btn__toggler" onClick={() => setSidebarOpen(false)}><FaTimes /></span>
          <div className="sidebar-one__logo sidebar-one__item mb-4">
            <Link href={homeHref} aria-label="logo image" className="d-flex justify-content-center align-items-center w-100">
              <img src="/assets/images/logo-PACSTONE.webp" className="img-fluid mx-auto d-block" style={{ maxWidth: "180px", width: "100%" }} alt="Logo P.A.C STONE" />
            </Link>
          </div>

          <div className="sidebar-one__menu-utilities sidebar-one__item">
            <ul className="sidebar-util-list">
              <li>
                <Link href="/assets/documents/huong-dan-su-dung.pdf" target="_blank" className="sidebar-util-link">
                  <div className="util-icon-box pdf-type"><FaFilePdf /></div>
                  <div className="util-text-box">
                    <span className="util-title">{locale === "vi" ? "Hướng dẫn sử dụng Web" : "Website User Guide"}</span>
                    <span className="util-badge">{locale === "vi" ? "Tải xuống PDF" : "Download PDF"}</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href={locale === "vi" ? "/vi/tai-khoan/ho-so" : "/en/tai-khoan/ho-so"}
                  className="sidebar-util-link"
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="util-icon-box">
                    <FiUser />
                  </div>
                  <div className="util-text-box">
                    <span className="util-title">
                      {locale === "vi" ? "Tài khoản của tôi" : "My Account"}
                    </span>
                    <span className="util-badge">
                      {locale === "vi" ? "Xem hồ sơ" : "View Account"}
                    </span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/assets/files/PAC-certificates.rar" target="_blank" className="sidebar-util-link">
                  <div className="util-icon-box pdf-type"><FaFilePdf /></div>
                  <div className="util-text-box">
                    <span className="util-title">{locale === "vi" ? "Hồ sơ pháp lý P.A.C STONE" : "P.A.C STONE Legal Profile"}</span>
                    <span className="util-badge">{locale === "vi" ? "Tải xuống PDF" : "Download PDF"}</span>
                  </div>
                </Link>
              </li>
              {isLoggedIn ? (
                <li>
                  <Link
                    href={
                      locale === "vi"
                        ? "/api/auth/signout?callbackUrl=/vi"
                        : "/api/auth/signout?callbackUrl=/en"
                    }
                    className="sidebar-util-link"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="util-icon-box">
                      <FiUser />
                    </div>
                    <div className="util-text-box">
                      <span className="util-title">
                        {locale === "vi" ? "Đăng xuất" : "Logout"}
                      </span>
                      <span className="util-badge">
                        {locale === "vi" ? "Thoát tài khoản" : "Sign out"}
                      </span>
                    </div>
                  </Link>
                </li>
              ) : (
                <></>
              )}
              <li className="mt-3">
                <button onClick={() => { setSidebarOpen(false); openModal(); }} className=" sidebar-util-zalo-btn w-100 open-popup-btn" style={{ padding: "12px 25px", backgroundColor: "var(--floens-base, #c7844f)" }}>
                  <span>{locale === "vi" ? "LIÊN HỆ NGAY" : "CONTACT NOW"}</span>
                </button>
              </li>
              {/* <li className="mt-2">
                <Link href="https://zalo.me/YOUR_ZALO_OA_ID" target="_blank" className="sidebar-util-zalo-btn">
                  <FaCommentDots className="zalo-btn-icon" />
                  <span>{locale === "vi" ? "NHẮN TIN ZALO OA NGAY" : "MESSAGE ZALO OA NOW"}</span>
                </Link>
              </li> */}
            </ul>
          </div>

          <div className="sidebar-one__info sidebar-one__item">
            <h4 className="sidebar-one__title">{locale === "vi" ? "Thông tin liên hệ" : "Contact Information"}</h4>
            <ul className="sidebar-one__info__list">
              <li><span className="sidebar-contact-icon"><FaMapMarkerAlt /></span><a href="#" className="location">114 C Hoàng Hoa Thám, Phường Bảy Hiền, TP. HCM</a></li>
              <li><span className="sidebar-contact-icon"><MdMailOutline /></span><a href="mailto:Pacstone.cskh@gmail.com" className="mail">Pacstone.cskh@gmail.com</a></li>
              <li><span className="sidebar-contact-icon"><FaPhoneAlt /></span><a href="tel:0962757475" className="phone">0962.757.475</a></li>
            </ul>
          </div>

          <div className="main-footer__social floens-social" style={{ marginBottom: "70px" }}>
            <a href="https://www.facebook.com/dahoacuongpac?rdid=cxhxaMBS0BOL3mV7&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18fuq8z3U5%2F#" target="_blank" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://zalo.me" aria-label="Zalo"><SiZalo /></a>
            <a href="https://youtube.com" aria-label="Youtube"><FaYoutube /></a>
          </div>
        </div>
      </aside>

      {/* 5. SEARCH POPUP */}
      <div className={`search-popup ${searchOpen ? "active" : ""}`}>
        <div className="search-popup__overlay search-toggler" onClick={() => setSearchOpen(false)} />
        <div className="search-popup__content">
          <form role="search" method="get" className="search-popup__form" action={productListHref(locale)}>
            <input type="text" name="q" id="search" placeholder={locale === "vi" ? "Tìm kiếm..." : "Search here..."} />
            <button type="submit" aria-label="search submit" className="floens-btn"><GoSearch /></button>
          </form>
        </div>
      </div>

      {isOpen && (
        <div className="custom-popup-overlay" onClick={closeModal}>
          <div className="custom-popup-content" onClick={(e) => e.stopPropagation()}>

            {/* Nút Đóng (X) */}
            <button className="custom-popup-close-btn" onClick={closeModal} aria-label="Close popup">
              <IoClose size={26} />
            </button>

            {/* Khung Form nhận UI từ template gốc của bạn */}
            <form className="contact-one__form contact-form-validated form-one" style={{ margin: 0, padding: "40px 30px" }}>
              <div
                className="contact-one__form__bg"
                style={{
                  backgroundImage: "url('/assets/images/shapes/contact-info-form-bg.png')",
                }}
              />

              <div className="contact-one__form__top">
                <h2 className="contact-one__form__title">
                  Gửi tin nhắn cho chúng tôi
                </h2>
              </div>

              <div className="form-one__group form-one__group--grid">
                <div className="form-one__control form-one__control--input form-one__control--full">
                  <input type="text" name="name" placeholder="Họ và tên" required />
                </div>

                <div className="form-one__control form-one__control--full">
                  <input type="email" name="email" placeholder="Email" required />
                </div>

                <div className="form-one__control form-one__control--full">
                  <input type="text" name="phone" placeholder="Điện thoại" required />
                </div>

                <div className="form-one__control form-one__control--mesgae form-one__control--full">
                  <textarea name="message" placeholder="Nội dung" rows={4} />
                  <div className="button-upload">
                    <button type="button">
                      File thiết kế của bạn (Nếu có) <LuUpload />
                    </button>
                  </div>
                </div>

                <div className="form-one__control form-one__control--full">
                  <button type="submit" className="floens-btn">
                    <span>Gửi nội dung</span>
                    <i className="icon-right-arrow sm-none">→</i>
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}