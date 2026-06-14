import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { getAccountOrders } from "@/server/account/account.query";
import { OrdersSearch } from "./orders-search";
import styles from "../account.module.css";

function formatPrice(value: any) {
  return Number(value || 0).toLocaleString("vi-VN") + "đ";
}

function statusLabel(status: OrderStatus) {
  const labels: Record<OrderStatus, string> = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPING: "Đang giao",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
    RETURNED: "Đã trả hàng",
  };

  return labels[status];
}

function getOrderDetailHref(locale: "vi" | "en", orderId: string) {
  return locale === "vi"
    ? `/vi/tai-khoan/don-hang/${orderId}`
    : `/en/account/orders/${orderId}`;
}

const tabs = [
  { label: "Tất cả", value: "" },
  { label: "Chờ xác nhận", value: "PENDING" },
  { label: "Đang xử lý", value: "PROCESSING" },
  { label: "Đang giao", value: "SHIPPING" },
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Đã hủy", value: "CANCELLED" },
  { label: "Đã trả hàng", value: "RETURNED" },
] as const;

export default async function OrdersPage({
  params,
  searchParams,
}: {
  params: {
    locale: "vi" | "en";
  };
  searchParams?: {
    status?: string;
    q?: string;
  };
}) {
  const locale = params.locale === "en" ? "en" : "vi";
  const activeStatus = searchParams?.status || "";
  const keyword = (searchParams?.q || "").trim().toLowerCase();

  const validStatuses = Object.values(OrderStatus) as string[];
  const status =
    activeStatus && validStatuses.includes(activeStatus)
      ? (activeStatus as OrderStatus)
      : undefined;

  const orders = await getAccountOrders(status);

  const filteredOrders = keyword
    ? orders.filter((order) => {
        const matchCode = order.code.toLowerCase().includes(keyword);

        const matchProduct = order.items.some((item) =>
          item.title.toLowerCase().includes(keyword)
        );

        return matchCode || matchProduct;
      })
    : orders;

  const base =
    locale === "vi" ? "/vi/tai-khoan/don-hang" : "/en/account/orders";

  return (
    <section>
      <div className={styles.orderTabs}>
        {tabs.map((tab) => {
          const href = tab.value
            ? `${base}?status=${tab.value}${keyword ? `&q=${keyword}` : ""}`
            : `${base}${keyword ? `?q=${keyword}` : ""}`;

          return (
            <Link
              key={tab.value || "all"}
              href={href}
              className={activeStatus === tab.value ? styles.activeTab : ""}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <OrdersSearch
        base={base}
        activeStatus={activeStatus}
        defaultKeyword={searchParams?.q || ""}
      />

      <div className={styles.orderList}>
        {filteredOrders.map((order) => (
          <div className={styles.orderCard} key={order.id}>
            <div className={styles.orderTop}>
              <div>
                <Link href={getOrderDetailHref(locale, order.id)}>
                  <strong>Đơn hàng #{order.code}</strong>
                </Link>
              </div>

              <div>
                <em>{statusLabel(order.status)}</em>
              </div>
            </div>

            {order.items.map((item) => (
              <div className={styles.orderProduct} key={item.id}>
                <img
                  src={item.image || "/assets/images/products/product-1-1.png"}
                  alt={item.title}
                />

                <div>
                  <h3>{item.title}</h3>
                  <p>x{item.quantity}</p>
                </div>

                <strong>{formatPrice(item.price)}</strong>
              </div>
            ))}

            <div className={styles.orderBottom}>
              <p>
                Thành tiền: <strong>{formatPrice(order.total)}</strong>
              </p>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className={styles.card}>Không tìm thấy đơn hàng.</div>
        )}
      </div>
    </section>
  );
}