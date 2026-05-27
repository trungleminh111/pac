export function Header() {
  return (
    <>
      <div className="topbar-one">
        <div className="container-fluid">
          <div className="topbar-one__inner">
            <ul className="list-unstyled topbar-one__info">
              <li className="topbar-one__info__item">
                <span className="icon-paper-plane" />
                <a href="mailto:hotro@phucnam.com">hotro@phucnam.com</a>
              </li>

              <li className="topbar-one__info__item">
                <span className="icon-phone-call" />
                <a href="tel:+84909888999">0909.8888.99</a>
              </li>

              <li className="topbar-one__info__item">
                <span className="icon-location-2" />
                <address>
                  324-326 Phan Văn Hớn, Phường Tân Thới Nhất, Quận 12, TPHCM
                </address>
              </li>
            </ul>

            <div className="topbar-one__right">
              <div className="topbar-one__social">
                <a href="https://facebook.com">
                  <i className="icon-facebook" />
                  <span className="sr-only">Facebook</span>
                </a>
                <a href="https://twitter.com">
                  <i className="icon-twitter" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a href="https://youtube.com">
                  <i className="icon-youtube" />
                  <span className="sr-only">Youtube</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="main-header main-header--two sticky-header sticky-header--normal">
        <div className="container-fluid">
          <div className="main-header__inner">
            <div className="main-header__left">
              <div className="main-header__logo">
                <a href="/">
                  <img
                    src="/assets/images/logo-dark.png"
                    alt="Logo Phúc Nam"
                    width={250}
                  />
                </a>
              </div>

              <nav className="main-header__nav main-menu">
                <ul className="main-menu__list">
                  <li className="active">
                    <a href="/" className="current">
                      TRANG CHỦ
                    </a>
                  </li>

                  <li>
                    <a href="/gioi-thieu">GIỚI THIỆU</a>
                  </li>

                  <li className="dropdown">
                    <a href="/dich-vu">DỊCH VỤ</a>
                    <ul>
                      <li><a href="/dich-vu">Thi công đá ốp mặt tiền</a></li>
                      <li><a href="/dich-vu">Thi công đá ốp cột</a></li>
                      <li><a href="/dich-vu">Thi công đá ốp cầu thang</a></li>
                      <li><a href="/dich-vu">Thi công đá ốp bếp</a></li>
                      <li><a href="/dich-vu">Thi công tranh đá</a></li>
                      <li><a href="/dich-vu">Thiết kế hoa văn đá</a></li>
                    </ul>
                  </li>

                  <li className="dropdown">
                    <a href="/san-pham">SẢN PHẨM</a>
                    <ul>
                      <li><a href="/san-pham">Đá hoa cương - Granite</a></li>
                      <li><a href="/san-pham">Đá cẩm thạch - Marble</a></li>
                      <li><a href="/san-pham">Đá Onyx</a></li>
                      <li><a href="/san-pham">Đá Limestone</a></li>
                      <li><a href="/san-pham">Đá Quartzite</a></li>
                      <li><a href="/san-pham">Tranh đá</a></li>
                      <li><a href="/san-pham">Hoa văn đá</a></li>
                    </ul>
                  </li>

                  <li className="dropdown">
                    <a href="/cong-trinh">CÔNG TRÌNH</a>
                    <ul>
                      <li><a href="/cong-trinh">Villa - Penhouse</a></li>
                      <li><a href="/cong-trinh">Khách sạn - trung tâm thương mại</a></li>
                      <li><a href="/cong-trinh">Chung cư - nhà phố</a></li>
                      <li><a href="/cong-trinh">Mẫu ốp đá cầu thang đẹp</a></li>
                      <li><a href="/cong-trinh">Mẫu ốp đá bếp đẹp</a></li>
                      <li><a href="/cong-trinh">Mẫu ốp nhà vệ sinh đẹp</a></li>
                    </ul>
                  </li>

                  <li className="dropdown">
                    <a href="/tin-tuc">TIN TỨC</a>
                    <ul>
                      <li><a href="/tin-tuc">Tin nội bộ</a></li>
                      <li><a href="/tin-tuc">Xu hướng thiết kế</a></li>
                      <li><a href="/tin-tuc">Thị trường ngành đá tự nhiên</a></li>
                    </ul>
                  </li>

                  <li>
                    <a href="/lien-he">LIÊN HỆ</a>
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

              <a href="#" className="search-toggler main-header__search">
                <i className="icon-search" />
                <span className="sr-only">Search</span>
              </a>

              <button className="main-header__sidebar-btn sidebar-btn__toggler">
                <span className="main-header__sidebar-btn__box" />
                <span className="main-header__sidebar-btn__box" />
                <span className="main-header__sidebar-btn__box" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}