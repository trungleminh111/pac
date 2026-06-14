import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";
import { SiZalo } from "react-icons/si";

type Locale = "vi" | "en";

type FooterProps = {
    locale?: Locale;
};

const footerContent = {
    vi: {
        homeHref: "/vi",
        copyright: "© Bản quyền 2026 thuộc về",
        companyName: "CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ XÂY DỰNG",
        accessTitle: "Truy cập",
        accessLinks: {
            about: { label: "Giới thiệu", href: "/vi/gioi-thieu" },
            services: { label: "Dịch vụ", href: "/vi/dich-vu" },
            products: { label: "Sản phẩm", href: "/vi/san-pham" },
            projects: { label: "Công trình", href: "/vi/cong-trinh" },
            news: { label: "Tin tức", href: "/vi/tin-tuc" },
            contact: { label: "Liên hệ", href: "/vi/lien-he" },
        },
        serviceTitle: "Dịch vụ",
        serviceHref: "/vi/dich-vu",
        services: [
            "Thi công Đá Ốp Mặt Tiền",
            "Thi Công Đá Ốp Cột",
            "Thi Công Đá Ốp Cầu Thang",
            "Thiết Kế Thi Công Đá Ốp Sàn Thang Máy",
            "Thi Công Đá Ốp Bếp",
            "Thi Công Tranh Đá",
            "Thiết Kế Và Thi Công Hoa Văn Đá",
        ],
        contactTitle: "Liên hệ",
        headOffice: "Trụ sở chính:",
        factory: "Nhà máy sản xuất:",
        headOfficeAddress: "114C Hoàng Hoa Thám, Phường Bảy Hiền, TP. HCM",
        factoryAddress: "324 Phan Văn Hớn, Phường Đông Hưng Thuận, TP.HCM",
    },
    en: {
        homeHref: "/en",
        copyright: "© Copyright 2026 belongs to",
        companyName: "P.A.C STONE CO., LTD",
        accessTitle: "Quick links",
        accessLinks: {
            about: { label: "About us", href: "/en/about" },
            services: { label: "Services", href: "/en/services" },
            products: { label: "Products", href: "/en/products" },
            projects: { label: "Projects", href: "/en/projects" },
            news: { label: "News", href: "/en/news" },
            contact: { label: "Contact", href: "/en/contact" },
        },
        serviceTitle: "Services",
        serviceHref: "/en/services",
        services: [
            "Stone Facade Installation",
            "Stone Column Cladding",
            "Stone Staircase Installation",
            "Elevator Floor Stone Design & Installation",
            "Kitchen Stone Installation",
            "Stone Artwork Installation",
            "Stone Pattern Design & Installation",
        ],
        contactTitle: "Contact",
        headOffice: "Head office:",
        factory: "Factory:",
        headOfficeAddress: "114C Hoang Hoa Tham, Bay Hien Ward, Ho Chi Minh City",
        factoryAddress: "324 Phan Van Hon, Dong Hung Thuan Ward, Ho Chi Minh City",
    },
};

export function Footer({ locale = "vi" }: FooterProps) {
    const content = footerContent[locale] || footerContent.vi;

    return (
        <footer className="main-footer">
            <div className="main-footer__bg"
                style={{
                    backgroundImage: "url('/assets/images/shapes/Footer-PACSTONE.jpg')",


                }}
            />
            <div className="main-footer__top">
                <div className="row align-items-start">
                    <div className="col-lg-3 col-md-3 col-10 pe-0 col-logo">
                        <div className="footer-widget footer-widget--about">
                            <a href={content.homeHref} className="footer-widget__logo">

                                <img
                                    src="/assets/images/logo-PACSTONE.webp"
                                    alt="Logo P.A.C STONE"
                                    className="footer-logo"
                                ></img>
                            </a>

                            <p className="footer-widget__about-text">
                                {content.copyright}
                                <br />

                                <span className="nowrap company-name">
                                    {content.companyName}
                                </span>

                                <br />

                                P.A.C STONE
                            </p>
                        </div>
                    </div>

                    <div className="padding-left-3 col-lg-2 col-md-2 d-none d-md-block">
                        <div className="text-nowrap">
                            <div className="">
                                <h4 className="footer-widget__title">{content.accessTitle}</h4>
                            </div>
                            <ul className="list-unstyled text-capitalize">
                                <li><a href={content.accessLinks.about.href}>{content.accessLinks.about.label}</a></li>
                                <li><a href={content.accessLinks.services.href}>{content.accessLinks.services.label}</a></li>
                                <li><a href={content.accessLinks.products.href}>{content.accessLinks.products.label}</a></li>
                                <li><a href={content.accessLinks.projects.href}>{content.accessLinks.projects.label}</a></li>
                                <li><a href={content.accessLinks.news.href}>{content.accessLinks.news.label}</a></li>
                                <li><a href={content.accessLinks.contact.href}>{content.accessLinks.contact.label}</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="padding-left-2 col-lg-4 col-md-4 d-none d-md-block">
                        <div className="text-nowrap">
                            <div className="footer-widget__top">
                                <h4 className="footer-widget__title">{content.serviceTitle}</h4>
                            </div>
                            <ul className="list-unstyled footer-widget__links text-capitalize">
                                <li><a href={content.serviceHref}>{content.services[0]}</a></li>
                                <li><a href={content.serviceHref}>{content.services[1]}</a></li>
                                <li><a href={content.serviceHref}>{content.services[2]} </a></li>
                                <li><a href={content.serviceHref}>{content.services[3]}</a></li>
                                <li><a href={content.serviceHref}>{content.services[4]}</a></li>
                                <li><a href={content.serviceHref}>{content.services[5]}</a></li>
                                <li><a href={content.serviceHref}>{content.services[6]}</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-10 pe-0 mr-contact-0">
                        <div className="footer-widget footer-widget--contact">
                            <div className="">
                                <h4 className="footer-widget__title footer-widget__title_info">{content.contactTitle}</h4>

                                <div className="footer-gap-bottom">
                                    <ul className="list-unstyled footer-widget__links footer-widget__info ">
                                        <li>

                                            <FaMapMarkerAlt className="icon-location-2" />
                                            <a href="https://maps.app.goo.gl/h46QpREsDByeyLQ6A" className="font-weight-800">
                                                <b>{content.headOffice}
                                                </b> {content.headOfficeAddress}
                                            </a>
                                        </li>
                                        <li>
                                            <FaMapMarkerAlt className="icon-location-2" />
                                            <a href="https://maps.app.goo.gl/aGxUAfP1Gr5HVCeP9" className="font-weight-800">
                                                <b>{content.factory}
                                                </b>  {content.factoryAddress}
                                            </a>
                                        </li>
                                        <li>
                                            <MdMailOutline className="icon-location-2" />
                                            <a href="mailto:pacstone.cskh@gmail.com">pacstone.cskh@gmail.com</a>
                                        </li>
                                        <li className="phone-bottom">
                                            <FaPhoneAlt className="icon-location-2" />
                                            <a href="tel:0962757475">0962.757.475</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="main-footer__social floens-social">
                                    <a
                                        href="https://www.facebook.com/dahoacuongpac?rdid=cxhxaMBS0BOL3mV7&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18fuq8z3U5%2F#"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Facebook"
                                    >
                                        <FaFacebookF />
                                    </a>

                                    <a
                                        href="https://zalo.me/0962757475"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Zalo"
                                    >
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