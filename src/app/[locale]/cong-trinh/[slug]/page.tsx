import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";

export default function WorkDetailPage() {
  return (
    <div className="page-wrapper">
      <Header />

      <PageHeader title="CÔNG TRÌNH" />

      <section className="work-details section-space">
        <div className="container">
          <div className="row gutter-y-60">
            <div className="col-lg-8">
              <div className="work-details__content">
                <div className="work-details__image">
                  <img
                    src="/assets/images/works/project-d-1.jpg"
                    alt="Chi tiết công trình"
                  />
                </div>

                <h3 className="work-details__title">
                  Thi công đá cao cấp cho biệt thự
                </h3>

                <p className="work-details__text work-details__text--one">
                  Phúc Nam thực hiện hạng mục thi công đá tự nhiên cao cấp với
                  tiêu chuẩn hoàn thiện tỉ mỉ, đảm bảo tính thẩm mỹ, độ bền và
                  sự sang trọng cho toàn bộ không gian công trình.
                </p>

                <h3 className="work-details__title">
                  Giải pháp thi công chuyên nghiệp
                </h3>

                <p className="work-details__text work-details__text--two">
                  Dự án được khảo sát kỹ lưỡng, lựa chọn vật liệu phù hợp và
                  triển khai bởi đội ngũ thi công nhiều kinh nghiệm nhằm mang
                  lại hiệu quả tối ưu cho từng hạng mục.
                </p>

                <div className="work-details__inner">
                  <div className="row gutter-y-30">
                    <div className="col-lg-6">
                      <div className="work-details__inner__image">
                        <img
                          src="/assets/images/works/project-d-1-1.jpg"
                          alt="Công trình"
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="work-details__inner__image">
                        <img
                          src="/assets/images/works/project-d-1-2.jpg"
                          alt="Công trình"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="work-details__text work-details__text--three">
                  Từng chi tiết được xử lý cẩn thận từ khâu đo đạc, cắt đá, vận
                  chuyển đến lắp đặt hoàn thiện, giúp công trình đạt độ chính
                  xác và tính đồng bộ cao.
                </p>

                <div className="work-details__testimonial">
                  <p className="work-details__testimonial__text">
                    Phúc Nam luôn hướng đến sự minh bạch, chuyên nghiệp và chất
                    lượng hoàn thiện cao trong từng công trình.
                  </p>

                  <svg
                    className="work-details__testimonial__icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 38 28"
                    fill="none"
                  >
                    <path d="M0 17.4101H7.62083L2.54024 27.5712H10.1611L15.2417 17.4101V2.16846H0V17.4101Z" />
                    <path d="M20.3223 2.16846V17.4101H27.9431L22.8625 27.5712H30.4833L35.5639 17.4101V2.16846H20.3223Z" />
                    <path d="M9.7888 14.7417H2.66797V0.5H16.9096V15.1236L12.02 24.9027H5.51723L10.236 15.4653L10.5978 14.7417H9.7888Z" />
                    <path d="M30.1111 14.7417H22.9902V0.5H37.2319V15.1236L32.3423 24.9027H25.8395L30.5583 15.4653L30.9201 14.7417H30.1111Z" />
                  </svg>
                </div>

                <p className="work-details__text work-details__text--four">
                  Công trình sau khi hoàn thiện mang lại vẻ đẹp sang trọng, hiện
                  đại và phù hợp với phong cách sống cao cấp của chủ đầu tư.
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
                      Ca sĩ Đoàn Di Băng
                    </a>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      Hạng mục:
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      Villa - Penhouse
                    </p>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      Ngày khởi công:
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      10-06-2023
                    </p>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      Ngày hoàn thành:
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      30-08-2023
                    </p>
                  </div>

                  <div className="work-details__sidebar__info">
                    <h4 className="work-details__sidebar__info__title">
                      Ngân sách:
                    </h4>
                    <p className="work-details__sidebar__info__text">
                      Liên hệ
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}