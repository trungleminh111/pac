import Link from "next/link";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { getFeaturedPosts, getPostsPage } from "@/server/post/post.data";
import Banner from "@/components/site/Banner/Banner";

function pageHref(
  locale: "vi" | "en",
  category?: string,
  keyword?: string,
  page?: number
) {
  const base = locale === "vi" ? "/vi/tin-tuc" : "/en/news";
  const params = new URLSearchParams();

  if (category && category !== "Tất cả") {
    params.set("category", category);
  }

  if (keyword) {
    params.set("keyword", keyword);
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `${base}?${query}` : base;
}

function getPostHref(locale: "vi" | "en", slug: string) {
  return locale === "vi" ? `/vi/tin-tuc/${slug}` : `/en/news/${slug}`;
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

function getCategories(posts: Awaited<ReturnType<typeof getPostsPage>>) {
  return [
    "Tất cả",
    ...Array.from(new Set(posts.map((post) => post.category).filter(Boolean))),
  ];
}

function getCategoryCounts(
  posts: Awaited<ReturnType<typeof getPostsPage>>,
  categories: string[]
) {
  const categoryCounts: Record<string, number> = {};

  categories.forEach((category) => {
    categoryCounts[category] =
      category === "Tất cả"
        ? posts.length
        : posts.filter((post) => post.category === category).length;
  });

  return categoryCounts;
}

function filterPosts(
  posts: Awaited<ReturnType<typeof getPostsPage>>,
  activeCategory: string,
  keyword: string
) {
  const search = keyword.toLowerCase();

  return posts.filter((post) => {
    const matchCategory =
      activeCategory === "Tất cả" || post.category === activeCategory;

    const matchKeyword =
      post.title.toLowerCase().includes(search) ||
      post.excerpt.toLowerCase().includes(search) ||
      post.category.toLowerCase().includes(search);

    return matchCategory && matchKeyword;
  });
}

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: {
    locale: "vi" | "en";
  };
  searchParams?: {
    category?: string;
    keyword?: string;
    page?: string;
  };
}) {
  const locale = params.locale === "en" ? "en" : "vi";

  const activeCategory = searchParams?.category || "Tất cả";
  const keyword = searchParams?.keyword || "";
  const currentPage = Number(searchParams?.page || 1);
  const itemsPerPage = 4;

  const [latestPosts, posts] = await Promise.all([
    getFeaturedPosts(locale),
    getPostsPage(locale),
  ]);

  const categories = getCategories(posts);
  const categoryCounts = getCategoryCounts(posts, categories);
  const filteredPosts = filterPosts(posts, activeCategory, keyword);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="page-wrapper">
      <Header locale={locale} />

      {/* <PageHeader
        title=""
        bgImage="/assets/images/backgrounds/PACSTONE-TINTUCSUKIEN-header.png"
      /> */}
      <Banner
        title="TIN TỨC & SỰ KIỆN"
        backgroundImg="/assets/images/backgrounds/news-banner.webp"
        row={3}
        col={3}
        fontSize="clamp(22px, 3.5vw, 42px)"
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
                      action={`/${locale}/tin-tuc`}
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
                      {latestPosts.map((post) => {
                        const date = formatPostDate(post.publishedAt);
                        const href = getPostHref(locale, post.slug);

                        return (
                          <li className="sidebar__posts__item" key={post.id}>
                            <div className="sidebar__posts__image">
                              <img src={post.image} alt={post.title} />
                            </div>

                            <div className="sidebar__posts__content">
                              <p className="sidebar__posts__meta">
                                <Link href={href}>{date.full}</Link>
                              </p>

                              <h4 className="sidebar__posts__title">
                                <Link href={href}>{post.title}</Link>
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
              <div className="row gutter-y-30">
                {paginatedPosts.map((post) => {
                  const date = formatPostDate(post.publishedAt);
                  const href = getPostHref(locale, post.slug);

                  return (
                    <div
                      className="col-xl-6 col-lg-12 col-md-6"
                      key={post.id}
                    >
                      <div className="blog-card">
                        <div className="blog-card__image">
                          <img src={post.image} alt={post.title} />

                          <Link href={href} className="blog-card__image__link">
                            <span className="sr-only">{post.title}</span>
                          </Link>
                        </div>

                        <div className="blog-card__date">
                          <span className="blog-card__date__day">
                            {date.day}
                          </span>
                          <span className="blog-card__date__month">
                            {date.year}
                          </span>
                        </div>

                        <div className="blog-card__content">
                          <h3 className="blog-card__title">
                            <Link href={href}>{post.title}</Link>
                          </h3>

                          <p className="blog-card__text blog-card__summary">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {paginatedPosts.length === 0 && (
                  <div className="col-12">
                    <p>Không tìm thấy bài viết phù hợp.</p>
                  </div>
                )}

                {filteredPosts.length > itemsPerPage && (
                  <div className="col-12">
                    <ul className="post-pagination">
                      {currentPage > 1 && (
                        <li>
                          <Link
                            href={pageHref(
                              locale,
                              activeCategory,
                              keyword,
                              currentPage - 1
                            )}
                          >
                            ‹
                          </Link>
                        </li>
                      )}

                      {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;

                        return (
                          <li
                            key={page}
                            className={currentPage === page ? "active" : ""}
                          >
                            <Link
                              href={pageHref(
                                locale,
                                activeCategory,
                                keyword,
                                page
                              )}
                            >
                              {page.toString().padStart(2, "0")}
                            </Link>
                          </li>
                        );
                      })}

                      {currentPage < totalPages && (
                        <li>
                          <Link
                            href={pageHref(
                              locale,
                              activeCategory,
                              keyword,
                              currentPage + 1
                            )}
                          >
                            ›
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}