import { FaPaperPlane, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
export function Footer() {
    return (
        <footer className="main-footer">
            <div className="main-footer__bg"
                style={{
                    backgroundImage: "url('/assets/images/shapes/Footer-PACSTONE.png')",


                }}
            />
            <div className="main-footer__top">
                <div className="row align-items-start">
                    <div className="col-lg-3 col-md-3 col-10 pe-0 col-logo">
                        <div className="footer-widget footer-widget--about">
                            <a href="/" className="footer-widget__logo">

                                <img
                                    src="/assets/images/P.A.C stone_logo.png"
                                    alt="Logo P.A.C STONE"
                                    className="footer-logo"
                                ></img>
                            </a>

                            <p className="footer-widget__about-text">
                                © Bản quyền 2026 thuộc về
                                <br />

                                <span className="nowrap company-name">
                                    CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ XÂY DỰNG
                                </span>

                                <br />

                                P.A.C STONE
                            </p>
                        </div>
                    </div>

                    <div className="padding-left-3 col-lg-2 col-md-2 d-none d-md-block">
                        <div className="text-nowrap">
                            <div className="">
                                <h4 className="footer-widget__title">Truy cập</h4>
                            </div>
                            <ul className="list-unstyled text-capitalize">
                                <li><a href="/vi/gioi-thieu">Giới thiệu</a></li>
                                <li><a href="/vi/dich-vu">Dịch vụ</a></li>
                                <li><a href="/vi/san-pham">Sản phẩm</a></li>
                                <li><a href="/vi/cong-trinh">Công trình</a></li>
                                <li><a href="/vi/tin-tuc">Tin tức</a></li>
                                <li><a href="/vi/lien-he">Liên hệ</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="padding-left-2 col-lg-4 col-md-4 d-none d-md-block">
                        <div className="text-nowrap">
                            <div className="footer-widget__top">
                                <h4 className="footer-widget__title">Dịch vụ</h4>
                            </div>
                            <ul className="list-unstyled footer-widget__links text-capitalize">
                                <li><a href="/vi/dich-vu">Thi công Đá Ốp Mặt Tiền</a></li>
                                <li><a href="/vi/dich-vu">Thi Công Đá Ốp Cột</a></li>
                                <li><a href="/vi/dich-vu">Thi Công Đá Ốp Cầu Thang </a></li>
                                <li><a href="/vi/dich-vu">Thiết Kế Thi Công Đá Ốp Sàn Thang Máy</a></li>
                                <li><a href="/vi/dich-vu">Thi Công Đá Ốp Bếp</a></li>
                                <li><a href="/vi/dich-vu">Thi Công Tranh Đá</a></li>
                                <li><a href="/vi/dich-vu">Thiết Kế Và Thi Công Hoa Văn Đá</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-10 pe-0 mr-contact-0">
                        <div className="footer-widget footer-widget--contact">
                            <div className="">
                                <h4 className="footer-widget__title footer-widget__title_info">Liên hệ</h4>

                                <div className="footer-gap-bottom">
                                    <ul className="list-unstyled footer-widget__links footer-widget__info ">
                                        <li>

                                            <FaMapMarkerAlt className="icon-location-2" />
                                            <a href="https://www.google.com/maps" className="font-weight-800">
                                                <b>Trụ sở chính:
                                                    </b> 114C Hoàng Hoa Thám, Phường Bảy Hiền, TP. HCM
                                            </a>
                                        </li>
                                        <li>
                                            <FaMapMarkerAlt className="icon-location-2" />
                                            <a href="https://www.google.com/maps" className="font-weight-800">
                                               <b>Nhà máy sản xuất:
                                                </b>  324 Phan Văn Hớn,
                                                Phường Đông Hưng Thuận, TP.HCM
                                            </a>
                                        </li>
                                        <li>
                                            <FaPaperPlane className="icon-location-2" />
                                            <a href="mailto:pacstone.cskh@gmail.com">pacstone.cskh@gmail.com</a>
                                        </li>
                                        <li className="phone-bottom">
                                            <FaPhoneAlt className="icon-location-2" />
                                            <a href="tel:0962757475">0962.757.475</a>
                                        </li>
                                    </ul>
                                </div>
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

        </footer>
    );
}