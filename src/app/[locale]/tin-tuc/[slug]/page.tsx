import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import {
  getFeaturedPosts,
  getPostBySlug,
  getPostsPage,
} from "@/server/post/post.data";

function newsBaseHref(locale: "vi" | "en") {
  return locale === "vi" ? "/vi/tin-tuc" : "/en/news";
}

function newsDetailHref(locale: "vi" | "en", slug: string) {
  return `${newsBaseHref(locale)}/${slug}`;
}

function pageHref(locale: "vi" | "en", category?: string, keyword?: string) {
  const base = newsBaseHref(locale);
  const params = new URLSearchParams();

  if (category && category !== "Tất cả") {
    params.set("category", category);
  }

  if (keyword) {
    params.set("keyword", keyword);
  }

  const query = params.toString();

  return query ? `${base}?${query}` : base;
}

function formatPostDate(date: Date | null) {
  if (!date) {
    return {
      full: "",
      day: "",
      year: "",
    };
  }

  return {
    full: date.toLocaleDateString("vi-VN"),
    day: date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    }),
    year: String(date.getFullYear()),
  };
}

function renderContent(content: any) {
  if (!content) return null;

  if (typeof content === "string") {
    return (
      <p className="blog-card__text blog-card__text--one">
        {content}
      </p>
    );
  }

  if (content.html) {
    return (
      <div
        className="blog-card__text blog-card__text--one"
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    );
  }

  if (Array.isArray(content)) {
    return content.map((item, index) => {
      if (item.type === "heading") {
        return (
          <h3 className="blog-card__title" key={index}>
            {item.text}
          </h3>
        );
      }

      if (item.type === "image") {
        return (
          <div
            className="blog-details__inner__image"
            style={{ marginBottom: 15 }}
            key={index}
          >
            <img src={item.src} alt={item.alt || "blog details"} />
          </div>
        );
      }

      return (
        <p className="blog-card__text blog-card__text--one" key={index}>
          {item.text || ""}
        </p>
      );
    });
  }

  return null;
}

