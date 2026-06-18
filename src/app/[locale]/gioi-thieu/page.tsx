import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { About } from "@/components/site/About";
import { PageHeader } from "@/components/site/PageHeader";
import ScrollReveal from "@/components/site/ScrollReveal";
import Banner from "@/components/site/Banner/Banner";

type Locale = "vi" | "en";

const aboutPageContent = {
    vi: {
        bannerTitle: "GIỚI THIỆU",
        reasonTagline: "Lý do",
        reasonTitle: "LÝ DO VÌ SAO NÊN CHỌN CHÚNG TÔI?",
        qualityTitle: "Chất Lượng Vượt Trội",
        qualityText:
            "Chúng tôi cam kết sử dụng những tấm đá hoa cương có chất lượng tốt nhất, được nhập khẩu từ các mỏ đá nổi tiếng trên thế giới.",
        constructionTitle: "Thi công chuyên nghiệp",
        constructionText:
            "Đội ngũ thi công của P.A.C STONE là những thợ lành nghề, giàu kinh nghiệm, luôn đảm bảo quy trình thi công chính xác và hiệu quả.",
        designTitle: "Thiết Kế Độc Đáo",
        designText:
            "Mỗi dự án đều được xem xét tỉ mỉ, đảm bảo thiết kế phản ánh phong cách riêng và tạo điểm nhấn ấn tượng.",
        warrantyTitle: "Bảo Hành Tận Tâm",
        warrantyText:
            "Chúng tôi luôn đặt khách hàng làm trung tâm, hỗ trợ tận tâm trước, trong và sau khi dự án hoàn thành.",
    },
    en: {
        bannerTitle: "ABOUT US",
        reasonTagline: "Reasons",
        reasonTitle: "WHY SHOULD YOU CHOOSE US?",
        qualityTitle: "Outstanding Quality",
        qualityText:
            "We are committed to using premium granite and natural stone slabs, carefully sourced from renowned quarries around the world.",
        constructionTitle: "Professional Construction",
        constructionText:
            "The construction team at P.A.C STONE consists of skilled and experienced craftsmen, ensuring accurate and efficient installation processes.",
        designTitle: "Unique Design",
        designText:
            "Every project is carefully considered to ensure the design reflects a distinctive style and creates an impressive highlight.",
        warrantyTitle: "Dedicated Warranty",
        warrantyText:
            "We always put customers at the center, providing dedicated support before, during, and after each project is completed.",
    },
};

export async function generateMetadata({
    params,
}: {
    params: {
        locale: "vi" | "en";
    };
}): Promise<Metadata> {
    const locale = params.locale === "en" ? "en" : "vi";
    const path = locale === "en" ? "/en/about" : "/vi/gioi-thieu";

    return buildMetadata({
        locale,
        path,
        title: "Giới Thiệu P.A.C STONE - Nhà Cung Cấp Đá Nhập Khẩu",
        description: "Về công ty",
        image: "",
        type: "website",
        alternatePaths: {
            vi: "/vi/gioi-thieu",
            en: "/en/about",
            xDefault: "/vi/gioi-thieu",
        },
    });
}

