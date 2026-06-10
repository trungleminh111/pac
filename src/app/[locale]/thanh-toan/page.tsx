import Link from "next/link";
import { Locale } from "@prisma/client";
import { Footer } from "@/components/site/Footer";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { getCheckoutData } from "@/server/cart/cart.query";
import { createOrder } from "@/server/cart/cart.action";
import styles from "./checkout.module.css";

function formatPrice(value: number) {
    return value.toLocaleString("vi-VN") + "đ";
}

export default async function CheckoutPage({
    params,
}: {
    params: {
        locale: "vi" | "en";
    };
}) {
    const locale = params.locale === "en" ? Locale.en : Locale.vi;
    const data = await getCheckoutData(locale);

    const cart = data?.cart;
    const items = cart?.items || [];
    const addresses = data?.addresses || [];
    const defaultAddress = addresses[0];

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const shippingFee = 0;
    const total = subtotal + shippingFee;

    if (!cart || items.length === 0) {
        return (
            <div className="page-wrapper">
                <Header locale={params.locale} />
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
                <Footer />
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <Header locale={params.locale} />
            <main className={styles.page}>
                <div className={styles.container}>
                    <h1>Thanh toán</h1>

                    <form action={createOrder} className={styles.grid}>
                        <section className={styles.left}>
                            <div className={styles.card}>
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
                                <h2>Sản phẩm</h2>

                                {items.map((item) => (
                                    <div className={styles.item} key={item.id}>
                                        <img src={item.image} alt={item.title} />

                                        <div>
                                            <h3>{item.title}</h3>
                                            <p>
                                                {formatPrice(item.price)} × {item.quantity}
                                            </p>
                                        </div>

                                        <strong>{formatPrice(item.subtotal)}</strong>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.card}>
                                <h2>Ghi chú</h2>
                                <textarea
                                    name="note"
                                    rows={4}
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
                                    <input type="radio" name="paymentMethod" value="BANK_TRANSFER" />
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
                                    <strong>{shippingFee === 0 ? "Liên hệ" : formatPrice(shippingFee)}</strong>
                                </div>

                                <div className={styles.total}>
                                    <span>Thành tiền</span>
                                    <strong>{formatPrice(total)}</strong>
                                </div>

                                <button type="submit" disabled={addresses.length === 0}>
                                    Đặt hàng
                                </button>
                            </div>
                        </aside>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}