export default async function NewsDetailPage({
  params,
  searchParams,
}: {
  params: {
    locale: "vi" | "en";
    slug: string;
  };
  searchParams?: {
    category?: string;
    keyword?: string;
  };
}) {
  const locale = params.locale === "en" ? "en" : "vi";
  const slug = params.slug;

  const activeCategory = searchParams?.category || "Tất cả";
  const keyword = searchParams?.keyword || "";

  const [post, latestPosts, posts] = await Promise.all([
    getPostBySlug(locale, slug),
    getFeaturedPosts(locale),
    getPostsPage(locale),
  ]);

  if (!post) {
    notFound();
  }

  const date = formatPostDate(post.publishedAt);

  const categories = [
    "Tất cả",
    ...Array.from(new Set(posts.map((post) => post.category).filter(Boolean))),
  ];

  const categoryCounts: Record<string, number> = {};

  categories.forEach((category) => {
    categoryCounts[category] =
      category === "Tất cả"
        ? posts.length
        : posts.filter((post) => post.category === category).length;
  });

  return (
    <div className="page-wrapper">
      <Header locale={locale} />

      <PageHeader
        title=""
        bgImage="/assets/images/backgrounds/PACSTONE-TINTUCSUKIEN-header.png"
      />

      <section className="blog-page blog-page--sidebar section-space">
        <div className="container">
          <div className="row gutter-y-60">
            <div className="col-lg-4">
              <div className="sidebar">
                <aside className="widget-area">
                  <div className="sidebar__form sidebar__single">
                    <h4 className="sidebar__title sidebar__form__title">
                      Tìm kiếm
                    </h4>

                    <form
                      action={newsBaseHref(locale)}
                      className="sidebar__search"
                    >
                      {activeCategory !== "Tất cả" && (
                        <input
                          type="hidden"
                          name="category"
                          value={activeCategory}
                        />
                      )}

                      <input
                        type="text"
                        name="keyword"
                        placeholder="Từ khóa"
                        defaultValue={keyword}
                      />

                      <button type="submit" aria-label="search submit">
                        <span className="icon-search" />
                      </button>
                    </form>
                  </div>

                  <div className="sidebar__categories-wrapper sidebar__single">
                    <h4 className="sidebar__title">Danh mục</h4>

                    <ul className="sidebar__categories list-unstyled">
                      {categories.map((name) => (
                        <li
                          key={name}
                          className={activeCategory === name ? "active" : ""}
                        >
                          <Link href={pageHref(locale, name, keyword)}>
                            <span>{name}</span>
                            <span className="sidebar__count">
                              ({categoryCounts[name]})
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="sidebar__posts-wrapper sidebar__single">
                    <h4 className="sidebar__title sidebar__posts-title">
                      Bài viết nổi bật
                    </h4>

                    <ul className="sidebar__posts list-unstyled">
                      {latestPosts.map((item) => {
                        const itemDate = formatPostDate(item.publishedAt);

                        return (
                          <li className="sidebar__posts__item" key={item.id}>
                            <div className="sidebar__posts__image">
                              <img src={item.image} alt={item.title} />
                            </div>

                            <div className="sidebar__posts__content">
                              <p className="sidebar__posts__meta">
                                <Link href={newsDetailHref(locale, item.slug)}>
                                  {itemDate.full}
                                </Link>
                              </p>

                              <h4 className="sidebar__posts__title">
                                <Link href={newsDetailHref(locale, item.slug)}>
                                  {item.title}
                                </Link>
                              </h4>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="sidebar__tags-wrapper sidebar__single">
                    <h4 className="sidebar__title">Tags</h4>

                    <div className="sidebar__tags">
                      <Link href={pageHref(locale, undefined, "Đá marble")}>
                        Đá marble
                      </Link>
                      <Link href={pageHref(locale, undefined, "Đá phong thủy")}>
                        Đá phong thủy
                      </Link>
                      <Link
                        href={pageHref(
                          locale,
                          undefined,
                          "Thiết kế hoa văn đá"
                        )}
                      >
                        Thiết kế hoa văn đá
                      </Link>
                      <Link href={pageHref(locale, undefined, "Thị trường đá")}>
                        Thị trường đá
                      </Link>
                    </div>
                  </div>
                </aside>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="blog-details">
                <div className="blog-card">
                  <h3 className="blog-card__title">{post.title}</h3>

                  <div className="blog-card__image">
                    <img
                      src={post.thumbnail || "/assets/images/blog/blog-1-1.jpg"}
                      alt={post.title}
                    />

                    <div className="blog-card__date">
                      <span className="blog-card__date__day">{date.day}</span>
                      <span className="blog-card__date__month">
                        {date.year}
                      </span>
                    </div>
                  </div>

                  <div className="blog-card__content">
                    {post.excerpt && (
                      <p className="blog-card__text blog-card__text--one">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="w-100 overflow-hidden">
                      {renderContent(post.content)}
                    </div>
                  </div>
                </div>

                <div className="blog-details__meta">
                  <div className="blog-details__tags">
                    <h4 className="blog-details__meta__title">Tags:</h4>

                    <div className="blog-details__tags__box">
                      {post.categoryName && (
                        <Link
                          href={pageHref(locale, post.categoryName, undefined)}
                        >
                          {post.categoryName}
                        </Link>
                      )}

                      <Link href={pageHref(locale, undefined, "Đá marble")}>
                        Đá marble
                      </Link>
                    </div>
                  </div>

                  <div className="blog-details__social">
                    <h4 className="blog-details__meta__title">Chia sẻ:</h4>

                    <div className="details-social">
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Facebook"
                      >
                        <i className="icon-facebook">
                          <FaFacebookF />
                        </i>
                      </a>

                      <a
                        href="https://zalo.com"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Zalo"
                      >
                        <img
                          src="/assets/images/Icon_of_Zalo.svg.webp"
                          alt="Zalo"
                        />
                      </a>

                      <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Youtube"
                      >
                        <i className="icon-youtube">
                          <FaYoutube />
                        </i>
                      </a>
                    </div>
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