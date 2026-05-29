import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import Image from "next/image";
import { FaDownload } from "react-icons/fa";
export default function ContactPage() {
  return (
    <div className="page-wrapper">
      <Header />

      <PageHeader title="" bgImage="/assets/images/backgrounds/PACSTONE-LIENHE-header.png" />


      <section className="contact-one section-space">
        <div
          className="contact-one__bg"
          style={{
            backgroundImage: "url('/assets/images/backgrounds/8.png')", opacity: 0.2,
          }}
        />

        <div className="container">
          <div className="row gutter-y-40">
            <div className="col-lg-6">
              <div className="contact-one__content">
                <div className="sec-title sec-title--border">
                  <h6 className="sec-title__tagline">liên hệ</h6>
                  <h3 className="sec-title__title">
                    Chúng Tôi Luôn Sẵn Sàng Lắng Nghe Bạn!
                  </h3>
                </div>

                <p className="contact-one__text">
                  <strong>
                    Bạn đang tìm kiếm đơn vị thi công, thiết kế đá hoa cương?
                  </strong>
                  <br />
                  Đừng ngần ngại, hãy liên hệ với chúng tôi ngay hôm nay để được
                  tư vấn miễn phí từ đội ngũ chuyên gia hàng đầu.
                </p>


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
                      Gửi tin nhắn cho chúng tôi
                    </h2>
                  </div>

                  <div className="form-one__group form-one__group--grid">
                    <div className="form-one__control form-one__control--input form-one__control--full">
                      <input type="text" name="name" placeholder="Họ và tên" />
                    </div>

                    <div className="form-one__control form-one__control--full">
                      <input type="email" name="email" placeholder="Email" />
                    </div>

                    <div className="form-one__control form-one__control--full">
                      <input type="text" name="phone" placeholder="Điện thoại" />
                    </div>

                    <div className="form-one__control form-one__control--mesgae form-one__control--full">
                      <textarea name="message" placeholder="Nội dung" />
                    </div>

                    <div className="form-one__control form-one__control--full">
                      <button type="submit" className="floens-btn">
                        <span>Gửi nội dung</span>
                        <i className="icon-right-arrow" />
                      </button>
                    </div>
                  </div>
                </form>

              </div>
            </div>


            <div className="contact-right col-lg-6">
              {/* Thẻ bọc ngoài đơn giản, không cố định aspectRatio để chiều cao tự bung theo ảnh */}
              <div className="doc-card-item">
                <Image
                  src="/assets/images/lienhe/ShowroomPAC.png"
                  alt="Hồ sơ năng lực P.A.C Stone"
                  width={1448}
                  height={1086}
                  sizes="(max-width: 991px) 100vw, 50vw"
                  className="doc-thumb-img"
                />
              </div>
              <div className="doc-a4-grid">

                {/* Ảnh A4 thứ nhất */}
                <div className="doc-a4-item">
                  <Image
                    src="/assets/images/lienhe/Ho_So_Nang_Luc_PAC_STONE.png"
                    alt="Hồ sơ năng lực P.A.C Stone"
                    width={210}
                    height={297}
                    sizes="(max-width: 800px) 50vw, 25vw"
                    className="doc-a4-img"
                  />
                </div>
                <div className="doc-a4-item">
                  <Image
                    src="/assets/images/lienhe/Giay_phep_PAC_STONE.png"
                    alt="Giấy phép kinh doanh"
                    width={210}
                    height={297}
                    sizes="(max-width: 800px) 50vw, 25vw"
                    className="doc-a4-img"
                  />
                </div>

              </div>
              <div className="download-box ">
                <button className="download-btn">
                  <FaDownload />
                </button>
                <div className="download-content">
                  Tải Hồ Sơ Năng Lực P.A.C STONE
                </div>
              </div>
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
            {/* <iframe
              src="https://www.google.com/maps/d/edit?mid=1OxB97mvj7vH_G3AYETY6GQ_TvRiiSQg&usp=sharing"
              className="map__contact"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
             */}
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.711720994874!2d106.60632847588039!3d10.833359189318921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752bcbcc04a65b%3A0x167f4583efb11f20!2zMzI0IMSQLiBQaGFuIFbEg24gSOG7m24sIMSQw7RuZyBIxrBuZyBUaHXhuq1uLCBI4buTIENow60gTWluaCAxMDAwMCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1780051691033!5m2!1svi!2s" width="600" height="450"></iframe>          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}