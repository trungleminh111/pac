import Link from "next/link";
import { Locale } from "@prisma/client";
import { getActiveCart } from "@/server/cart/cart.query";
import { Footer } from "@/components/site/Footer";
import { SiteHeader as Header } from "@/components/site/SiteHeader";
import {
    removeCartItem,
    updateCartQuantity,
} from "@/server/cart/cart.action";
import styles from "./cart.module.css";

function formatPrice(value: number) {
    return value.toLocaleString("vi-VN") + "đ";
}

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
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    return (
        <div className="page-wrapper">
            <Header locale={params.locale} />
            <main className={styles.page}>
                <div className={styles.container}>
                    <h1>Giỏ hàng</h1>

                    {items.length === 0 && (
                        <div className={styles.empty}>
                            <p>Giỏ hàng của bạn đang trống.</p>
                            <Link href={params.locale === "vi" ? "/vi/san-pham" : "/en/products"}>
                                Tiếp tục mua hàng
                            </Link>
                        </div>
                    )}

                    {items.length > 0 && (
                        <div className={styles.grid}>
                            <section className={styles.card}>
                                <div className={styles.tableHead}>
                                    <span>Sản phẩm</span>
                                    <span>Đơn giá</span>
                                    <span>Số lượng</span>
                                    <span>Thành tiền</span>
                                    <span></span>
                                </div>

                                {items.map((item) => (
                                    <div className={styles.item} key={item.id}>
                                        <div className={styles.product}>
                                            <img src={item.image} alt={item.title} />

                                            <div>
                                                <h3>{item.title}</h3>
                                                <p>Mã SP: {item.productId.slice(0, 8)}</p>
                                            </div>
                                        </div>

                                        <div className={styles.price}>{formatPrice(item.price)}</div>

                                        <form action={updateCartQuantity} className={styles.quantity}>
                                            <input type="hidden" name="itemId" value={item.id} />
                                            <button name="quantity" value={item.quantity - 1}>
                                                −
                                            </button>
                                            <strong>{item.quantity}</strong>
                                            <button name="quantity" value={item.quantity + 1}>
                                                +
                                            </button>
                                        </form>

                                        <div className={styles.subtotal}>
                                            {formatPrice(item.subtotal)}
                                        </div>

                                        <form action={removeCartItem}>
                                            <input type="hidden" name="itemId" value={item.id} />
                                            <button className={styles.remove}>Xóa</button>
                                        </form>
                                    </div>
                                ))}
                            </section>

                            <aside className={styles.summary}>
                                <h2>Tổng đơn hàng</h2>

                                <div>
                                    <span>Tạm tính</span>
                                    <strong>{formatPrice(total)}</strong>
                                </div>

                                <div>
                                    <span>Phí vận chuyển</span>
                                    <strong>Liên hệ</strong>
                                </div>

                                <div className={styles.total}>
                                    <span>Thành tiền</span>
                                    <strong>{formatPrice(total)}</strong>
                                </div>

                                <Link href={params.locale === "vi" ? "/vi/thanh-toan" : "/en/checkout"}>
                                    Thanh toán
                                </Link>
                            </aside>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}