import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import type { IconType } from "react-icons";
import { PageHeader } from "@/components/site/PageHeader";
import "@/styles/dichvu.css";
import { LuArrowRight } from "react-icons/lu";
import { FaBuilding, FaImage, FaUtensils } from "react-icons/fa6";
import { MdStairs, MdDesignServices, MdViewColumn } from "react-icons/md";
const services = [
  {
    title: "Thi công đá ốp mặt tiền",
    slug: "thi-cong-da-op-mat-tien",
    image: "service1.jpg",
    Icon: FaBuilding,
  },
  {
    title: "Thi công đá ốp cột",
    slug: "thi-cong-da-op-cot",
    image: "service2.jpg",
    Icon: MdViewColumn
  },
  {
    title: "Thi công đá ốp cầu thang",
    slug: "thi-cong-da-op-cau-thang",
    image: "service3.jpg",
    Icon: MdStairs
  },
  {
    title: "Thiết Kế Thi Công Đá Ốp Sàn Thang Máy",
    slug: "thi-cong-da-op-bep",
    image: "service4.jpg",
    Icon: MdStairs,
  },
  {
    title: "Thi Công Đá Ốp Bếp",
    slug: "thi-cong-tranh-da",
    image: "service5.jpg",
    Icon: FaUtensils
  },
  {
    title: "Thi Công Tranh Đá",
    slug: "thiet-ke-hoa-van-da",
    image: "service6.jpg",
    Icon: FaImage
  },
  {
    title: "Thiết Kế Và Thi Công Hoa Văn Đá",
    slug: "thiet-ke-hoa-van-da",
    image: "service6.jpg",
    Icon: FaImage
  }
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

      <PageHeader title="" bgImage="/assets/images/backgrounds/PACSTONE-DICHVU-header.png" />




      <section className="services-page section-space">
        <div className="container">
          <div className="row gutter-y-30 d-flex justify-center">
           {services.map((service, index) => {
              const Icon = service.Icon;

              return (
                   <div className="col-xl-4 col-md-6" key={`${service.slug}-${index}`}>
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
                          className="service-detail-link"
                        >
                          <span>Xem chi tiết</span>
                          <LuArrowRight className="service-detail-arrow" />
                        </a>

                        <span className="service-card-two__icon">
                          <Icon />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}