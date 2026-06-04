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

      <PageHeader
        title=""
        bgImage="/assets/images/backgrounds/PACSTONE-DICHVU-header.png"
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
                            "url('/assets/images/resources/service-sidebar-contact-bg-2.png')",
                        }}
                      />
                    </div>

                    <div className="service-sidebar__contact__inner">
                      <div className="service-sidebar__contact__icon">
                        <span className="icon-telephone">
                          <FiPhoneCall />
                        </span>
                      </div>

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

                  <p className="service-details__text">
                    <strong>
                      {locale === "vi"
                        ? "• Tư Vấn Thiết Kế:"
                        : "• Design Consultation:"}
                    </strong>{" "}
                    {locale === "vi"
                      ? "Chúng tôi tư vấn giải pháp phù hợp nhất với từng không gian."
                      : "We provide suitable solutions for each space."}
                    <br />
                    <br />

                    <strong>
                      {locale === "vi"
                        ? "• Vật Liệu Cao Cấp:"
                        : "• Premium Materials:"}
                    </strong>{" "}
                    {locale === "vi"
                      ? "Đá tự nhiên nhập khẩu chất lượng cao từ nhiều quốc gia."
                      : "High-quality imported natural stone from many countries."}
                    <br />
                    <br />

                    <strong>
                      {locale === "vi"
                        ? "• Thi Công Chuyên Nghiệp:"
                        : "• Professional Installation:"}
                    </strong>{" "}
                    {locale === "vi"
                      ? "Quy trình thi công chuẩn xác, đội ngũ lành nghề."
                      : "Accurate construction process with skilled workers."}
                    <br />
                    <br />

                    <strong>
                      {locale === "vi"
                        ? "• Bảo Hành Chu Đáo:"
                        : "• Dedicated Warranty:"}
                    </strong>{" "}
                    {locale === "vi"
                      ? "Chính sách hậu mãi và bảo hành rõ ràng."
                      : "Clear after-sales and warranty policies."}
                  </p>
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

                <p className="service-details__text-two">
                  {locale === "vi"
                    ? "Công ty Cổ phần Đá quốc tế Phúc Nam - Nơi kiến tạo không gian sống đẳng cấp."
                    : "Phuc Nam International Stone Joint Stock Company - Creating premium living spaces."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}