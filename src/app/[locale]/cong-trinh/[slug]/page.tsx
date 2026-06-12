import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { FaStar, FaCartShopping } from "react-icons/fa6";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Locale } from "@prisma/client";
import { getProjectBySlug } from "@/server/project/project.query";
import Banner from "@/components/site/Banner/Banner";

export default async function WorkDetailPage({
  params,
}: {
  params: {
    locale: "vi" | "en";
    slug: string;
  };
}) {
  const locale = params.locale === "en" ? "en" : "vi";

  const projectData = await getProjectBySlug({
    slug: params.slug,
    locale: locale === "en" ? Locale.en : Locale.vi,
  });

  if (!projectData || !projectData.translations[0]) {
    return null;
  }

  const translation = projectData.translations[0];
  const structuredData: any =
    translation.structuredData || translation.content || {};
  const blocks = structuredData.blocks || [];

  const block1 =
    blocks.find((item: any) => item.type === "titleTextImageText") ||
    blocks[0] ||
    {};

  const block2 =
    blocks.find((item: any) => item.type === "twoImagesContent") ||
    blocks[1] ||
    {};

  const project = {
    title: translation.title,
    intro: translation.excerpt || "",
    mainImage: projectData.thumbnail || block1.image || "",
    content1: block1.textTop || "",
    subTitle: block1.title || "",
    content2: block1.textBottom || "",
    gallery: [block2.image1, block2.image2].filter(Boolean),
    content3: block2.content1 || "",
    content4: block2.content2 || "",
    info: {
      customer: projectData.clientName || "",
      category:
        locale === "en" && projectData.category?.nameEn
          ? projectData.category.nameEn
          : projectData.category?.nameVi || "",
      startDate: projectData.startedAt
        ? projectData.startedAt.toLocaleDateString("vi-VN")
        : "",
      endDate: projectData.completedAt
        ? projectData.completedAt.toLocaleDateString("vi-VN")
        : "",
      budget: projectData.budget || "",
    },
  };
  return (
    <div className="page-wrapper">
      <Header locale={locale} />

      {/* <PageHeader title="" bgImage="/assets/images/backgrounds/PACSTONE-CONGTRINH-header.png" /> */}
       <Banner
        title="CÔNG TRÌNH"
        backgroundImg="/assets/images/backgrounds/contruct-banner.webp"
        row={2}
        col={1}
      />

      <section className="work-details section-space service-laptop">
        <div className="container">
          <div className="row gutter-y-60">
            <div className="col-lg-8 work-details__inner work-details__inner__image">


              <h2 className="work-details__title text-justify">
                {project.title}
              </h2>

              <p className="work-details__text text-justify">
                {project.intro}
              </p>

              <img
                src={project.mainImage}
                alt={project.title}
              />

              <p className="work-details__text text-justify">
                {project.content1}
              </p>
            </div>

            <div className="col-lg-4">
              <aside className="work-details__sidebar">
                <h3 className="work-details__sidebar__title">
                  Thông tin công trình
                </h3>

                <div className="work-details__sidebar__inner">
                  <div className="work-details__sidebar__info work-details__sidebar__info--client">
                    <h4 className="work-details__sidebar__info__title work-details__sidebar__info__title--client">
                      Khách hàng:
                    </h4>
                    <a
                      href="#"
                      className="work-details__sidebar__info__text work-details__sidebar__info__text--link"
                    >
                      {project.info.customer}
                    </a>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      Hạng mục:
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      {project.info.category}
                    </p>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      Ngày khởi công:
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      {project.info.startDate}
                    </p>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      Ngày hoàn thành:
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      {project.info.endDate}
                    </p>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      Ngân sách:
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      {project.info.budget}
                    </p>
                  </div>
                </div>
              </aside>
            </div>

            <div className="col-lg-4 mt-0 work-details__inner work-details__inner__image">

              <div className="work-details__inner d-flex gap-4 flex-column ">
                {project.gallery.map((image) => (
                  <div className="" key={image}>
                    <img
                      src={image}
                      alt={project.title}
                    />
                  </div>
                ))}

              </div>

            </div>
            <div className="col-lg-8 mt-0 d-flex flex-column pb-4">
              <h3 className="work-details__title text-justify">
                {project.subTitle}
              </h3>

              <p className="work-details__text text-justify">
                {project.content2}
              </p>

              <p className="work-details__text text-justify">
                {project.content3}
              </p>
              <p className="work-details__text text-justify">
                {project.content4}
              </p>
              {/* Đẩy xuống cuối */}
              <div className="product-details__socials mt-auto bottom-bar" style={{ paddingBottom: 38 }}>
                <a href="#" className="floens-btn  btn-consult">CẦN TƯ VẤN - BÁO GIÁ</a>

                <div className="pagination">
                  <button className="pagination__arrow">
                    <FaChevronLeft />
                  </button>
                  <span className="pagination__item active">01</span>
                  <span className="pagination__item">02</span>
                  <span className="pagination__item">03</span>

                  <button className="pagination__arrow">
                    <FaChevronRight />
                  </button>
                </div>


                <div className="details-social">
                  <h3 className="product-details__socials__title">
                    {locale === "vi" ? "Chia sẻ:" : "Share:"}
                  </h3>
                  <Link href="https://facebook.com" target="_blank">
                    <i className="icon-facebook">
                      <FaFacebookF />
                    </i>
                  </Link>

                  <Link href="https://zalo.com" target="_blank">
                    <img
                      src="/assets/images/Icon_of_Zalo.svg.webp"
                      alt="Zalo"
                    />
                  </Link>

                  <Link href="https://youtube.com" target="_blank">
                    <i className="icon-youtube">
                      <FaYoutube />
                    </i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="work-details section-space service-tablet-phone">
        <div className="container">
          <div className="row gutter-y-60">
            <div className="col-lg-8">
              <div className="work-details__content">


                <h3 className="work-details__title text-justify">
                  {project.title}
                </h3>

                <p className="work-details__text work-details__text--one text-justify">
                  {project.content1}
                </p>
                <div className="work-details__image work-details__inner work-details__inner__image">
                  <img
                    src={project.mainImage}
                    alt={project.title}
                  />
                </div>
                <h3 className="work-details__title text-justify mt-0">
                  {project.subTitle}
                </h3>


                <p className="work-details__text work-details__text--two text-justify">
                  {project.content2}
                </p>

                <div className="work-details__inner">
                  <div className="row gutter-y-30">
                    <div className="col-lg-6 work-details__inner work-details__inner__image">
                      <div className="col-lg-6" key={project.gallery[0]}>
                        <img
                          src={project.gallery[0]}
                          alt={project.title}
                        />
                      </div>
                    </div>
                    <p className="work-details__text work-details__text--three text-justify">
                      {project.content3}
                    </p>

                    <div className="col-lg-6 my-0 work-details__inner work-details__inner__image">
                      <div className="col-lg-6" key={project.gallery[1]}>
                        <img
                          src={project.gallery[1]}
                          alt={project.title}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="work-details__text work-details__text--four text-justify" >
                  {project.content4}
                </p>

              </div>
            </div>

            <div className="col-lg-4">
              <aside className="work-details__sidebar">
                <h3 className="work-details__sidebar__title">
                  Thông tin công trình
                </h3>

                <div className="work-details__sidebar__inner">
                  <div className="work-details__sidebar__info work-details__sidebar__info--client">
                    <h4 className="work-details__sidebar__info__title work-details__sidebar__info__title--client">
                      Khách hàng:
                    </h4>
                    <a
                      href="#"
                      className="work-details__sidebar__info__text work-details__sidebar__info__text--link"
                    >
                      {project.info.customer}
                    </a>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      Hạng mục:
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      {project.info.category}
                    </p>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      Ngày khởi công:
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      {project.info.startDate}
                    </p>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      Ngày hoàn thành:
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      {project.info.endDate}
                    </p>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      Ngân sách:
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      {project.info.budget}
                    </p>
                  </div>
                </div>
              </aside>
              <div className=" mt-auto bottom-bar-phone" >
                <a href="#" className="floens-btn  btn-consult">CẦN TƯ VẤN - BÁO GIÁ</a>

                <div className="details-social">
                  <h3 className="product-details__socials__title">
                    {locale === "vi" ? "Chia sẻ:" : "Share:"}
                  </h3>
                  <Link href="https://facebook.com" target="_blank">
                    <i className="icon-facebook">
                      <FaFacebookF />
                    </i>
                  </Link>

                  <Link href="https://zalo.com" target="_blank">
                    <img
                      src="/assets/images/Icon_of_Zalo.svg.webp"
                      alt="Zalo"
                    />
                  </Link>

                  <Link href="https://youtube.com" target="_blank">
                    <i className="icon-youtube">
                      <FaYoutube />
                    </i>
                  </Link>
                </div>

                <div className="pagination">
                  <button className="pagination__arrow">
                    <FaChevronLeft />
                  </button>
                  <span className="pagination__item active">01</span>
                  <span className="pagination__item">02</span>
                  <span className="pagination__item">03</span>

                  <button className="pagination__arrow">
                    <FaChevronRight />
                  </button>
                </div>

              </div>
              <div className="product-details__socials mt-auto bottom-bar-tablet" style={{ paddingBottom: 38 }}>
                <a href="#" className="floens-btn  btn-consult">CẦN TƯ VẤN - BÁO GIÁ</a>

                <div className="pagination">
                  <button className="pagination__arrow">
                    <FaChevronLeft />
                  </button>
                  <span className="pagination__item active">01</span>
                  <span className="pagination__item">02</span>
                  <span className="pagination__item">03</span>

                  <button className="pagination__arrow">
                    <FaChevronRight />
                  </button>
                </div>


                <div className="details-social">
                  <h3 className="product-details__socials__title">
                    {locale === "vi" ? "Chia sẻ:" : "Share:"}
                  </h3>
                  <div>

                    <Link href="https://facebook.com" target="_blank">
                      <i className="icon-facebook">
                        <FaFacebookF />
                      </i>
                    </Link>

                    <Link href="https://zalo.com" target="_blank">
                      <img
                        src="/assets/images/Icon_of_Zalo.svg.webp"
                        alt="Zalo"
                      />
                    </Link>

                    <Link href="https://youtube.com" target="_blank">
                      <i className="icon-youtube">
                        <FaYoutube />
                      </i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}