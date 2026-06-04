import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";

export default function WorkDetailPage() {
  const project = {
    title: "Từ lâu người ta đã biết rằng độc giả sẽ",
    //100 - 200 ký tự
    intro:
      "Phúc Nam Stone thực hiện thi công toàn bộ hạng mục đá Marble tự nhiên cho biệt thự cao cấp, bao gồm sảnh chính, cầu thang, phòng khách và các khu vực trang trí.",

    mainImage: "slidechinh.jpg",
    //100 - 200 ký tự
    content1:
      "Có rất nhiều biến thể của đoạn văn Lorem Ipsum, nhưng phần lớn đã bị thay đổi ở một số dạng, bằng cách thêm vào yếu tố hài hước hoặc sử dụng các từ ngẫu nhiên không hề đáng tin cậy. Nếu bạn bạn cần chắc chắn rằng không có bất kỳ điều gì đáng xấu hổ ẩn giấu ở giữa văn bản.  ",

    subTitle: "Tôi có thể mua chúng ở đâu?",

    content2:
      "Ý tưởng sai lầm về việc lên án khoái lạc và ca ngợi nỗi đau đã ra đời và tôi sẽ cung cấp cho bạn một bản tường thuật đầy đủ về hệ thống này, và trình bày những lời dạy thực tế của nhà thám hiểm vĩ đại về chân lý, người kiến ​​tạo hạnh phúc của con người. Không ai bác bỏ, không thích.",

    gallery: ["project-9.jpg", "project-10.jpg"],

    content3:
      "Có rất nhiều biến thể của đoạn văn Lorem Ipsum, nhưng phần lớn đã bị thay đổi dưới một hình thức nào đó, bằng cách thêm vào sự hài hước, hoặc các từ ngẫu nhiên trông không hề đáng tin cậy. Nếu bạn định sử dụng một đoạn văn Lorem Ipsum, bạn cần chắc chắn rằng không có bất kỳ điều gì đáng xấu hổ ẩn giấu ở giữa văn bản. Tất cả các trình tạo Lorem Ipsum trên Internet đều có xu hướng lặp lại các đoạn được xác định trước khi cần thiết, khiến đây trở thành trình tạo thực sự đầu tiên trên Internet. Nó sử dụng một từ điển gồm hơn 200 từ tiếng Latin.",
    content4:
      "Ý tưởng sai lầm về việc lên án khoái lạc và ca ngợi nỗi đau đã ra đời và tôi sẽ cung cấp cho bạn một bản tường thuật đầy đủ về hệ thống này, và trình bày những lời dạy thực tế của nhà thám hiểm vĩ đại về chân lý, người kiến ​​tạo hạnh phúc của con người. Không ai bác bỏ, không thích.",

    info: {
      customer: "Anh Nguyễn Văn A",
      category: "Villa - Penhouse",
      startDate: "10-06-2023",
      endDate: "30-08-2023",
      budget: "3.5 tỷ VNĐ",
    },
  };
  return (
    <div className="page-wrapper">
      <Header />

      <PageHeader title="" bgImage="/assets/images/backgrounds/PACSTONE-CONGTRINH-header.png" />


      <section className="work-details section-space service-laptop">
        <div className="container">
          <div className="row gutter-y-60">
            <div className="col-lg-8">


              <h2 className="work-details__title text-justify">
                {project.title}
              </h2>

              <p className="work-details__text text-justify">
                {project.intro}
              </p>

              <img
                src={`/assets/images/works/${project.mainImage}`}
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

            <div className="col-lg-4 mt-5">

              <div className="work-details__inner d-flex gap-4 flex-column ">
                  {project.gallery.map((image) => (
                    <div className="" key={image}>
                      <img
                        src={`/assets/images/works/${image}`}
                        alt={project.title}
                      />
                    </div>
                  ))}
             
              </div>

            </div>
            <div className="col-lg-8 mt-5">
               <h3 className="work-details__title text-justify">
                {project.subTitle}
              </h3>

              <p className="work-details__text text-justify">
                {project.content2}
              </p>

                <p className="work-details__text text-justify">
                  {project.content3}
                </p>
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
                <div className="work-details__image">
                  <img
                    src={`/assets/images/works/${project.mainImage}`}
                    alt={project.title}
                  />
                </div>
                <h3 className="work-details__title text-justify">
                  {project.subTitle}
                </h3>


                <p className="work-details__text work-details__text--two text-justify">
                  {project.content2}
                </p>

                <div className="work-details__inner">
                  <div className="row gutter-y-30">
                    <div className="col-lg-6">
                      <div className="col-lg-6" key={project.gallery[0]}>
                        <img
                          src={`/assets/images/works/${project.gallery[0]}`}
                          alt={project.title}
                        />
                      </div>
                    </div>
                    <p className="work-details__text work-details__text--three text-justify">
                      {project.content3}
                    </p>

                    <div className="col-lg-6 my-0">
                      <div className="col-lg-6" key={project.gallery[1]}>
                        <img
                          src={`/assets/images/works/${project.gallery[1]}`}
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
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}