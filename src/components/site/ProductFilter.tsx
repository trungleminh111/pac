// components/site/ProductFilter.tsx
"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import Link from "next/link";
import { BsSearch, BsXLg } from "react-icons/bs";
import type { Locale } from "@/server/products/product.type";

function productListHref(locale: Locale) {
  return locale === "vi" ? "/vi/san-pham" : "/en/products";
}

function buildHref(locale: Locale, params: { category?: string; q?: string; page?: number }) {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.q) search.set("q", params.q);
  if (params.page && params.page > 1) search.set("page", String(params.page));
  const query = search.toString();
  return query ? `${productListHref(locale)}?${query}` : productListHref(locale);
}

export function ProductFilter({
  locale,
  categories,
  activeCategory,
  q,
}: {
  locale: Locale;
  categories: { id: string; slug: string; name: string }[];
  activeCategory: string;
  q: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(q);

  // Đồng bộ lại inputValue mỗi khi prop q thay đổi
  // (vd: user submit search từ popup header -> q trên URL đổi
  // nhưng component có thể không bị remount)
  useEffect(() => {
    setInputValue(q);
  }, [q]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      router.push(buildHref(locale, { category: activeCategory, q: inputValue }), { scroll: false });
    });
  }

  function handleClear() {
    setInputValue("");
    startTransition(() => {
      router.push(productListHref(locale), { scroll: false });
    });
  }

  const hasFilter = Boolean(inputValue || activeCategory);

  return (
    <div className="row align-items-stretch gy-4 mb-5" style={{ opacity: isPending ? 0.6 : 1, transition: "opacity 0.2s" }}>
      <div className="col-xl-4 col-md-12 col-12">
        <div
          className="product__search-box product__sidebar__item h-100"
          style={{ margin: 0, display: "flex" }}
        >
          <form
            onSubmit={handleSearch}
            className="product__search w-100"
            style={{ display: "flex", position: "relative" }}
          >
            {activeCategory && (
              <input type="hidden" name="category" value={activeCategory} />
            )}
            <input
              type="text"
              name="q"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={locale === "vi" ? "Tìm sản phẩm" : "Search products"}
              style={{ width: "100%", height: "100%", minHeight: "50px" }}
            />

            {hasFilter && (
              <button
                type="button"
                aria-label="clear search"
                onClick={handleClear}
                style={{
                  position: "absolute",
                  right: "45px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                }}
              >
                <span className="icon-clear">
                  <BsXLg />
                </span>
              </button>
            )}

            <button
              type="submit"
              aria-label="search submit"
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
              }}
            >
              <span className="icon-search">
                <BsSearch />
              </span>
            </button>
          </form>
        </div>
      </div>

      <div className="col-xl-8 col-md-12 col-12">
        <div className="product__categories" style={{ margin: 0, height: "100%" }}>
          <ul className="list-unstyled" style={{ width: "100%" }}>
            {categories.map((category) => {
              const isActive = activeCategory === category.slug;
              const nextCategory = isActive ? "" : category.slug;

              return (
                <li key={category.id} className={isActive ? "active" : ""}>
                  <Link
                    href={buildHref(locale, { category: nextCategory, q })}
                    onClick={(e) => {
                      e.preventDefault();
                      startTransition(() => {
                        router.push(buildHref(locale, { category: nextCategory, q }), { scroll: false });
                      });
                    }}
                  >
                    <button type="button" data-text={category.name}>
                      <span>{category.name}</span>
                    </button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}