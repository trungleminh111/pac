import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";

const services = [
  {
    title: "Thi công đá ốp mặt tiền",
    slug: "thi-cong-da-op-mat-tien",
    image: "service1.jpg",
    icon: "icon-tile",
  },
  {
    title: "Thi công đá ốp cột",
    slug: "thi-cong-da-op-cot",
    image: "service2.jpg",
    icon: "icon-parquet",
  },
  {
    title: "Thi công đá ốp cầu thang",
    slug: "thi-cong-da-op-cau-thang",
    image: "service3.jpg",
    icon: "icon-tiles",
  },
  {
    title: "Thi công đá ốp bếp",
    slug: "thi-cong-da-op-bep",
    image: "service4.jpg",
    icon: "icon-carpet",
  },
  {
    title: "Thi công tranh đá",
    slug: "thi-cong-tranh-da",
    image: "service5.jpg",
    icon: "icon-wood-board",
  },
  {
    title: "Thiết kế hoa văn đá",
    slug: "thiet-ke-hoa-van-da",
    image: "service6.jpg",
    icon: "icon-stones",
  },
];

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="page-wrapper">
      <Header />

      <PageHeader title="DỊCH VỤ" />

      <section className="services-page section-space">
        <div className="container">
          <div className="row gutter-y-30">
            {services.map((service) => (
              <div className="col-xl-4 col-md-6" key={service.slug}>
                <div className="service-card-two">
                  <div
                    className="service-card-two__bg"
                    style={{
                      backgroundImage:
                        "url('/assets/images/services/service-bg-2-1.png')",
                    }}
                  />

                  <div className="service-card-two__image">
                    <img
                      src={`/assets/images/services/${service.image}`}
                      alt={service.title}
                    />
                  </div>

                  <div className="service-card-two__content">
                    <h3 className="service-card-two__title">
                      <a href={`/${locale}/dich-vu/${service.slug}`}>
                        {service.title}
                      </a>
                    </h3>

                    <div className="service-card-two__bottom">
                      <a
                        href={`/${locale}/dich-vu/${service.slug}`}
                        className="service-card-two__link floens-btn"
                      >
                        <span>Xem chi tiết</span>
                        <i className="icon-right-arrow" />
                      </a>

                      <span
                        className={`service-card-two__icon ${service.icon}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}