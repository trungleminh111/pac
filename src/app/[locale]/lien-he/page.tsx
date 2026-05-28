import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";

export default function ContactPage() {
  return (
    <div className="page-wrapper">
      <Header />

      <PageHeader title="LIÊN HỆ" />

      <section className="contact-one section-space">
        <div
          className="contact-one__bg"
          style={{
            backgroundImage: "url('/assets/images/backgrounds/contact-bg-1.png')",
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

                <div className="contact-one__info">
                  <div
                    className="contact-one__info__bg"
                    style={{
                      backgroundImage:
                        "url('/assets/images/shapes/contact-info-bg.png')",
                    }}
                  />

                  <div className="contact-one__info__content">
                    <div className="contact-one__info__item">
                      <div className="contact-one__info__item__inner">
                        <div className="contact-one__info__icon">
                          <span className="icon-phone-call" />
                        </div>
                        <p className="contact-one__info__text">
                          <a href="tel:+84909888899">0909.8888.99</a>
                        </p>
                      </div>
                    </div>

                    <div className="contact-one__info__item">
                      <div className="contact-one__info__item__inner">
                        <div className="contact-one__info__icon">
                          <span className="icon-paper-plane" />
                        </div>
                        <p className="contact-one__info__text">
                          <a href="mailto:hotro@phucnam.com">
                            hotro@phucnam.com
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="contact-one__info__item">
                      <div className="contact-one__info__item__inner">
                        <div className="contact-one__info__icon">
                          <span className="icon-location" />
                        </div>
                        <address className="contact-one__info__text">
                          <a href="https://www.google.com/maps">
                            324-326 Phan Văn Hớn, P.Tân Thới Nhất, Q.12, TPHCM
                          </a>
                        </address>
                      </div>
                    </div>
                  </div>

                  <img
                    src="/assets/images/shapes/contact-shape-1-1.png"
                    alt="contact"
                    className="contact-one__info__image"
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
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
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.7132667039778!2d106.60633147480583!3d10.833241089319026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752b39af9e5153%3A0x4ac6e9eee614a19a!2zMzI0IFBoYW4gVsSDbiBI4bubbiwgVMOibiBUaOG7m2kgTmjhuqV0LCBRdeG6rW4gMTIsIEjhu5MgQ2jDrSBNaW5oIDcwMDAwLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1718622236816!5m2!1svi!2s"
              className="map__contact"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}