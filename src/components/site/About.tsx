import { FiCheckSquare } from "react-icons/fi";
import ScrollReveal from "@/components/site/ScrollReveal";

type Locale = "vi" | "en";

type AboutProps = {
  backgroundImage?: string;
  locale?: Locale;
};

const aboutContent = {
  vi: {
    yearLabel: "năm",
    experience: "kinh nghiệm",
    tagline: "Giới thiệu",
    title: "công ty tnhh thương mại dịch vụ xây dựng p.a.c stone",
    subtitle: "Chúng tôi mang đến đẳng cấp công trình Việt.",
    description: (
      <>
        P.A.C STONE là một trong những nhà cung cấp hàng đầu Việt Nam về các sản
        phẩm và giải pháp ốp lát đá cao cấp được nhập khẩu từ các quốc gia có
        nền công nghiệp đá phát triển như Italy, Tây Ban Nha, Brazil, và Ấn Độ.
        <br />
        <br />
        Đặc biệt với đội ngũ thiết kế và thi công chuyên nghiệp. P.A.C Stone cam
        kết mang đến sự hoàn hảo và sang trọng cho mọi không gian sống, đáp ứng
        mọi nhu cầu của khách hàng.
      </>
    ),
    items: [
      "Chất lượng vượt trội",
      "Thiết kế độc đáo",
      "Thi công chuyên nghiệp",
      "Bảo hành tận tâm",
    ],
    button: "Xem thêm",
    href: "/vi/gioi-thieu",
  },
  en: {
    yearLabel: "years",
    experience: "experience",
    tagline: "About us",
    title: "p.a.c stone trading service construction company limited",
    subtitle: "We bring premium value to Vietnamese construction projects.",
    description: (
      <>
        P.A.C STONE is one of Vietnam’s leading suppliers of premium stone
        products and stone cladding solutions, imported from countries with
        well-developed stone industries such as Italy, Spain, Brazil, and India.
        <br />
        <br />
        With a professional design and construction team, P.A.C Stone is
        committed to delivering perfection and elegance to every living space,
        meeting the diverse needs of our customers.
      </>
    ),
    items: [
      "Outstanding quality",
      "Unique design",
      "Professional construction",
      "Dedicated warranty",
    ],
    button: "Read more",
    href: "/en/about",
  },
};

export function About({ backgroundImage, locale = "vi" }: AboutProps) {
  const content = aboutContent[locale] || aboutContent.vi;

  return (
    <section className="about-two section-space  pt-lg-5   pt-xl-5   pb-xxl-3 pb-sm-3  pb-md-3  pb-lg-5   pb-xl-5   pb-xxl-3">
      <div
        className="about-two__bg"
        // style={{
        //   backgroundImage: "url('/assets/images/backgrounds/8.png')",
        //   opacity: 0.2
        // }}
        style={
          backgroundImage
            ? { backgroundImage: `url(${backgroundImage})` }
            : undefined
        }

      />

      <div className="container">
        <div className="row gutter-y-60">
          <div className="col-lg-6">
            <ScrollReveal animationClass="fade-in-left">
              <div className="about-two__image ">
                <div className="about-two__image__inner">
                  <img
                    src="/assets/images/about/about.png"
                    alt="about"
                    className="about-two__image__one"
                  />

                  <div className="about-two__image__inner__inner">
                    <img
                      src="/assets/images/about/about-2-2.jpg"
                      alt="about"
                      className="about-two__image__two"
                    />
                  </div>

                  <div className="experience about-two__experience">
                    <div className="experience__inner">
                      <h3
                        className="experience__year"

                      >
                        20
                        <br />
                        <span style={{ fontSize: 22 }}>{content.yearLabel}</span>
                      </h3>
                      <p className="experience__text">{content.experience}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="col-lg-6">
            <div className="about-two__content">
              <ScrollReveal animationClass="fade-in-right">
                <div className="sec-title sec-title--border">
                  <h6 className="sec-title__tagline">{content.tagline}</h6>
                  <h3 className="sec-title__title">
                    {content.title}
                  </h3>
                </div>
              </ScrollReveal>

              <div className="about-two__content__text">
                <ScrollReveal animationClass="fade-in-up" delay="0.2s">

                  <h5 className="about-two__text-title">
                    {content.subtitle}
                  </h5>
                </ScrollReveal>
                <ScrollReveal animationClass="fade-in-up" delay="0.4s">

                  <p className="about-two__text">
                    {content.description}
                  </p>
                </ScrollReveal>
              </div>
              <ScrollReveal animationClass="fade-in-up" delay="0.6s">

                <div className="about-two__list">

                  <div className="about-two__list__left">
                    <div className="about-two__list__item">
                      <FiCheckSquare className="about-check-icon" />
                      {content.items[0]}
                    </div>
                    <div className="about-two__list__item">
                      <FiCheckSquare className="about-check-icon" />
                      {content.items[1]}
                    </div>
                  </div>

                  <div className="about-two__list__right">
                    <div className="about-two__list__item">
                      <FiCheckSquare className="about-check-icon" />
                      {content.items[2]}
                    </div>
                    <div className="about-two__list__item">
                      <FiCheckSquare className="about-check-icon" />
                      {content.items[3]}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal animationClass="fade-in-up" delay="0.8s">

                <div className="about-two__list">

                  <div className="about-two__button">
                    <a href={content.href} className="floens-btn">
                      <span>{content.button}</span>
                      <i className="icon-right-arrow" >→</i>
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}