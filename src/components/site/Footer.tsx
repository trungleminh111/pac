export function Footer() {
  return (
    <footer className="main-footer">
      <div
        className="main-footer__bg"
        style={{
          backgroundImage: "url('/assets/images/shapes/footer-bg-1-1.png')",
        }}
      />

      <div className="main-footer__top">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-6">
              <div className="footer-widget footer-widget--about">
                <a href="/" className="footer-widget__logo">
                  <img
                    src="/assets/images/logo-light.png"
                    width={250}
                    alt="Logo Phúc Nam"
                  />
                </a>

                <p className="footer-widget__about-text">
                  Công ty Cổ phần Đá quốc tế Phúc Nam là một trong những nhà
                  cung cấp hàng đầu tại Việt Nam về các sản phẩm và giải pháp
                  ốp lát đá cao cấp được nhập khẩu từ các quốc gia có nền công
                  nghiệp đá phát triển như Italy, Tây Ban Nha, và Brazil.
                </p>
              </div>
            </div>

            <div className="col-xl-2 col-lg-2 col-md-3 col-sm-6">
              <div className="footer-widget footer-widget--links footer-widget--links-one">
                <div className="footer-widget__top">
                  <div className="footer-widget__title-box" />
                  <h2 className="footer-widget__title">Truy cập</h2>
                </div>

                <ul className="list-unstyled footer-widget__links">
                  <li><a href="/gioi-thieu">Giới thiệu</a></li>
                  <li><a href="/dich-vu">Dịch vụ</a></li>
                  <li><a href="/san-pham">Sản phẩm</a></li>
                  <li><a href="/cong-trinh">Công trình</a></li>
                  <li><a href="/tin-tuc">Tin tức</a></li>
                  <li><a href="/lien-he">Liên hệ</a></li>
                </ul>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6">
              <div className="footer-widget footer-widget--links footer-widget--links-two">
                <div className="footer-widget__top">
                  <div className="footer-widget__title-box" />
                  <h2 className="footer-widget__title">Dịch vụ</h2>
                </div>

                <ul className="list-unstyled footer-widget__links">
                  <li><a href="/dich-vu">Thi công đá ốp mặt tiền</a></li>
                  <li><a href="/dich-vu">Thi công đá ốp cột</a></li>
                  <li><a href="/dich-vu">Thi công đá ốp cầu thang</a></li>
                  <li><a href="/dich-vu">Thi công đá ốp bếp</a></li>
                  <li><a href="/dich-vu">Thi công tranh đá</a></li>
                  <li><a href="/dich-vu">Thiết kế hoa văn đá</a></li>
                </ul>
              </div>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="footer-widget footer-widget--contact">
                <div className="footer-widget__top">
                  <div className="footer-widget__title-box" />
                  <h2 className="footer-widget__title">Liên hệ</h2>
                </div>

                <ul className="list-unstyled footer-widget__info">
                  <li>
                    <span className="icon-location-2" />
                    <a href="https://www.google.com/maps">
                      324-326 Phan Văn Hớn, Phường Tân Thới Nhất, Quận 12,
                      TPHCM
                    </a>
                  </li>
                  <li>
                    <span className="icon-paper-plane" />
                    <a href="mailto:hotro@phucnam.com">hotro@phucnam.com</a>
                  </li>
                  <li>
                    <span className="icon-phone-call" />
                    <a href="tel:+84909888899">0909.8888.99</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-footer__bottom">
        <div className="container">
          <div className="main-footer__bottom__inner">
            <div className="row gutter-y-30 align-items-center">
              <div className="col-md-5">
                <div className="main-footer__social floens-social">
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

              <div className="col-md-7">
                <div className="main-footer__bottom__copyright">
                  <p className="main-footer__copyright">
                    © Bản quyền 2026 thuộc về Công ty cổ phần đá quốc tế Phúc Nam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}