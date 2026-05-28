import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";

const product = {
  name: "Marble Xanh MPN001",
  price: "10,500,000",
  origin: "Ấn Độ",
  size: "Khổ lớn, Khổ nhỏ (Độ dày 2cm)",
  images: [
    "product-1-1.jpg",
    "product-d-1-1.jpg",
    "product-d-1-2.jpg",
  ],
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="page-wrapper">
      <Header />

      <PageHeader title="SẢN PHẨM" />

      <section className="product-details section-space">
        <div className="container">
          <div className="row gutter-y-50">
            <div className="col-lg-6 col-xl-6">
              <div className="product-details__img">
                <div className="swiper product-details__gallery-top">
                  <div className="swiper-wrapper">
                    <div className="swiper-slide">
                      <img
                        src={`/assets/images/products/${product.images[0]}`}
                        alt={product.name}
                        className="product-details__gallery-top__img"
                      />
                    </div>
                  </div>
                </div>

                <div className="swiper product-details__gallery-thumb">
                  <div className="swiper-wrapper">
                    {product.images.map((image) => (
                      <div
                        className="product-details__gallery-thumb-slide swiper-slide"
                        key={image}
                      >
                        <img
                          src={`/assets/images/products/${image}`}
                          alt={product.name}
                          className="product-details__gallery-thumb__img"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-xl-6">
              <div className="product-details__content">
                <div className="product-details__top">
                  <div className="product-details__top__left">
                    <h3 className="product-details__name">{product.name}</h3>
                    <h4 className="product-details__price">{product.price}</h4>
                  </div>

                  <a
                    href="https://www.youtube.com/watch?v=h9MbznbxlLc"
                    className="product-details__video video-button video-popup"
                  >
                    <span className="icon-play" />
                    <i className="video-button__ripple" />
                  </a>
                </div>

                <div className="product-details__review">
                  <div className="floens-ratings">
                    <span className="icon-star" />
                    <span className="icon-star" />
                    <span className="icon-star" />
                    <span className="icon-star" />
                    <span className="icon-star" />
                  </div>
                </div>

                <div className="product-details__excerpt">
                  <p className="product-details__excerpt__text1">
                    Đá Marble Xanh Dương có nguồn gốc từ Brazil, đá có màu xanh
                    lá cây kết hợp cùng khoáng sản màu vàng ánh kim phù hợp cho
                    các hạng mục nội ngoại thất cao cấp như khách sạn, trung tâm
                    hội nghị lớn.
                  </p>
                </div>

                <div className="product-details__color">
                  <h3 className="product-details__content__title">Xuất xứ</h3>
                  <div className="product-details__color__box">
                    {product.origin}
                  </div>
                </div>

                <div className="product-details__size">
                  <h3 className="product-details__content__title">Kích thước</h3>
                  <div className="product-details__size__box">{product.size}</div>
                </div>

                <div className="product-details__info">
                  <a
                    href={`/${locale}/lien-he`}
                    className="product-details__btn-cart floens-btn"
                  >
                    <span>Liên hệ</span>
                    <i className="icon-cart" />
                  </a>

                  <div className="product-details__socials">
                    <h3 className="product-details__socials__title">Chia sẻ:</h3>
                    <div className="details-social">
                      <a href="https://facebook.com">
                        <i className="icon-facebook" />
                      </a>
                      <a href="https://twitter.com">
                        <i className="icon-twitter" />
                      </a>
                      <a href="https://linkedin.com">
                        <i className="icon-linkedin" />
                      </a>
                      <a href="https://youtube.com">
                        <i className="icon-youtube" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="product-details__description-wrapper">
          <div className="container">
            <div className="product-details__description">
              <h3 className="product-details__description__title">
                MÔ TẢ SẢN PHẨM
              </h3>

              <div className="product-details__text__box">
                <h3 className="product-details__description__title">
                  1. Khu vực khai thác
                </h3>
                <p className="product-details__description__text">
                  Đá Marble Màu xanh MPN001 là dòng đá tự nhiên được khai thác
                  tại Udaipur, Rajasthan, India.
                </p>

                <h3 className="product-details__description__title">
                  2. Phân tích tổng thể
                </h3>
                <p className="product-details__description__text">
                  <strong>- Tên gọi khác:</strong> Wave Onyx Marble, Green Onyx
                  Marble.
                  <br />
                  <strong>- Mô tả chung:</strong> đá Marble Xanh MPN001 là dòng
                  đá marble có màu sắc xanh ngọc xen lẫn các dải màu xanh đậm,
                  cam hoặc trắng ấn tượng.
                  <br />
                  <strong>- Đặc điểm:</strong> mẫu đá có khả năng xuyên sáng,
                  phù hợp làm điểm nhấn trong không gian nội thất cao cấp.
                </p>

                <h3 className="product-details__description__title">
                  3. Thông số kĩ thuật
                </h3>
                <p className="product-details__description__text">
                  - Chủng loại: đá Marble tự nhiên
                  <br />
                  - Độ cứng: 4Mohs
                  <br />
                  - Khối lượng riêng: 2,71 g/m3
                  <br />
                  - Hấp thụ nước: 0.10%
                  <br />
                  - Độ dày: 2cm
                </p>

                <h3 className="product-details__description__title">
                  4. Ứng dụng
                </h3>
                <p className="product-details__description__text">
                  Đá Marble Xanh MPN001 thích hợp cho các hạng mục như vách ốp
                  tường trang trí, quầy bar, bàn lễ tân, vách thang máy và vách
                  tivi cao cấp.
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