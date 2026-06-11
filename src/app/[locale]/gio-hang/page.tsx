import Link from "next/link";
import { Locale } from "@prisma/client";
import { getActiveCart } from "@/server/cart/cart.query";
import { Footer } from "@/components/site/Footer";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import styles from "./cart.module.css";
import { CartClient } from "./cart-client";

export default async function CartPage({
  params,
}: {
  params: {
    locale: "vi" | "en";
  };
}) {
  const locale = params.locale === "en" ? Locale.en : Locale.vi;
  const cart = await getActiveCart(locale);
  const items = cart?.items || [];

  return (
    <div className="page-wrapper">
      <div className={styles.desktopOnly}>
        <Header locale={params.locale} />
      </div>

      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.mobileCartHeader}>
            <Link href={params.locale === "vi" ? "/vi" : "/en"}>‹</Link>
            <h1>{params.locale === "vi" ? "Giỏ hàng" : "Cart"}</h1>
            <span></span>
          </div>

          <h1 className={styles.desktopTitle}>
            {params.locale === "vi" ? "Giỏ hàng" : "Cart"}
          </h1>

          {items.length === 0 && (
            <div className={styles.empty}>
              <p>
                {params.locale === "vi"
                  ? "Giỏ hàng của bạn đang trống."
                  : "Your cart is empty."}
              </p>

              <Link
                href={
                  params.locale === "vi" ? "/vi/san-pham" : "/en/products"
                }
              >
                {params.locale === "vi"
                  ? "Tiếp tục mua hàng"
                  : "Continue shopping"}
              </Link>
            </div>
          )}

          {items.length > 0 && (
            <CartClient items={items} locale={params.locale} />
          )}
        </div>
      </main>

      <div className={styles.desktopOnly}>
        <Footer />
      </div>
    </div>
  );
}