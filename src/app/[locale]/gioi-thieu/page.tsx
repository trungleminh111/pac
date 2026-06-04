import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { About } from "@/components/site/About";
import { PageHeader } from "@/components/site/PageHeader";



export default function AboutPage() {
    return (
        <div className="page-wrapper page-gioithieu">
            <Header />
            <PageHeader title=""  bgImage = "/assets/images/backgrounds/PACSTONE-GioiThieu-header.png"/>
            <About backgroundImage="/assets/images/backgrounds/8.png" />
            <section className="about-one section-space" id="about">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-sm-8 col-12">
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
                                    <div
                                        className="about-one__circle-text__bg"
                                        style={{
                                            backgroundImage:
                                                "url('/assets/images/resources/PACSTONE-circle.png')",
                                        }}
                                    />
                                    <img
                                        src="/assets/images/resources/Circle.png"
                                        alt="award"
                                        className="about-one__circle-text__image"
                                    />
                                    {/* <div className="about-one__curved-circle curved-circle">
                                        <div className="about-one__curved-circle__item curved-circle__item">
jịi
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 col-sm-12 col-12">
                            <div className="about-one__content">
                                <div className="sec-title sec-title--border">
                                    <h6 className="sec-title__tagline">Lý do</h6>
                                    <h3 className="sec-title__title">
                                        LÝ DO VÌ SAO NÊN CHỌN CHÚNG TÔI?
                                    </h3>
                                </div>

                                <div className="row about-one__inner-row gutter-y-40">
                                    <div className="col-lg-6 col-sm-12 col-12">
                                        <div className="about-one__service about-one__service--one">
                                            <div className="about-one__service__content">
                                                <h4 className="about-one__service__title">
                                                    Chất Lượng Vượt Trội
                                                </h4>
                                                <p className="about-one__service__text">
                                                    Chúng tôi cam kết sử dụng những tấm đá hoa cương có
                                                    chất lượng tốt nhất, được nhập khẩu từ các mỏ đá nổi
                                                    tiếng trên thế giới.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-sm-12 col-12">
                                        <div className="about-one__service about-one__service--two">
                                            <div className="about-one__service__content">
                                                <h4 className="about-one__service__title">
                                                    Thi công chuyên nghiệp
                                                </h4>
                                                <p className="about-one__service__text">
                                                    Đội ngũ thi công của Phúc Nam là những thợ lành nghề,
                                                    giàu kinh nghiệm, luôn đảm bảo quy trình thi công
                                                    chính xác và hiệu quả.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row about-one__inner-row gutter-y-40 mt-10">
                                    <div className="col-lg-6 col-sm-12 col-12">
                                        <div className="about-one__service about-one__service--one">
                                            <div className="about-one__service__content">
                                                <h4 className="about-one__service__title">
                                                    Thiết Kế Độc Đáo
                                                </h4>
                                                <p className="about-one__service__text">
                                                    Mỗi dự án đều được xem xét tỉ mỉ, đảm bảo thiết kế
                                                    phản ánh phong cách riêng và tạo điểm nhấn ấn tượng.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-sm-12 col-12">
                                        <div className="about-one__service about-one__service--two">
                                            <div className="about-one__service__content">
                                                <h4 className="about-one__service__title">
                                                    Bảo Hành Tận Tâm
                                                </h4>
                                                <p className="about-one__service__text">
                                                    Chúng tôi luôn đặt khách hàng làm trung tâm, hỗ trợ
                                                    tận tâm trước, trong và sau khi dự án hoàn thành.
                                                </p>
                                            </div>
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

            <Footer />
        </div>
    );
}