import { FaFacebookF, FaYoutube } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { GoSearch } from "react-icons/go";
import { LuUser } from "react-icons/lu";
import { FaPaperPlane, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
export function Header() {
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
                <a href="https://maps.app.goo.gl/nRP811R1RdDnjdrc7"
                  target="_blank"
                  rel="noopener noreferrer">
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
                  <li className="active">
                    <a href="/" className="current">
                      TRANG CHỦ
                    </a>
                  </li>

                  <li>
                    <a href="/vi/gioi-thieu">GIỚI THIỆU</a>
                  </li>

                  <li className="dropdown">
                    <a href="/vi/dich-vu">DỊCH VỤ</a>
                    <ul>
                      <li><a href="/vi/dich-vu">Thi Công Đá Ốp Mặt Tiền</a></li>
                      <li><a href="/vi/dich-vu">Thi Công Đá Ốp Cột</a></li>
                      <li><a href="/vi/dich-vu">Thi Công Đá Ốp Cầu Thang</a></li>
                      <li><a href="/vi/dich-vu">Thiết Kế Thi Công Đá Ốp Sàn Thang Máy</a></li>
                      <li><a href="/vi/dich-vu">Thi Công Đá Ốp Bếp</a></li>
                      <li><a href="/vi/dich-vu">Thi Công Tranh Đá</a></li>
                      <li><a href="/vi/dich-vu">Thiết Kế Và Thi Công Hoa Văn Đá</a></li>
                    </ul>
                  </li>

                  <li className="dropdown">
                    <a href="/vi/san-pham">SẢN PHẨM</a>
                    <ul>
                      <li><a href="/vi/san-pham">Mẫu Đá</a></li>
                      <li><a href="/vi/san-pham">Tranh Đá Hoa Văn</a></li>
                      <li><a href="/vi/san-pham">Vật Tư Phụ - Phụ Gia</a></li>
                      <li><a href="/vi/san-pham">Thiết Bị - DỤng Cụ Ngành Đá</a></li>
                      <li><a href="/vi/san-pham">Khuyến Mãi - Thanh Lý</a></li>
                    </ul>
                  </li>

                  <li className="dropdown ">
                    <a href="/vi/cong-trinh">CÔNG TRÌNH</a>
                    <ul>
                      <li><a href="/cong-trinh">Tất Cả</a></li>
                      <li><a href="/cong-trinh">Villa - Penhouse</a></li>
                      <li><a href="/cong-trinh">Khách Sạn - Trung Tâm Thương Mại</a></li>
                      <li><a href="/cong-trinh">Chung Cư - Nhà Phố</a></li>
                      <li><a href="/cong-trinh">Mẫu Bếp Ốp Đá Đẹp</a></li>
                      <li><a href="/cong-trinh">Mẫu Cầu Thang Ốp Đá Đẹp</a></li>
                      <li><a href="/cong-trinh">Mẫu Nhà Vệ Sinh Ốp Đá Đẹp</a></li>
                      <li><a href="/cong-trinh">Mẫu Sàn Thang Máy Ốp Đá Đẹp</a></li>
                    </ul>
                  </li>

                  <li className="dropdown">
                    <a href="/vi/tin-tuc">TIN TỨC</a>
                    <ul>
                      <li><a href="/vi/tin-tuc">Tin nội bộ</a></li>
                      <li><a href="/vi/tin-tuc">Xu hướng thiết kế</a></li>
                      <li><a href="/vi/tin-tuc">Thị trường ngành đá tự nhiên</a></li>
                    </ul>
                  </li>

                  <li>
                    <a href="/vi/lien-he">LIÊN HỆ</a>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="main-header__right">
              <div className="mobile-nav__btn mobile-nav__toggler">
                <span />
                <span />
                <span />
              </div>
              <div className="header-icon-right">

              <a href="#" className="search-toggler main-header__search">
                <GoSearch />
              </a>
              <a className="icon-user">
                <LuUser />
              </a>
              </div>

              {/* <button className="main-header__sidebar-btn sidebar-btn__toggler">
                <span className="main-header__sidebar-btn__box" />
                <span className="main-header__sidebar-btn__box" />
                <span className="main-header__sidebar-btn__box" />
              </button> */}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}