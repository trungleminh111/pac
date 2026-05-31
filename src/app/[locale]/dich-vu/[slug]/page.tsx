import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";

const services = [
  {
    slug: "thi-cong-da-op-mat-tien",
    title: "Thi công đá ốp mặt tiền",
    image: "service1.jpg",
  },
  {
    slug: "thi-cong-da-op-cot",
    title: "Thi công đá ốp cột",
    image: "service2.jpg",
  },
  {
    slug: "thi-cong-da-op-cau-thang",
    title: "Thi công đá ốp cầu thang",
    image: "service3.jpg",
  },
  {
    slug: "thi-cong-da-op-bep",
    title: "Thi công đá ốp bếp",
    image: "service4.jpg",
  },
  {
    slug: "thi-cong-tranh-da",
    title: "Thi công tranh đá",
    image: "service5.jpg",
  },
  {
    slug: "thiet-ke-hoa-van-da",
    title: "Thiết kế hoa văn đá",
    image: "service6.jpg",
  },
];

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}) {
  const { locale, slug } = await params;

  const service =
    services.find((item) => item.slug === slug) || services[0];

  return (
    <div className="page-wrapper">
      <Header />

      <PageHeader title=""   bgImage = "/assets/images/backgrounds/PACSTONE-DICHVU-header.png"/>

      <section className="service-details section-space">
        <div className="container">
          <div className="row gutter-y-30">
            <div className="col-md-12 col-lg-4">
              <div className="service-sidebar">
                <div className="service-sidebar__info service-sidebar__single">
                  <ul className="list-unstyled service-sidebar__nav">
                    {services.map((item) => (
                      <li
                        key={item.slug}
                        className={
                          item.slug === slug ? "current" : ""
                        }
                      >
                        <a href={`/${locale}/dich-vu/${item.slug}`}>
                          {item.title}
                        </a>
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
                        <span className="icon-telephone"></span>
                      </div>

                      <div className="service-sidebar__contact__content">
                        <h4 className="service-sidebar__contact__time">
                          LIÊN HỆ NGAY
                        </h4>

                        <h4 className="service-sidebar__contact__number">
                          <a href="tel:+84909888899">
                            0909.8888.99
                          </a>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="service-sidebar__single">
                  <div className="service-sidebar__company">
                    <a href="#" className="service-sidebar__company__btn">
                      <span className="icon-download"></span>
                    </a>

                    <h4 className="service-sidebar__company__title">
                      Hồ sơ năng lực
                    </h4>
                  </div>

                  <div className="service-sidebar__company">
                    <a href="#" className="service-sidebar__company__btn">
                      <span className="icon-download"></span>
                    </a>

                    <h4 className="service-sidebar__company__title">
                      Brochure sản phẩm
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-lg-8">
              <div className="service-details__content">
                <div className="service-details__inner">
                  <h3 className="service-details__title">
                    {service.title}
                  </h3>

                  <div className="service-details__thumbnail">
                    <img
                      src={`/assets/images/services/${service.image}`}
                      alt={service.title}
                    />
                  </div>

                  <p className="service-details__text">
                    Tại Công ty Cổ phần Đá quốc tế Phúc Nam, chúng tôi tự hào
                    mang đến cho bạn dịch vụ thi công đá cao cấp với tính thẩm
                    mỹ và độ bền vượt trội. Đội ngũ chuyên nghiệp của chúng tôi
                    cam kết mang lại giải pháp hoàn hảo cho mọi công trình.
                  </p>
                </div>

                <div className="service-details__inner-two">
                  <h3 className="service-details__sub-title">
                    Dịch vụ của chúng tôi cung cấp cho Bạn những gì?
                  </h3>

                  <p className="service-details__text">
                    <strong>• Tư Vấn Thiết Kế:</strong> Chúng tôi tư vấn giải
                    pháp phù hợp nhất với từng không gian.
                    <br />
                    <br />

                    <strong>• Vật Liệu Cao Cấp:</strong> Đá tự nhiên nhập khẩu
                    chất lượng cao từ nhiều quốc gia.
                    <br />
                    <br />

                    <strong>• Thi Công Chuyên Nghiệp:</strong> Quy trình thi
                    công chuẩn xác, đội ngũ lành nghề.
                    <br />
                    <br />

                    <strong>• Bảo Hành Chu Đáo:</strong> Chính sách hậu mãi và
                    bảo hành rõ ràng.
                  </p>
                </div>

                <div className="service-details__info">
                  <ul className="list-unstyled service-details__list">
                    <li>
                      <span className="icon-check"></span>
                      Tư vấn miễn phí
                    </li>

                    <li>
                      <span className="icon-check"></span>
                      Thi công chuyên nghiệp
                    </li>

                    <li>
                      <span className="icon-check"></span>
                      Sản phẩm đa dạng
                    </li>

                    <li>
                      <span className="icon-check"></span>
                      Bảo hành chu đáo
                    </li>
                  </ul>

                  <img
                    src="/assets/images/services/service-d-list-1.jpg"
                    alt="service"
                    className="service-details__info__image"
                  />
                </div>

                <p className="service-details__text-two">
                  Công ty Cổ phần Đá quốc tế Phúc Nam - Nơi kiến tạo không gian
                  sống đẳng cấp.
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