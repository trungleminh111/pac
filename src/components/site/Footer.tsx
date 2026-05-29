import { FaPaperPlane, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
export function Footer() {
  return (
    <footer className="main-footer">
      <div
        className="main-footer__bg"
        style={{
          backgroundImage: "url('/assets/images/shapes/Footer-PACSTONE.png')",
        }}
      />


      <div className="main-footer__top">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-xl-2 col-md-2 col-lg-3">
              <div className="footer-widget footer-widget--about">
                <a href="/" className="footer-widget__logo">

                  <img
                    src="/assets/images/logo-PACSTONE.webp"
                    alt="Logo P.A.C STONE"
                    width={210}
                  />
                </a>

                <p className="footer-widget__about-text">
                  © Bản quyền 2026 thuộc về
                 {"\n"}
                  CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ XÂY DỰNG
                  {"\n"}
                  P.A.C STONE
                </p>
              </div>
            </div>

            <div className="col-xl-2 col-lg-2 col-md-2 col-sm-6">
              <div className="footer-widget footer-widget--links footer-widget--links-one">
                <div className="footer-widget__top">
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

            <div className="col-xl-4 col-lg-3 col-md-3 col-sm-6">
              <div className="footer-widget footer-widget--links footer-widget--links-two">
                <div className="footer-widget__top">
                  <h2 className="footer-widget__title">Dịch vụ</h2>
                </div>
                <ul className="list-unstyled footer-widget__links">
                  <li><a href="/dich-vu">Thi Công Đá Ốp Mặt Tiền</a></li>
                  <li><a href="/dich-vu">Thi Công Đá Ốp Cột</a></li>
                  <li><a href="/dich-vu">Thi Công Đá Ốp Cầu Thang </a></li>
                  <li><a href="/dich-vu">Thiết Kế Thi Công Đá Ốp Sàn Thang Máy</a></li>
                  <li><a href="/dich-vu">Thi Công Đá Ốp Bếp</a></li>
                  <li><a href="/dich-vu">Thi Công Tranh Đá</a></li>
                  <li><a href="/dich-vu">Thiết Kế Và Thi Công Hoa Văn Đá</a></li>
                </ul>
              </div>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="footer-widget footer-widget--contact">
                <div className="footer-widget__top">
                  <h2 className="footer-widget__title footer-widget__title_info">Liên hệ</h2>
                </div>
                <div className="footer-gap-bottom">
                  <ul className="list-unstyled footer-widget__links footer-widget__info ">
                    <li>

                      <FaMapMarkerAlt className="icon-location-2" />
                      <a href="https://www.google.com/maps" className="font-weight-800">
                        Trụ sở chính: 114C Hoàng Hoa Thám, Phường Bảy Hiền, TP. HCM
                      </a>
                    </li>
                    <li>
                      <FaMapMarkerAlt className="icon-location-2" />
                      <a href="https://www.google.com/maps" className="font-weight-800">
                        Nhà máy sản xuất: 324 Phan Văn Hớn,
                        Phường Đông Hưng Thuận, TPHCM
                      </a>
                    </li>
                    <li>
                      <FaPaperPlane className="icon-location-2" />
                      <a href="mailto:pacstone.cskh@gmail.com">pacstone.cskh@gmail.com</a>
                    </li>
                    <li>
                      <FaPhoneAlt className="icon-location-2" />
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}