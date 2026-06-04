"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { FaFilePdf, FaBoxesPacking, FaCommentDots } from "react-icons/fa6";
import { SiZalo } from "react-icons/si";

type Locale = "vi" | "en";

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

function isMenuActive(pathname: string, item: DynamicMenuItem) {
  if (!item.href || item.href === "#") return false;

  const href = item.href.split("?")[0];

  if (pathname === href) return true;

  const children = getChildren(item);
  return children.some((child) => {
    const childHref = child.href.split("?")[0];
    return pathname === childHref;
  });
}

export function Header({
  locale = "vi",
  dynamicMenuItems = [],
}: HeaderProps) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const menuItems = useMemo(() => dynamicMenuItems, [dynamicMenuItems]);

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
                  {menuItems.map((item) => {
                    const children = getChildren(item);
                    const active = isMenuActive(pathname, item);

                    return (
                      <li
                        key={item.id}
                        className={`${active ? "active" : ""} ${
                          children.length > 0 ? "dropdown" : ""
                        }`}
                      >
                        <Link
                          href={item.href}
                          target={targetValue(item.target)}
                          rel={relValue(item.target)}
                           className={`menu-link text-uppercase ${active ? "current" : ""}`}
                        >
                          {item.label}
                        </Link>

                        {children.length > 0 && (
                          <ul>
                            {children.map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={child.href || item.href}
                                  target={targetValue(child.target)}
                                  rel={relValue(child.target)}
                                >
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
                const children = getChildren(item);
                const isOpen = openDropdown === item.id;

                return (
                  <li
                    key={item.id}
                    className={children.length > 0 ? "dropdown" : ""}
                  >
                    <Link
                      href={item.href}
                      target={targetValue(item.target)}
                      rel={relValue(item.target)}
                    >
                      {item.label}

                      {children.length > 0 && (
                        <button
                          type="button"
                          aria-label="dropdown toggler"
                          className={isOpen ? "expanded" : ""}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpenDropdown(isOpen ? null : item.id);
                          }}
                        >
                          <FaAngleDown />
                        </button>
                      )}
                    </Link>

                    {children.length > 0 && (
                      <ul style={{ display: isOpen ? "block" : "none" }}>
                        {children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={child.href || item.href}
                              target={targetValue(child.target)}
                              rel={relValue(child.target)}
                            >
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

        <div
          className="sidebar-one__content"
          style={{
            backgroundImage:
              "url('/assets/images/shapes/slidebar-PACSTONE.jpg')",
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
                      {locale === "vi"
                        ? "Hướng dẫn sử dụng Web"
                        : "Website User Guide"}
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
                      {locale === "vi"
                        ? "Quản lý đơn hàng"
                        : "Order Management"}
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
                    {locale === "vi"
                      ? "NHẮN TIN ZALO OA NGAY"
                      : "MESSAGE ZALO OA NOW"}
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

          <div
            className="main-footer__social floens-social"
            style={{ marginBottom: "70px" }}
          >
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
            <button
              type="submit"
              aria-label="search submit"
              className="floens-btn"
            >
              <GoSearch />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}