import Link from "next/link";
import { Locale } from "@prisma/client";
import { getCheckoutData } from "@/server/cart/cart.query";
import { CheckoutOrderButton } from "@/components/site/CheckoutOrderButton";
import { Footer } from "@/components/site/Footer";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import styles from "./checkout.module.css";

const checkoutPageContent = {
  vi: {
    emptyText: "Không có sản phẩm để thanh toán.",
    backToCart: "Quay lại giỏ hàng",
    mobileTitle: "Thanh Toán",
    desktopTitle: "Thanh toán",
    addressTitle: "Địa chỉ nhận hàng",
    noAddress: "Bạn chưa có địa chỉ nhận hàng.",
    addAddress: " Thêm địa chỉ",
    defaultText: "Mặc định",
    orderTitle: "Đơn hàng 1",
    shippingLabel: "Vận chuyển",
    contactText: "Liên hệ",
    shippingTitle: "PAC Stone xử lý",
    shippingText:
      "PAC Stone sẽ xác nhận phí vận chuyển và thời gian giao hàng sau khi nhận đơn.",
    notePlaceholder: "Ghi chú cho PAC Stone nếu có",
    paymentTitle: "Phương thức thanh toán",
    cod: "Thanh toán khi nhận hàng",
    bankTransfer: "Chuyển khoản ngân hàng",
    summaryTitle: "Tổng thanh toán",
    subtotal: "Tạm tính",
    shippingFee: "Phí vận chuyển",
    total: "Thành tiền",
    finalTotal: "Tổng cộng",
    orderButton: "Đặt hàng",
  },
  en: {
    emptyText: "There are no products to checkout.",
    backToCart: "Back to cart",
    mobileTitle: "Checkout",
    desktopTitle: "Checkout",
    addressTitle: "Shipping address",
    noAddress: "You do not have a shipping address yet.",
    addAddress: " Add address",
    defaultText: "Default",
    orderTitle: "Order 1",
    shippingLabel: "Shipping",
    contactText: "Contact",
    shippingTitle: "Handled by PAC Stone",
    shippingText:
      "PAC Stone will confirm the shipping fee and delivery time after receiving your order.",
    notePlaceholder: "Leave a note for PAC Stone if needed",
    paymentTitle: "Payment method",
    cod: "Cash on delivery",
    bankTransfer: "Bank transfer",
    summaryTitle: "Payment summary",
    subtotal: "Subtotal",
    shippingFee: "Shipping fee",
    total: "Total",
    finalTotal: "Grand total",
    orderButton: "Place order",
  },
};

function formatPrice(value: number, locale: "vi" | "en") {
  if (locale === "en") {
    return value.toLocaleString("en-US") + " VND";
  }

  return value.toLocaleString("vi-VN") + "đ";
}

function cartHref(locale: "vi" | "en") {
  return locale === "vi" ? "/vi/gio-hang" : "/en/cart";
}

function addressHref(locale: "vi" | "en") {
  return locale === "vi" ? "/vi/tai-khoan/dia-chi" : "/en/account/addresses";
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
  const localeText = params.locale === "en" ? "en" : "vi";
  const locale = localeText === "en" ? Locale.en : Locale.vi;
  const content = checkoutPageContent[localeText];

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
              <p>{content.emptyText}</p>
              <Link href={cartHref(localeText)}>
                {content.backToCart}
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
            <Link href={cartHref(localeText)}>
              ‹
            </Link>
            <h1>{content.mobileTitle}</h1>
            <span></span>
          </div>

          <h1 className={styles.desktopTitle}>{content.desktopTitle}</h1>

          <form className={styles.grid}>
            <input type="hidden" name="itemIds" value={selectedIds.join(",")} />
            <input type="hidden" name="locale" value={params.locale} />

            <section className={styles.left}>
              <div className={styles.addressCard}>
                <h2>{content.addressTitle}</h2>

                {addresses.length === 0 && (
                  <div className={styles.warning}>
                    {content.noAddress}
                    <Link href={addressHref(localeText)}>{content.addAddress}</Link>
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
                      {address.isDefault && <span>{content.defaultText}</span>}
                    </div>
                  </label>
                ))}
              </div>

              <div className={styles.card}>
                <h2>{content.orderTitle}</h2>

                {items.map((item) => (
                  <div className={styles.item} key={item.id}>
                    <img src={item.image} alt={item.title} />

                    <div>
                      <h3>{item.title}</h3>
                      <p>{formatPrice(item.price, localeText)}</p>
                      <span>x{item.quantity}</span>
                    </div>

                    <strong>{formatPrice(item.subtotal, localeText)}</strong>
                  </div>
                ))}
              </div>

              <div className={styles.card}>
                <div className={styles.optionRow}>
                  <span>{content.shippingLabel}</span>
                  <strong>{content.contactText}</strong>
                </div>

                <div className={styles.shippingBox}>
                  <strong>{content.shippingTitle}</strong>
                  <p>
                    {content.shippingText}
                  </p>
                </div>
              </div>

              <div className={styles.card}>
                <textarea
                  name="note"
                  rows={3}
                  placeholder={content.notePlaceholder}
                />
              </div>
            </section>

            <aside className={styles.right}>
              <div className={styles.card}>
                <h2>{content.paymentTitle}</h2>

                <label className={styles.payment}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    defaultChecked
                  />
                  {content.cod}
                </label>

                <label className={styles.payment}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                  />
                  {content.bankTransfer}
                </label>
              </div>

              <div className={styles.summary}>
                <h2>{content.summaryTitle}</h2>

                <div>
                  <span>{content.subtotal}</span>
                  <strong>{formatPrice(subtotal, localeText)}</strong>
                </div>

                <div>
                  <span>{content.shippingFee}</span>
                  <strong>{content.contactText}</strong>
                </div>

                <div className={styles.total}>
                  <span>{content.total}</span>
                  <strong>{formatPrice(total, localeText)}</strong>
                </div>

                <CheckoutOrderButton disabled={addresses.length === 0}>
                  {content.orderButton}
                </CheckoutOrderButton>
              </div>
            </aside>

            <div className={styles.mobileCheckoutBar}>
              <div>
                <span>{content.finalTotal}</span>
                <strong>{formatPrice(total, localeText)}</strong>
              </div>

              <CheckoutOrderButton disabled={addresses.length === 0}>
                {content.orderButton}
              </CheckoutOrderButton>
            </div>
          </form>
        </div>
      </main>

      <div className={styles.desktopOnly}>
        <Footer locale={params.locale} />
      </div>
    </div>
  );
}