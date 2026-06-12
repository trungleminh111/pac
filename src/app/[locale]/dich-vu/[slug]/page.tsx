import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import {
  getServiceBySlug,
  getServicesPage,
} from "@/server/services/service.query";
import type { Locale } from "@/server/services/service.type";
import { FaCheck } from "react-icons/fa6";
import { LuDownload } from "react-icons/lu";
import { FiPhoneCall } from "react-icons/fi";
import Banner from "@/components/site/Banner/Banner";
function serviceHref(locale: Locale, slug: string) {
  return locale === "vi" ? `/vi/dich-vu/${slug}` : `/en/services/${slug}`;
}

function getHtml(content: any) {
  if (!content) return "";
  if (typeof content === "string") return content;
  return content.html || "";
}

export default async function ServiceDetailPage({
  params,
}: {
  params: {
    locale: Locale;
    slug: string;
  };
}) {
  const { locale, slug } = params;

  const [service, services] = await Promise.all([
    getServiceBySlug(locale, slug),
    getServicesPage(locale),
  ]);

  if (!service) {
    notFound();
  }

  const contentHtml = getHtml(service.content);

  return (
    <div className="page-wrapper">
      <Header locale={locale} />

      {/* <PageHeader
        title=""
        bgImage="/assets/images/backgrounds/PACSTONE-DICHVU-header.png"
      /> */}
      <Banner
        title="DỊCH VỤ"
        backgroundImg="/assets/images/backgrounds/service-banner.webp"
        row={3}
        col={6}
      />
      <section className="service-details section-space">
        <div className="container">
          <div className="row gutter-y-30">
            <div className="col-md-12 col-lg-4">
              <div className="service-sidebar">
                <div className="service-sidebar__info service-sidebar__single">
                  <ul className="list-unstyled service-sidebar__nav">
                    {services.map((item) => (
                      <li
                        key={item.id}
                        className={item.slug === slug ? "current" : ""}
                      >
                        <Link href={serviceHref(locale, item.slug)}>
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div
                    className="service-sidebar__contact"
                    style={{
                      backgroundImage:
                        "url('/assets/images/resources/service-sidebar-contact-bg-1.jpg')",
                    }}
                  >
                    <div className="service-sidebar__contact__bg">
                      <div
                        className="service-sidebar__contact__bg__inner"
                        style={{
                          backgroundImage:
                            "url('/assets/images/about/about-2-2.jpg')",

                        }}
                      />
                    </div>
                    <div className="service-sidebar__contact__icon">
                      <span className="icon-telephone">
                        <FiPhoneCall />
                      </span>
                    </div>
                    <div className="service-sidebar__contact__inner " >


                      <div className="service-sidebar__contact__content">
                        <h4 className="service-sidebar__contact__time">
                          {locale === "vi" ? "LIÊN HỆ NGAY" : "CONTACT NOW"}
                        </h4>

                        <h4 className="service-sidebar__contact__number">
                          <a href="tel:+84962757475">0962.757.475</a>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="service-sidebar__single">
                  <div className="service-sidebar__company">
                    <a href="#" className="service-sidebar__company__btn">
                      <span className="icon-download">
                        <LuDownload />
                      </span>
                    </a>

                    <h4 className="service-sidebar__company__title">
                      {locale === "vi" ? "Hồ sơ năng lực" : "Company Profile"}
                    </h4>
                  </div>

                  <div className="service-sidebar__company">
                    <a href="#" className="service-sidebar__company__btn">
                      <span className="icon-download">
                        <LuDownload />
                      </span>
                    </a>

                    <h4 className="service-sidebar__company__title">
                      {locale === "vi"
                        ? "Brochure sản phẩm"
                        : "Product Brochure"}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-lg-8">
              <div className="service-details__content">
                <div className="service-details__inner">
                  <h3 className="service-details__title">{service.title}</h3>

                  <div className="service-details__thumbnail">
                    <img
                      src={
                        service.thumbnail ||
                        "/assets/images/services/service1.jpg"
                      }
                      alt={service.title}
                    />
                  </div>

                  {service.excerpt && (
                    <p className="service-details__text">
                      {service.excerpt}
                    </p>
                  )}

                  {contentHtml && (
                    <div
                      className="service-details__text"
                      dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                  )}
                </div>

                <div className="service-details__inner-two">
                  <h3 className="service-details__sub-title">
                    {locale === "vi"
                      ? "Dịch vụ của chúng tôi cung cấp cho Bạn những gì?"
                      : "What do our services provide for you?"}
                  </h3>

                  <ul className="service-feature-list">
                    <li>
                      <strong>{locale === "vi" ? "Tư Vấn Thiết Kế Độc Quyền:" : "Exclusive Design Consultation:"}</strong>{" "}
                      {locale === "vi"
                        ? "Mỗi dự án đều được chúng tôi tiếp cận với tâm huyết, lắng nghe và hiểu rõ yêu cầu cụ thể của khách hàng để đưa ra giải pháp thiết kế ốp lát hoàn hảo nhất."
                        : "Each project is approached with dedication to deliver the best solution."}
                    </li>

                    <li>
                      <strong>{locale === "vi" ? "Chọn Lọc Đá Hoa Cương Tinh Anh:" : "Selected Premium Granite:"}</strong>{" "}
                      {locale === "vi"
                        ? "Chúng tôi cung cấp một loạt các loại đá hoa cương nhập khẩu từ khắp nơi trên thế giới."
                        : "We provide selected imported granite from around the world."}
                    </li>

                    <li>
                      <strong>{locale === "vi" ? "Thi Công Chuyên Nghiệp & Tận Tâm:" : "Professional & Dedicated Installation:"}</strong>{" "}
                      {locale === "vi"
                        ? "Với quy trình thi công chặt chẽ, chúng tôi đảm bảo mọi chi tiết đều được thực hiện tỉ mỉ và chính xác."
                        : "With a strict construction process, every detail is carefully completed."}
                    </li>

                    <li>
                      <strong>{locale === "vi" ? "Bảo Hành Và Hậu Mãi Chu Đáo:" : "Dedicated Warranty & After-sales:"}</strong>{" "}
                      {locale === "vi"
                        ? "Chúng tôi tự tin về chất lượng sản phẩm và dịch vụ của mình."
                        : "We are confident in our product and service quality."}
                    </li>
                  </ul>
                </div>

                <div className="service-details__info">
                  <ul className="list-unstyled service-details__list">
                    <li>
                      <span className="icon-check">
                        <FaCheck />
                      </span>
                      {locale === "vi" ? "Tư vấn miễn phí" : "Free consultation"}
                    </li>

                    <li>
                      <span className="icon-check">
                        <FaCheck />
                      </span>
                      {locale === "vi"
                        ? "Thi công chuyên nghiệp"
                        : "Professional installation"}
                    </li>

                    <li>
                      <span className="icon-check">
                        <FaCheck />
                      </span>
                      {locale === "vi" ? "Sản phẩm đa dạng" : "Diverse products"}
                    </li>

                    <li>
                      <span className="icon-check">
                        <FaCheck />
                      </span>
                      {locale === "vi"
                        ? "Bảo hành chu đáo"
                        : "Dedicated warranty"}
                    </li>
                  </ul>

                  <img
                    src="/assets/images/services/service-d-list-1.webp"
                    alt="service"
                    className="service-details__info__image"
                  />
                </div>

                {/* <p className="service-details__text-two">
                  {locale === "vi"
                    ? "Công ty Cổ phần Đá quốc tế Phúc Nam - Nơi kiến tạo không gian sống đẳng cấp."
                    : "Phuc Nam International Stone Joint Stock Company - Creating premium living spaces."}
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}