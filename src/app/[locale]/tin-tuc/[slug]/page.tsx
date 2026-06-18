import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import {
  getAllPostTags,
  getFeaturedPosts,
  getPostBySlug,
  getPostsPage,
} from "@/server/post/post.data";

type Locale = "vi" | "en";

type NewsTagItem = {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
};

const newsDetailContent = {
  vi: {
    searchTitle: "Tìm kiếm",
    searchPlaceholder: "Từ khóa",
    searchSubmit: "Gửi tìm kiếm",
    categoriesTitle: "Danh mục",
    featuredTitle: "Bài viết nổi bật",
    tagsTitle: "Tags",
    shareTitle: "Chia sẻ:",
    allLabel: "Tất cả",
    imageAlt: "chi tiết bài viết",
    dateLocale: "vi-VN",
  },
  en: {
    searchTitle: "Search",
    searchPlaceholder: "Keyword",
    searchSubmit: "Submit search",
    categoriesTitle: "Categories",
    featuredTitle: "Featured Posts",
    tagsTitle: "Tags",
    shareTitle: "Share:",
    allLabel: "All",
    imageAlt: "blog details",
    dateLocale: "en-US",
  },
};

function newsBaseHref(locale: "vi" | "en") {
  return locale === "vi" ? "/vi/tin-tuc" : "/en/news";
}

function newsDetailHref(locale: "vi" | "en", slug: string) {
  return `${newsBaseHref(locale)}/${slug}`;
}

function getAllLabel(locale: "vi" | "en") {
  return newsDetailContent[locale].allLabel;
}

function isAllLabel(value: string) {
  return value === "Tất cả" || value === "All";
}

function pageHref(locale: "vi" | "en", category?: string, keyword?: string) {
  const base = newsBaseHref(locale);
  const params = new URLSearchParams();

  if (category && !isAllLabel(category)) {
    params.set("category", category);
  }

  if (keyword) {
    params.set("keyword", keyword);
  }

  const query = params.toString();

  return query ? `${base}?${query}` : base;
}

function formatPostDate(date: Date | null, locale: Locale) {
  if (!date) {
    return {
      full: "",
      day: "",
      year: "",
    };
  }

  const dateLocale = newsDetailContent[locale].dateLocale;

  return {
    full: date.toLocaleDateString(dateLocale),
    day: date.toLocaleDateString(dateLocale, {
      day: "2-digit",
      month: "2-digit",
    }),
    year: String(date.getFullYear()),
  };
}

function renderContent(content: any, locale: Locale) {
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
            <img src={item.src} alt={item.alt || newsDetailContent[locale].imageAlt} />
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
export async function generateMetadata({
  params,
}: {
  params: {
    locale: "vi" | "en";
    slug: string;
  };
}): Promise<Metadata> {
  const locale = params.locale === "en" ? "en" : "vi";
  const slug = decodeURIComponent(params.slug);

  const post = await getPostBySlug(locale, slug);

  if (!post) {
    return {};
  }

  return buildMetadata({
    locale,
    path: newsDetailHref(locale, slug),
    title: `${post.title} | P.A.C STONE`,
    description: post.excerpt,
    image: post.thumbnail || "https://pacstone.vn/URL-hinh-share-1200x630.jpg",
    type: "website",
    alternatePaths: {
      vi: `/vi/tin-tuc/${slug}`,
      en: `/en/news/${slug}`,
      xDefault: `/vi/tin-tuc/${slug}`,
    },
  });
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
  const content = newsDetailContent[locale];
  const slug = decodeURIComponent(params.slug);

  const allLabel = getAllLabel(locale);
  const activeCategory = searchParams?.category || allLabel;
  const keyword = searchParams?.keyword || "";

  const [post, latestPosts, posts, allTags] = await Promise.all([
    getPostBySlug(locale, slug),
    getFeaturedPosts(locale),
    getPostsPage(locale),
    getAllPostTags(locale),
  ]);

  if (!post) {
    notFound();
  }

  const date = formatPostDate(post.publishedAt, locale);

  const categories = [
    allLabel,
    ...Array.from(new Set(posts.map((post) => post.category).filter(Boolean))),
  ];

  const categoryCounts: Record<string, number> = {};

  categories.forEach((category) => {
    categoryCounts[category] =
      category === allLabel
        ? posts.length
        : posts.filter((post) => post.category === category).length;
  });

  const postTags =
    "tags" in post && Array.isArray(post.tags)
      ? (post.tags as NewsTagItem[])
      : [];

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
                      {content.searchTitle}
                    </h4>

                    <form
                      action={newsBaseHref(locale)}
                      className="sidebar__search"
                    >
                      {!isAllLabel(activeCategory) && (
                        <input
                          type="hidden"
                          name="category"
                          value={activeCategory}
                        />
                      )}

                      <input
                        type="text"
                        name="keyword"
                        placeholder={content.searchPlaceholder}
                        defaultValue={keyword}
                      />

                      <button type="submit" aria-label={content.searchSubmit}>
                        <span className="icon-search" />
                      </button>
                    </form>
                  </div>

                  <div className="sidebar__categories-wrapper sidebar__single">
                    <h4 className="sidebar__title">{content.categoriesTitle}</h4>

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
                      {content.featuredTitle}
                    </h4>

                    <ul className="sidebar__posts list-unstyled">
                      {latestPosts.map((item) => {
                        const itemDate = formatPostDate(item.publishedAt, locale);

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
                    <h4 className="sidebar__title">{content.tagsTitle}</h4>

                    <div className="sidebar__tags">
                      {allTags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={pageHref(locale, undefined, tag.name)}
                        >
                          {tag.name}
                        </Link>
                      ))}
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
                      {renderContent(post.content, locale)}
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

                      {postTags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={pageHref(locale, undefined, tag.name)}
                        >
                          {tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="blog-details__social">
                    <h4 className="blog-details__meta__title">{content.shareTitle}</h4>

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

      <Footer locale={locale} />
    </div>
  );
}