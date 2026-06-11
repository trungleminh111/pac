import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { getAccountProfile } from "@/server/account/account.query";
import { ToastProvider } from "@/components/ui/toast-provider";
import { AccountSidebar } from "./account-sidebar";
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
    redirect("/login");
  }

  const homeHref = locale === "vi" ? "/vi" : "/en";

  return (
    <ToastProvider>
      <div className="page-wrapper">
        <div className={styles.desktopOnly}>
          <Header locale={params.locale} />
        </div>

        <div className={styles.mobileAccountHeader}>
          <Link href={homeHref}>‹</Link>
          <h1>{locale === "vi" ? "Tài khoản của tôi" : "My account"}</h1>
          <span />
        </div>

        <div className={styles.page}>
          <div className={styles.container}>
            <AccountSidebar account={account} locale={locale} />

            <main className={styles.content}>{children}</main>
          </div>
        </div>

        <div className={styles.desktopOnly}>
          <Footer />
        </div>
      </div>
    </ToastProvider>
  );
}