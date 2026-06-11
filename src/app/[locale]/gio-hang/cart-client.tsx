"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  removeCartItem,
  updateCartQuantity,
} from "@/server/cart/cart.action";
import { useToast } from "@/components/ui/Toast provider";
import styles from "./cart.module.css";

type CartItem = {
  id: string;
  productId: string;
  title: string;
  slug: string;
  image: string;
  quantity: number;
  price: number;
  subtotal: number;
};

function formatPrice(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

export function CartClient({
  items,
  locale,
}: {
  items: CartItem[];
  locale: "vi" | "en";
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const [isPending, startTransition] = useTransition();
  const [cartItems, setCartItems] = useState<CartItem[]>(items);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    items.map((item) => item.id)
  );

  useEffect(() => {
    setCartItems(items);
    setSelectedIds((current) => {
      if (current.length === 0) return items.map((item) => item.id);

      const validIds = items.map((item) => item.id);
      return current.filter((id) => validIds.includes(id));
    });
  }, [items]);

  const allChecked =
    cartItems.length > 0 && selectedIds.length === cartItems.length;

  const selectedItems = useMemo(() => {
    return cartItems.filter((item) => selectedIds.includes(item.id));
  }, [cartItems, selectedIds]);

  const selectedTotal = selectedItems.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  const checkoutHref =
    selectedIds.length > 0
      ? `${
          locale === "vi" ? "/vi/thanh-toan" : "/en/checkout"
        }?items=${selectedIds.join(",")}`
      : "#";

  function toggleAll() {
    if (allChecked) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(cartItems.map((item) => item.id));
  }

  function toggleItem(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id]
    );
  }

  function handleUpdateQuantity(item: CartItem, quantity: number) {
    const formData = new FormData();
    formData.set("itemId", item.id);
    formData.set("quantity", String(quantity));

    startTransition(async () => {
      const result = await updateCartQuantity(formData);

      showToast(result.ok ? "success" : "error", result.message);

      if (!result.ok) return;

      if (quantity <= 0) {
        setCartItems((current) =>
          current.filter((cartItem) => cartItem.id !== item.id)
        );

        setSelectedIds((current) =>
          current.filter((itemId) => itemId !== item.id)
        );
      } else {
        setCartItems((current) =>
          current.map((cartItem) =>
            cartItem.id === item.id
              ? {
                  ...cartItem,
                  quantity,
                  subtotal: cartItem.price * quantity,
                }
              : cartItem
          )
        );
      }

      router.refresh();
    });
  }

  function handleRemoveItem(item: CartItem) {
    const formData = new FormData();
    formData.set("itemId", item.id);

    startTransition(async () => {
      const result = await removeCartItem(formData);

      showToast(result.ok ? "success" : "error", result.message);

      if (!result.ok) return;

      setCartItems((current) =>
        current.filter((cartItem) => cartItem.id !== item.id)
      );

      setSelectedIds((current) =>
        current.filter((itemId) => itemId !== item.id)
      );

      router.refresh();
    });
  }

  return (
    <>
      <div className={styles.cartTable}>
        <div className={styles.tableHead}>
          <div className={styles.productCol}>
            <input
              type="checkbox"
              checked={allChecked}
              onChange={toggleAll}
              disabled={cartItems.length === 0}
            />
            <span>Sản phẩm</span>
          </div>

          <span>Đơn giá</span>
          <span>Số lượng</span>
          <span>Số tiền</span>
          <span>Thao tác</span>
        </div>

        <div className={styles.shopRow}>
          <div className={styles.shopLeft}>
            <input
              type="checkbox"
              checked={allChecked}
              onChange={toggleAll}
              disabled={cartItems.length === 0}
            />
            <strong>P.A.C STONE Official Store</strong>
          </div>

          <span>Sửa</span>
        </div>

        {cartItems.map((item) => {
          const checked = selectedIds.includes(item.id);

          return (
            <div className={styles.item} key={item.id}>
              <div className={styles.product}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleItem(item.id)}
                  className={styles.checkbox}
                />

                <img src={item.image} alt={item.title} />

                <div className={styles.productInfo}>
                  <h3>{item.title}</h3>
                  <p>Mã SP: {item.productId.slice(0, 8)}</p>
                  <span>Phân loại: Mặc định</span>
                </div>
              </div>

              <div className={styles.price}>{formatPrice(item.price)}</div>

              <div className={styles.quantity}>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    handleUpdateQuantity(item, item.quantity - 1)
                  }
                >
                  −
                </button>

                <strong>{item.quantity}</strong>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    handleUpdateQuantity(item, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              <div className={styles.subtotal}>
                {formatPrice(item.subtotal)}
              </div>

              <div className={styles.action}>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleRemoveItem(item)}
                >
                  Xóa
                </button>
              </div>
            </div>
          );
        })}

        <div className={styles.cartNotice}>
          <span>🚚</span>
          <p>Phí vận chuyển sẽ được PAC Stone xác nhận sau khi đặt hàng.</p>
        </div>
      </div>

      <div className={styles.checkoutBar}>
        <div className={styles.checkoutLeft}>
          <input
            type="checkbox"
            checked={allChecked}
            onChange={toggleAll}
            disabled={cartItems.length === 0}
          />

          <span>Chọn tất cả</span>

          <span>Đã chọn {selectedIds.length} sản phẩm</span>
        </div>

        <div className={styles.checkoutRight}>
          <div>
            <span>Tổng thanh toán:</span>
            <strong>{formatPrice(selectedTotal)}</strong>
          </div>

          {selectedIds.length > 0 ? (
            <Link href={checkoutHref}>Thanh toán</Link>
          ) : (
            <button type="button" disabled>
              Thanh toán
            </button>
          )}
        </div>
      </div>
    </>
  );
}