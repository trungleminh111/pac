"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./account.module.css";

type Account = {
  name: string;
  email: string;
  image: string;
};

const accountSidebarContent = {
  vi: {
    accountFallback: "Tài khoản",
    editProfile: "✎ Sửa Hồ Sơ",
    myAccount: "👤 Tài Khoản Của Tôi",
    profile: "Hồ Sơ",
    address: "Địa Chỉ",
    changePassword: "Đổi Mật Khẩu",
    orders: "🧾 Đơn Mua",
    routes: {
      profile: "ho-so",
      address: "dia-chi",
      changePassword: "doi-mat-khau",
      orders: "don-hang",
    },
  },
  en: {
    accountFallback: "Account",
    editProfile: "✎ Edit Profile",
    myAccount: "👤 My Account",
    profile: "Profile",
    address: "Address",
    changePassword: "Change Password",
    orders: "🧾 Orders",
    routes: {
      profile: "profile",
      address: "addresses",
      changePassword: "change-password",
      orders: "orders",
    },
  },
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
  const content = accountSidebarContent[locale];

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
          <strong>{account.name || account.email || content.accountFallback}</strong>
          <p>{content.editProfile}</p>
        </div>
      </div>

      <nav className={styles.menu}>
        <div className={styles.menuGroup}>
          <div className={styles.menuTitle}>{content.myAccount}</div>

          <Link
            href={`${base}/${content.routes.profile}`}
            className={isActive(pathname, `${base}/${content.routes.profile}`) ? styles.activeMenu : ""}
          >
            {content.profile}
          </Link>

          <Link
            href={`${base}/${content.routes.address}`}
            className={isActive(pathname, `${base}/${content.routes.address}`) ? styles.activeMenu : ""}
          >
            {content.address}
          </Link>

          <Link
            href={`${base}/${content.routes.changePassword}`}
            className={
              isActive(pathname, `${base}/${content.routes.changePassword}`) ? styles.activeMenu : ""
            }
          >
            {content.changePassword}
          </Link>
        </div>

        <div className={styles.menuGroup}>
          <Link
            href={`${base}/${content.routes.orders}`}
            className={`${styles.menuTitle} ${
              isActive(pathname, `${base}/${content.routes.orders}`) ? styles.activeMenu : ""
            }`}
          >
            {content.orders}
          </Link>
        </div>
      </nav>
    </aside>
  );
}