import "leaflet/dist/leaflet.css";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import LocationMap from "@/components/site/Map";
import Image from "next/image";
import { FaDownload } from "react-icons/fa";
import "@/styles/lienhe.css";
import { BiSolidPhoneCall } from "react-icons/bi";
import { FaUpload } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { LuUpload } from "react-icons/lu";
import ScrollReveal from "@/components/site/ScrollReveal";
import Banner from "@/components/site/Banner/Banner";
import PdfPreview from "@/components/site/PdfPreview/PdfPreview";

const contactPageContent = {
  vi: {
    bannerTitle: "LIÊN HỆ",
    callSubtitle: "Đừng ngại, hãy gọi cho chúng tôi!",
    callLabel: "CALL US",
    sectionTagline: "liên hệ",
    sectionTitle: "Chúng Tôi Luôn Sẵn Sàng Lắng Nghe Bạn!",
    introStrong: "Bạn đang tìm kiếm đơn vị thi công, thiết kế đá hoa cương?",
    introText:
      "Đừng ngần ngại, hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí từ đội ngũ chuyên gia hàng đầu.",
    formTitle: "Gửi tin nhắn cho chúng tôi",
    namePlaceholder: "Họ và tên",
    emailPlaceholder: "Email",
    phonePlaceholder: "Điện thoại",
    messagePlaceholder: "Nội dung",
    uploadText: "File thiết kế của bạn (Nếu có)",
    submitText: "Gửi nội dung",
    showroomAlt: "Hồ sơ năng lực P.A.C Stone",
    profileTitle: "Hồ sơ năng lực P.A.C Stone",
    licenseTitle: "Giấy phép kinh doanh",
    downloadText: "Tải Hồ Sơ Năng Lực P.A.C STONE",
  },
  en: {
    bannerTitle: "CONTACT",
    callSubtitle: "Don’t hesitate, call us now!",
    callLabel: "CALL US",
    sectionTagline: "contact",
    sectionTitle: "We Are Always Ready To Listen To You!",
    introStrong: "Are you looking for a granite design and installation contractor?",
    introText:
      "Do not hesitate to contact us today for a free consultation from our experienced expert team.",
    formTitle: "Send us a message",
    namePlaceholder: "Full name",
    emailPlaceholder: "Email",
    phonePlaceholder: "Phone",
    messagePlaceholder: "Message",
    uploadText: "Your design file (If any)",
    submitText: "Send message",
    showroomAlt: "P.A.C Stone Company Profile",
    profileTitle: "P.A.C Stone Company Profile",
    licenseTitle: "Business License",
    downloadText: "Download P.A.C STONE Company Profile",
  },
};

