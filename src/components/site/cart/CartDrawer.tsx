"use client";

import { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import styles from "./cart-drawer.module.css";

type CartDrawerItem = {
  id: string;
  title: string;
  image: string;
  price: string;
  quantity: number;
};

export function CartDrawer({
  items,
  total,
  cartHref,
  checkoutHref,
}: {
  items: CartDrawerItem[];
  total: string;
  cartHref: string;
  checkoutHref: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="icon-cart"
        style={{ color: "var(--floens-black, #000)" }}
        onClick={() => setOpen(true)}
        aria-label="Open cart"
      >
        <FiShoppingCart size={24} />
      </button>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} />
      )}

      <aside className={`${styles.drawer} ${open ? styles.open : ""}`}>
        <div className={styles.header}>
          <h3>Giỏ hàng của bạn</h3>

          <button type="button" onClick={() => setOpen(false)}>
            ×
          </button>
        </div>

        <div className={styles.list}>
          {items.length === 0 && <p>Chưa có sản phẩm trong giỏ hàng.</p>}

          {items.map((item) => (
            <div className={styles.item} key={item.id}>
              <img src={item.image} alt={item.title} />

              <div className={styles.info}>
                <h4>{item.title}</h4>
                <p>
                  {item.price} × {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.total}>
            <span>Tạm tính</span>
            <strong>{total}</strong>
          </div>

          <a href={cartHref}>Xem giỏ hàng</a>
          <a href={checkoutHref}>Thanh toán</a>
        </div>
      </aside>
    </>
  );
}