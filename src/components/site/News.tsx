import { getFeaturedPosts } from "@/server/post/post.data";
import type { Locale } from "@/server/post/post.type";

function postHref(locale: Locale, slug: string) {
  return locale === "vi" ? `/vi/tin-tuc/${slug}` : `/en/news/${slug}`;
}

function postListHref(locale: Locale) {
  return locale === "vi" ? "/vi/tin-tuc" : "/en/news";
}

function getPostDate(publishedAt: Date | null) {
  const date = publishedAt ? new Date(publishedAt) : new Date();

  return {
    day: String(date.getDate()).padStart(2, "0"),
    year: String(date.getFullYear()),
  };
}

export async function News({ locale }: { locale: Locale }) {
  const posts = await getFeaturedPosts(locale);

  return (
    <section className="blog-one blog-one--home-two section-space-two pt-sm-3  pt-md-5  pt-lg-5   pt-xl-5   pb-xxl-5 pb-sm-3  pb-md-5  pb-lg-5   pb-xl-5   pb-xxl-5  ">
      <div className="container">
        <div className="blog-one__top">
          <div className="row pb-5 align-items-center">
            <div className="col-lg-8">
              <div className="sec-title">
                <h6 className="sec-title__tagline">
                  {locale === "vi" ? "Tin tức" : "News"}
                </h6>
                <h3 className="sec-title__title">
                  {locale === "vi" ? (
                    <>
                      Cập nhật tin tức
                      <br />&nbsp;&amp; sự kiện nổi bật
                    </>
                  ) : (
                    <>
                      Latest news
                      <br />&nbsp;&amp; featured events
                    </>
                  )}
                </h3>
              </div>

            </div>

            <div className="col-lg-4">
              <div className="blog-one__top__button">
                <a href={postListHref(locale)} className="floens-btn floens-btn--border">
                  <span>{locale === "vi" ? "Xem tất cả" : "View all"}</span>
                  <i>→</i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="row gutter-y-30">
          {posts.map((post) => {
            const date = getPostDate(post.publishedAt);
            const href = postHref(locale, post.slug);

            return (
              <div className="col-md-6 col-lg-4" key={post.id}>
                <div className="blog-card blog-card--two">
                  <div className="blog-card__content">
                    <h3 className="blog-card__title">
                      <a href={href} title={post.title}>
                        {post.title}
                      </a>
                    </h3>
                  </div>

                  <div className="blog-card__image">
                    <img src={post.image} alt={post.title} />
                    <a href={href} className="blog-card__image__link">
                      <span className="sr-only">{post.title}</span>
                    </a>
                  </div>

                  <div className="blog-card__date">
                    <span className="blog-card__date__day">{date.day}</span>
                    <span className="blog-card__date__month">{date.year}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}