export default function ContactPage({
  params,
}: {
  params: {
    locale: "vi" | "en";
  };
}) {
  const locale = params.locale === "en" ? "en" : "vi";
  const content = contactPageContent[locale];
  
  return (
    <div className="page-wrapper">
      <Header locale={locale} />
       <Banner
        title={content.bannerTitle}
        backgroundImg="/assets/images/backgrounds/contact-banner.webp"
        row={2}
        col={2}
      > 
        {/* Khung bao bọc tổng thể theo chiều dọc */}
        <div className="contact-call-wrapper">

          {/* Phần Sub-title phía trên */}
          <div className="contact-call__subtitle">
            {content.callSubtitle}
          </div>

          {/* Phần nút gọi phía dưới (Giữ nguyên cấu trúc cũ) */}
          <div className="contact-call">
            {/* Nút tròn call */}
            <a href="https://zalo.me/0962757475" target="_blank" rel="noopener noreferrer" className="contact-call__icon">
              <BiSolidPhoneCall />
            </a>

            {/* Khối nội dung bên phải */}
            <div className="contact-call__content">
              <div className="contact-call__label">{content.callLabel}</div>
              <div className="contact-call__phone-wrapper">
                <a href="tel:0962757475" className="contact-call__phone">
                  0962.757.475
                </a>
              </div>
            </div>
          </div>

        </div>
      </Banner>
      {/* <PageHeader
        title=""
        bgImage="/assets/images/backgrounds/PACSTONE-LIENHE-header.png"
      >
        
      </PageHeader>  */}
     
      <section className="contact-one section-space">
        <div
          className="contact-one__bg"
          style={{
            backgroundImage: "url('/assets/images/backgrounds/8.png')", opacity: 0.2,
          }}
        />

        <div className="container">
          <div className="row gutter-y-40">
            <div className="col-lg-6 col-md-12 ">
              <div className="contact-one__content">
                <div className="sec-title sec-title--border">
                  <h6 className="sec-title__tagline">{content.sectionTagline}</h6>
                  <h3 className="sec-title__title">
                    {content.sectionTitle}
                  </h3>
                </div>


                <p className="contact-one__text text-justify">
                  <strong>
                    {content.introStrong}
                  </strong>
                  <br />
                  {content.introText}
                </p>

                <ScrollReveal animationClass="fade-in-up" delay="0">

                  <form className="contact-one__form contact-form-validated form-one">
                    <div
                      className="contact-one__form__bg"
                      style={{
                        backgroundImage:
                          "url('/assets/images/shapes/contact-info-form-bg.png')",
                      }}
                    />

                    <div className="contact-one__form__top">
                      <h2 className="contact-one__form__title">
                        {content.formTitle}
                      </h2>
                    </div>

                    <div className="form-one__group form-one__group--grid">
                      <div className="form-one__control form-one__control--input form-one__control--full">
                        <input type="text" name="name" placeholder={content.namePlaceholder} />
                      </div>

                      <div className="form-one__control form-one__control--full">
                        <input type="email" name="email" placeholder={content.emailPlaceholder} />
                      </div>

                      <div className="form-one__control form-one__control--full">
                        <input type="text" name="phone" placeholder={content.phonePlaceholder} />
                      </div>

                      <div className="form-one__control form-one__control--mesgae form-one__control--full">
                        <textarea name="message" placeholder={content.messagePlaceholder} />
                        <div className="button-upload">

                          <button>{content.uploadText} <LuUpload /></button>
                        </div>
                      </div>
                      <div className="form-one__control form-one__control--full">
                        <button type="submit" className="floens-btn">
                          <span>{content.submitText}</span>
                          <i className="icon-right-arrow sm-none" >→</i>
                        </button>
                      </div>
                    </div>
                  </form>
                </ScrollReveal>

              </div>
            </div>


            <div className="contact-right col-lg-6  col-md-12 d-flex flex-column">
              {/* Thẻ bọc ngoài đơn giản, không cố định aspectRatio để chiều cao tự bung theo ảnh */}
              <ScrollReveal animationClass="fade-in-up" delay="0">
                <div className="doc-card-item">
                  <Image
                    src="/assets/images/lienhe/ShowroomPAC.jpg"
                    alt={content.showroomAlt}
                    width={1448}
                    height={1086}
                    sizes="(max-width: 991px) 100vw, 50vw"
                    className="doc-thumb-img"
                  />
                </div>
              </ScrollReveal>
              <div className="doc-a4-grid">

                {/* Ảnh A4 thứ nhất */}
                <PdfPreview
                  src="/assets/files/PAC_STONE_08-04-26_Certificate.pdf"
                  title={content.profileTitle}
                />

                <PdfPreview
                  src="/assets/files/PAC_CHI_NHANH_Certificate.pdf"
                  title={content.licenseTitle}
                />

              </div>
              <ScrollReveal animationClass="fade-in-up" delay="0.8">
                <div className="download-box ">

                  <a
                    href="/assets/files/PAC-certificates.rar"
                    download
                    className="download-btn"
                  >
                    <LuDownload />
                  </a>
                  <div className="download-content">
                    {content.downloadText}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>

        <img
          src="/assets/images/contact/contact-1-2.jpg"
          alt="contact"
          className="contact-one__image-two"
        />
      </section>

      <section className="contact-map">
        <div className="container-fluid">
          <div className="google-map google-map__contact">
          </div>
          <LocationMap />
        </div>
      </section>
      <Footer locale={locale} />
    </div>
  );
}