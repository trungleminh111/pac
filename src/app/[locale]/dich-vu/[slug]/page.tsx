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

const serviceDetailContent = {
  vi: {
    bannerTitle: "DỊCH VỤ",
    contactNow: "LIÊN HỆ NGAY",
    companyProfile: "Hồ sơ năng lực",
    productBrochure: "Brochure sản phẩm",
    subTitle: "Dịch vụ của chúng tôi cung cấp cho Bạn những gì?",
    features: [
      {
        title: "Tư Vấn Thiết Kế Độc Quyền:",
        text: "Mỗi dự án đều được chúng tôi tiếp cận với tâm huyết, lắng nghe và hiểu rõ yêu cầu cụ thể của khách hàng để đưa ra giải pháp thiết kế ốp lát hoàn hảo nhất.",
      },
      {
        title: "Chọn Lọc Đá Hoa Cương Tinh Anh:",
        text: "Chúng tôi cung cấp một loạt các loại đá hoa cương nhập khẩu từ khắp nơi trên thế giới.",
      },
      {
        title: "Thi Công Chuyên Nghiệp & Tận Tâm:",
        text: "Với quy trình thi công chặt chẽ, chúng tôi đảm bảo mọi chi tiết đều được thực hiện tỉ mỉ và chính xác.",
      },
      {
        title: "Bảo Hành Và Hậu Mãi Chu Đáo:",
        text: "Chúng tôi tự tin về chất lượng sản phẩm và dịch vụ của mình.",
      },
    ],
    checklist: [
      "Tư vấn miễn phí",
      "Thi công chuyên nghiệp",
      "Sản phẩm đa dạng",
      "Bảo hành chu đáo",
    ],
  },
  en: {
    bannerTitle: "SERVICES",
    contactNow: "CONTACT NOW",
    companyProfile: "Company Profile",
    productBrochure: "Product Brochure",
    subTitle: "What do our services provide for you?",
    features: [
      {
        title: "Exclusive Design Consultation:",
        text: "Every project is approached with dedication. We listen carefully and understand each client’s requirements to deliver the most suitable stone design and installation solution.",
      },
      {
        title: "Selected Premium Granite:",
        text: "We provide a wide range of carefully selected granite and natural stone materials imported from trusted sources around the world.",
      },
      {
        title: "Professional & Dedicated Installation:",
        text: "With a strict installation process, we ensure every detail is completed carefully, accurately, and in line with technical standards.",
      },
      {
        title: "Dedicated Warranty & After-sales:",
        text: "We are confident in the quality of our products and services, and we provide dedicated support after project completion.",
      },
    ],
    checklist: [
      "Free consultation",
      "Professional installation",
      "Diverse products",
      "Dedicated warranty",
    ],
  },
};

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
  const content = locale === "en" ? serviceDetailContent.en : serviceDetailContent.vi;

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
        title={content.bannerTitle}
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
                          {content.contactNow}
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
                      {content.companyProfile}
                    </h4>
                  </div>

                  <div className="service-sidebar__company">
                    <a href="#" className="service-sidebar__company__btn">
                      <span className="icon-download">
                        <LuDownload />
                      </span>
                    </a>

                    <h4 className="service-sidebar__company__title">
                      {content.productBrochure}
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
                    {content.subTitle}
                  </h3>

                  <ul className="service-feature-list">
                    <li>
                      <strong>{content.features[0].title}</strong>{" "}
                      {content.features[0].text}
                    </li>

                    <li>
                      <strong>{content.features[1].title}</strong>{" "}
                      {content.features[1].text}
                    </li>

                    <li>
                      <strong>{content.features[2].title}</strong>{" "}
                      {content.features[2].text}
                    </li>

                    <li>
                      <strong>{content.features[3].title}</strong>{" "}
                      {content.features[3].text}
                    </li>
                  </ul>
                </div>

                <div className="service-details__info">
                  <ul className="list-unstyled service-details__list">
                    <li>
                      <span className="icon-check">
                        <FaCheck />
                      </span>
                      {content.checklist[0]}
                    </li>

                    <li>
                      <span className="icon-check">
                        <FaCheck />
                      </span>
                      {content.checklist[1]}
                    </li>

                    <li>
                      <span className="icon-check">
                        <FaCheck />
                      </span>
                      {content.checklist[2]}
                    </li>

                    <li>
                      <span className="icon-check">
                        <FaCheck />
                      </span>
                      {content.checklist[3]}
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

      <Footer locale={locale} />
    </div>
  );
}