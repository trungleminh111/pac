"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./account.module.css";

type Account = {
  name: string;
  email: string;
  image: string;
};

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AccountSidebar({
  account,
  locale,
}: {
  account: Account;
  locale: "vi" | "en";
}) {
  const pathname = usePathname();
  const base = locale === "vi" ? "/vi/tai-khoan" : "/en/account";

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userBox}>
        <div className={styles.avatar}>
          {account.image ? (
            <img src={account.image} alt={account.name || account.email} />
          ) : (
            "👤"
          )}
        </div>

        <div>
          <strong>{account.name || account.email || "Tài khoản"}</strong>
          <p>✎ Sửa Hồ Sơ</p>
        </div>
      </div>

      <nav className={styles.menu}>
        <div className={styles.menuGroup}>
          <div className={styles.menuTitle}>👤 Tài Khoản Của Tôi</div>

          <Link
            href={`${base}/ho-so`}
            className={isActive(pathname, `${base}/ho-so`) ? styles.activeMenu : ""}
          >
            Hồ Sơ
          </Link>

          <Link
            href={`${base}/dia-chi`}
            className={isActive(pathname, `${base}/dia-chi`) ? styles.activeMenu : ""}
          >
            Địa Chỉ
          </Link>

          <Link
            href={`${base}/doi-mat-khau`}
            className={
              isActive(pathname, `${base}/doi-mat-khau`) ? styles.activeMenu : ""
            }
          >
            Đổi Mật Khẩu
          </Link>
        </div>

        <div className={styles.menuGroup}>
          <Link
            href={`${base}/don-hang`}
            className={`${styles.menuTitle} ${
              isActive(pathname, `${base}/don-hang`) ? styles.activeMenu : ""
            }`}
          >
            🧾 Đơn Mua
          </Link>
        </div>
      </nav>
    </aside>
  );
}