export default function AboutPage({
    params,
}: {
    params: {
        locale: "vi" | "en";
    };
}) {
    const locale = params.locale === "en" ? "en" : "vi";
    const content = aboutPageContent[locale];

    return (
        <div className="page-wrapper page-gioithieu">
            <Header locale={locale} />
            <Banner
                title={content.bannerTitle}
                backgroundImg="/assets/images/backgrounds/intro-banner.webp"
                row={3}
                col={1}
            />
            <About backgroundImage="/assets/images/backgrounds/8.png" locale={locale} />
            <section className="about-one section-space" id="about">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-sm-8 col-12">
                            <ScrollReveal animationClass="fade-in-left" delay="0.2s">

                                <div className="about-one__image-grid">
                                    <div className="about-one__image">
                                        <img
                                            src="/assets/images/about/P.A.C-about3.png"
                                            alt="about"
                                            className="about-one__image__one"
                                        />
                                        <img
                                            src="/assets/images/about/P.A.C-about1.png"
                                            alt="about"
                                            className="about-one__image__two"
                                        />
                                    </div>

                                    <div className="about-one__image">
                                        <img
                                            src="/assets/images/about/P.A.C-about2.png"
                                            alt="about"
                                            className="about-one__image__three"
                                        />
                                    </div>
                                    <div className="about-one__circle-text">
                                        <img
                                            src="/assets/images/about/ezgif-5517c6791d4a6c1f.gif"
                                            alt="P.A.C STONE Animation"
                                            className="about-one__circle-text__image"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                borderRadius: "50%", // Đảm bảo ảnh GIF hiển thị theo khung tròn nếu class cha chưa bo tròn
                                            }}
                                        />
                                    </div>

                                    {/* <div className="about-one__circle-text">
                                        <div
                                            className="about-one__circle-text__bg"
                                            style={{
                                                backgroundImage:
                                                    "url('/assets/images/resources/PACSTONE-circle.jpg')",
                                            }}
                                        />
                                        <img
                                            src="/assets/images/resources/Circle.jpg"
                                            alt="award"
                                            className="about-one__circle-text__image"
                                        />
                                       
                                    </div> */}
                                </div>
                            </ScrollReveal>
                        </div>

                        <div className="col-lg-6 col-sm-12 col-12">
                            <div className="about-one__content">
                                <ScrollReveal animationClass="fade-in-up" delay="0.4s">
                                    <div className="sec-title sec-title--border">
                                        <h6 className="sec-title__tagline">{content.reasonTagline}</h6>
                                        <h3 className="sec-title__title">
                                            {content.reasonTitle}
                                        </h3>
                                    </div>
                                </ScrollReveal>

                                <div className="row about-one__inner-row gutter-y-40">
                                    <div className="col-lg-6 col-sm-12 col-12">
                                        <div className="about-one__service about-one__service--one">
                                            <ScrollReveal animationClass="fade-in-up" delay="0.6s">

                                                <div className="about-one__service__content">
                                                    <h4 className="about-one__service__title">
                                                        {content.qualityTitle}
                                                    </h4>
                                                    <p className="about-one__service__text">
                                                        {content.qualityText}
                                                    </p>
                                                </div>
                                            </ScrollReveal>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-sm-12 col-12">
                                        <div className="about-one__service about-one__service--two">
                                            <ScrollReveal animationClass="fade-in-up" delay="0.8s">

                                                <div className="about-one__service__content">
                                                    <h4 className="about-one__service__title">
                                                        {content.constructionTitle}
                                                    </h4>
                                                    <p className="about-one__service__text">
                                                        {content.constructionText}
                                                    </p>
                                                </div>
                                            </ScrollReveal>
                                        </div>
                                    </div>
                                </div>

                                <div className="row about-one__inner-row gutter-y-40 mt-10">
                                    <div className="col-lg-6 col-sm-12 col-12">
                                        <div className="about-one__service about-one__service--one">
                                            <ScrollReveal animationClass="fade-in-up" delay="1s">


                                                <div className="about-one__service__content">
                                                    <h4 className="about-one__service__title">
                                                        {content.designTitle}
                                                    </h4>
                                                    <p className="about-one__service__text">
                                                        {content.designText}
                                                    </p>
                                                </div>
                                            </ScrollReveal>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-sm-12 col-12">
                                        <div className="about-one__service about-one__service--two">
                                            <ScrollReveal animationClass="fade-in-up" delay="1.2s">

                                                <div className="about-one__service__content">
                                                    <h4 className="about-one__service__title">
                                                        {content.warrantyTitle}
                                                    </h4>
                                                    <p className="about-one__service__text">
                                                        {content.warrantyText}
                                                    </p>
                                                </div>
                                            </ScrollReveal>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="about-one__shapes">
                    <img
                        src="/assets/images/shapes/about-shape-1-1.jpg"
                        alt="about-shape"
                        className="about-one__shape about-one__shape--one"
                    />
                    <img
                        src="/assets/images/shapes/about-shape-1-1.jpg"
                        alt="about-shape"
                        className="about-one__shape about-one__shape--two"
                    />
                </div> */}
            </section>

            <Footer locale={locale} />
        </div>
    );
}