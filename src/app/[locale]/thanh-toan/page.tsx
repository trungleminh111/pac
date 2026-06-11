import Link from "next/link";
import { Locale } from "@prisma/client";
import { getCheckoutData } from "@/server/cart/cart.query";
import { CheckoutOrderButton } from "@/components/site/CheckoutOrderButton";
import { Footer } from "@/components/site/Footer";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import styles from "./checkout.module.css";

function formatPrice(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: {
    locale: "vi" | "en";
  };
  searchParams?: {
    items?: string;
  };
}) {
  const locale = params.locale === "en" ? Locale.en : Locale.vi;
  const data = await getCheckoutData(locale);

  const cart = data?.cart;
  const addresses = data?.addresses || [];
  const defaultAddress = addresses[0];

  const cartItems = cart?.items || [];

  const selectedIds = searchParams?.items
    ? searchParams.items.split(",").filter(Boolean)
    : [];

  const items =
    selectedIds.length > 0
      ? cartItems.filter((item) => selectedIds.includes(item.id))
      : [];

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  if (!cart || items.length === 0) {
    return (
      <div className="page-wrapper">
        <main className={styles.page}>
          <div className={styles.container}>
            <div className={styles.empty}>
              <p>Không có sản phẩm để thanh toán.</p>
              <Link href={params.locale === "vi" ? "/vi/gio-hang" : "/en/cart"}>
                Quay lại giỏ hàng
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className={styles.desktopOnly}>
        <Header locale={params.locale} />
      </div>

      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.mobileCheckoutHeader}>
            <Link href={params.locale === "vi" ? "/vi/gio-hang" : "/en/cart"}>
              ‹
            </Link>
            <h1>Thanh Toán</h1>
            <span></span>
          </div>

          <h1 className={styles.desktopTitle}>Thanh toán</h1>

          <form className={styles.grid}>
            <input type="hidden" name="itemIds" value={selectedIds.join(",")} />
            <input type="hidden" name="locale" value={params.locale} />

            <section className={styles.left}>
              <div className={styles.addressCard}>
                <h2>Địa chỉ nhận hàng</h2>

                {addresses.length === 0 && (
                  <div className={styles.warning}>
                    Bạn chưa có địa chỉ nhận hàng.
                    <Link href="/vi/tai-khoan/dia-chi"> Thêm địa chỉ</Link>
                  </div>
                )}

                {addresses.map((address) => (
                  <label className={styles.address} key={address.id}>
                    <input
                      type="radio"
                      name="addressId"
                      value={address.id}
                      defaultChecked={address.id === defaultAddress?.id}
                    />

                    <div>
                      <strong>
                        {address.fullName} - {address.phone}
                      </strong>
                      <p>
                        {address.street}, {address.ward}, {address.district},{" "}
                        {address.city}
                      </p>
                      {address.isDefault && <span>Mặc định</span>}
                    </div>
                  </label>
                ))}
              </div>

              <div className={styles.card}>
                <h2>Đơn hàng 1</h2>

                {items.map((item) => (
                  <div className={styles.item} key={item.id}>
                    <img src={item.image} alt={item.title} />

                    <div>
                      <h3>{item.title}</h3>
                      <p>{formatPrice(item.price)}</p>
                      <span>x{item.quantity}</span>
                    </div>

                    <strong>{formatPrice(item.subtotal)}</strong>
                  </div>
                ))}
              </div>

              <div className={styles.card}>
                <div className={styles.optionRow}>
                  <span>Vận chuyển</span>
                  <strong>Liên hệ</strong>
                </div>

                <div className={styles.shippingBox}>
                  <strong>PAC Stone xử lý</strong>
                  <p>
                    PAC Stone sẽ xác nhận phí vận chuyển và thời gian giao hàng
                    sau khi nhận đơn.
                  </p>
                </div>
              </div>

              <div className={styles.card}>
                <textarea
                  name="note"
                  rows={3}
                  placeholder="Ghi chú cho PAC Stone nếu có"
                />
              </div>
            </section>

            <aside className={styles.right}>
              <div className={styles.card}>
                <h2>Phương thức thanh toán</h2>

                <label className={styles.payment}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    defaultChecked
                  />
                  Thanh toán khi nhận hàng
                </label>

                <label className={styles.payment}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                  />
                  Chuyển khoản ngân hàng
                </label>
              </div>

              <div className={styles.summary}>
                <h2>Tổng thanh toán</h2>

                <div>
                  <span>Tạm tính</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>

                <div>
                  <span>Phí vận chuyển</span>
                  <strong>Liên hệ</strong>
                </div>

                <div className={styles.total}>
                  <span>Thành tiền</span>
                  <strong>{formatPrice(total)}</strong>
                </div>

                <CheckoutOrderButton disabled={addresses.length === 0}>
                  Đặt hàng
                </CheckoutOrderButton>
              </div>
            </aside>

            <div className={styles.mobileCheckoutBar}>
              <div>
                <span>Tổng cộng</span>
                <strong>{formatPrice(total)}</strong>
              </div>

              <CheckoutOrderButton disabled={addresses.length === 0}>
                Đặt hàng
              </CheckoutOrderButton>
            </div>
          </form>
        </div>
      </main>

      <div className={styles.desktopOnly}>
        <Footer />
      </div>
    </div>
  );
}