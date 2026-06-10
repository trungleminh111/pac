import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { getAccountProfile } from "@/server/account/account.query";
import { ToastProvider } from "@/components/ui/toast-provider";
import styles from "./account.module.css";

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    locale: "vi" | "en";
  };
}) {
  const locale = params.locale;
  const account = await getAccountProfile();

  if (!account) {
    redirect(`/login`);
  }

  const base = `/${locale === "vi" ? "vi/tai-khoan" : "vi/tai-khoan"}`;

  return (
    <ToastProvider>
      <div className="page-wrapper">
        <Header locale={params.locale} />

        <div className={styles.page}>
          <div className={styles.container}>
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
                  <Link href={`${base}/ho-so`}>Hồ Sơ</Link>
                  <Link href={`${base}/dia-chi`}>Địa Chỉ</Link>
                  <Link href={`${base}/doi-mat-khau`}>Đổi Mật Khẩu</Link>
                </div>

                <div className={styles.menuGroup}>
                  <Link href={`${base}/don-hang`} className={styles.menuTitle}>
                    🧾 Đơn Mua
                  </Link>
                  <Link href={`${base}/yeu-thich`} className={styles.menuTitle}>
                    🎟 Yêu Thích
                  </Link>
                </div>
              </nav>
            </aside>

            <main className={styles.content}>{children}</main>
          </div>
        </div>

        <Footer />
      </div>
    </ToastProvider>
  );
}