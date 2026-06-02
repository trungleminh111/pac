"use client";

import { use, useMemo, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";


const latestPosts = [
  ["45+ Mẫu đá ốp cầu thang đẹp 2023", "15/06/2024", "blog-1-1.jpg"],
  ["5 mẹo cải tạo nhà bếp hợp xu hướng", "12/06/2024", "blog-1-2.jpg"],
  ["Kinh Nghiệm Chọn Đá Mặt Bếp Đẹp - Rẻ - Bền", "10/06/2024", "blog-1-3.jpg"],
];

const posts = [
  {
    title: "Có nên chọn đá hoa cương ốp mặt tiền không?",
    summary: "Đá hoa cương ốp mặt tiền đang là lựa chọn hàng đầu...",
    day: "25/05",
    year: "2024",
    image: "blog-1-1.jpg",
    category: "Thị trường ngành đá tự nhiên",
    tags: ["Đá marble", "Thị trường đá"],
  },
  {
    title: "Nội Thất Phòng Bếp Đẹp Sử Dụng Đá Marble",
    summary: "Thiết kế nội thất nhà bếp với đá marble mang đến vẻ đẹp sang trọng...",
    day: "22/05",
    year: "2024",
    image: "blog-1-2.jpg",
    category: "Xu hướng thiết kế",
    tags: ["Đá marble"],
  },
];

function toSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const [keyword, setKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const categories = [
    "Tất cả",
    ...Array.from(new Set(posts.map((post) => post.category))),
  ];

  const categoryCounts: Record<string, number> = {};

  categories.forEach((category) => {
    categoryCounts[category] =
      category === "Tất cả"
        ? posts.length
        : posts.filter((post) => post.category === category).length;
  });
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchCategory =
        activeCategory === "Tất cả" || post.category === activeCategory;

      const matchKeyword =
        post.title.toLowerCase().includes(keyword.toLowerCase()) ||
        post.summary.toLowerCase().includes(keyword.toLowerCase());

      return matchCategory && matchKeyword;
    });
  }, [activeCategory, keyword]);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className="page-wrapper">
      <Header />

      <PageHeader title="" bgImage="/assets/images/backgrounds/PACSTONE-TINTUCSUKIEN-header.png" />


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
                    <form action="#" className="sidebar__search">
                      <input
                        type="text"
                        placeholder="Từ khóa"
                        value={keyword}
                        onChange={(e) => {
                          setKeyword(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                      <button type="submit" aria-label="search submit">
                        <span className="icon-search" />
                      </button>
                    </form>
                  </div>

                  <div className="sidebar__categories-wrapper sidebar__single ">
                    <h4 className="sidebar__title">Danh mục</h4>
                    <ul className="sidebar__categories list-unstyled ">
                      {categories.map((name) => (
                        <li key={name} className={activeCategory === name ? "active" : ""}>
                          <a
                            onClick={() => {
                              setActiveCategory(name);
                              setCurrentPage(1);
                            }}
                          >

                            <span>{name}</span>
                            <span className="sidebar__count">
                              ({categoryCounts[name]})
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="sidebar__posts-wrapper sidebar__single">
                    <h4 className="sidebar__title sidebar__posts-title">
                      Bài viết nổi bật
                    </h4>

                    <ul className="sidebar__posts list-unstyled">
                      {latestPosts.map(([title, date, image]) => (
                        <li className="sidebar__posts__item" key={title}>
                          <div className="sidebar__posts__image">
                            <img
                              src={`/assets/images/blog/${image}`}
                              alt={title}
                            />
                          </div>

                          <div className="sidebar__posts__content">
                            <p className="sidebar__posts__meta">
                              <a href={`/${locale}/tin-tuc/${toSlug(title)}`}>
                                {date}
                              </a>
                            </p>

                            <h4 className="sidebar__posts__title">
                              <a href={`/${locale}/tin-tuc/${toSlug(title)}`}>
                                {title}
                              </a>
                            </h4>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="sidebar__tags-wrapper sidebar__single">
                    <h4 className="sidebar__title">Tags</h4>
                    <div className="sidebar__tags">
                      <a href={`/${locale}/tin-tuc`}>Đá marble</a>
                      <a href={`/${locale}/tin-tuc`}>Đá phong thủy</a>
                      <a href={`/${locale}/tin-tuc`}>Thiết kế hoa văn đá</a>
                      <a href={`/${locale}/tin-tuc`}>Thị trường đá</a>
                    </div>
                  </div>
                </aside>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="row gutter-y-30">
                {paginatedPosts.map((post) => (
                  <div className="col-xl-6 col-lg-12 col-md-6" key={post.title}>
                    <div className="blog-card">
                      <div className="blog-card__image">
                        <img
                          src={`/assets/images/blog/${post.image}`}
                          alt={post.title}
                        />
                        <a
                          href={`/${locale}/tin-tuc/${toSlug(post.title)}`}
                          className="blog-card__image__link"
                        >
                          <span className="sr-only">{post.title}</span>
                        </a>
                      </div>

                      <div className="blog-card__date">
                        <span className="blog-card__date__day">{post.day}</span>
                        <span className="blog-card__date__month">{post.year}</span>
                      </div>

                      <div className="blog-card__content">
                        <h3 className="blog-card__title">
                          <a href={`/${locale}/tin-tuc/${toSlug(post.title)}`}>
                            {post.title}
                          </a>
                        </h3>

                        <p className="blog-card__text blog-card__summary">
                          {post.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="col-12">
                  <ul className="post-pagination">
                    <li>
                      <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                        <LuChevronLeft />
                      </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i} className={currentPage === i + 1 ? "active" : ""}>
                        <button onClick={() => setCurrentPage(i + 1)}>
                          {(i + 1).toString().padStart(2, "0")}
                        </button>
                      </li>
                    ))}

                    <li>
                      <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                        <LuChevronRight />
                      </button>
                    </li>
                  </ul>
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