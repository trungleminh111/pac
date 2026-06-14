"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import styles from "../account.module.css";

type Locale = "vi" | "en";

const ordersSearchContent = {
    vi: {
        placeholder: "Bạn có thể tìm kiếm theo ID đơn hàng hoặc Tên Sản phẩm",
        clear: "Xóa",
        search: "Tìm",
    },
    en: {
        placeholder: "You can search by order ID or product name",
        clear: "Clear",
        search: "Search",
    },
};

export function OrdersSearch({
    base,
    activeStatus,
    defaultKeyword,
    locale = "vi",
}: {
    base: string;
    activeStatus: string;
    defaultKeyword: string;
    locale?: Locale;
}) {
    const router = useRouter();
    const [keyword, setKeyword] = useState(defaultKeyword);
    const content = ordersSearchContent[locale];

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const q = keyword.trim();

        if (defaultKeyword) {
            setKeyword("");
            router.push(activeStatus ? `${base}?status=${activeStatus}` : base);
            return;
        }

        if (!q) return;

        router.push(
            `${base}?${activeStatus ? `status=${activeStatus}&` : ""}q=${encodeURIComponent(q)}`
        );
    }

    return (
        <form onSubmit={handleSubmit} className={styles.orderSearch}>
            <span className={styles.searchIcon}>
                <FiSearch />
            </span>

            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={content.placeholder}
            />
            <button
                type="submit"
                className={defaultKeyword ? styles.clearSearchBtn : styles.searchBtn}
            >
                {defaultKeyword ? content.clear : content.search}
            </button>
        </form>
    );
}