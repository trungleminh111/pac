import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { getAccountOrders } from "@/server/account/account.query";
import { OrdersSearch } from "./orders-search";
import styles from "../account.module.css";

type Locale = "vi" | "en";

const ordersPageContent = {
  vi: {
    orderPrefix: "Đơn hàng #",
    totalLabel: "Thành tiền:",
    emptyText: "Không tìm thấy đơn hàng.",
    tabs: {
      all: "Tất cả",
      pending: "Chờ xác nhận",
      processing: "Đang xử lý",
      shipping: "Đang giao",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
      returned: "Đã trả hàng",
    },
    statuses: {
      PENDING: "Chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      PROCESSING: "Đang xử lý",
      SHIPPING: "Đang giao",
      COMPLETED: "Hoàn thành",
      CANCELLED: "Đã hủy",
      RETURNED: "Đã trả hàng",
    },
  },
  en: {
    orderPrefix: "Order #",
    totalLabel: "Total:",
    emptyText: "No orders found.",
    tabs: {
      all: "All",
      pending: "Pending",
      processing: "Processing",
      shipping: "Shipping",
      completed: "Completed",
      cancelled: "Cancelled",
      returned: "Returned",
    },
    statuses: {
      PENDING: "Pending",
      CONFIRMED: "Confirmed",
      PROCESSING: "Processing",
      SHIPPING: "Shipping",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
      RETURNED: "Returned",
    },
  },
};

function formatPrice(value: any, locale: Locale = "vi") {
  const number = Number(value || 0);

  if (locale === "en") {
    return number.toLocaleString("en-US") + " VND";
  }

  return number.toLocaleString("vi-VN") + "đ";
}

function statusLabel(status: OrderStatus, locale: Locale = "vi") {
  const labels: Record<OrderStatus, string> = {
    PENDING: ordersPageContent[locale].statuses.PENDING,
    CONFIRMED: ordersPageContent[locale].statuses.CONFIRMED,
    PROCESSING: ordersPageContent[locale].statuses.PROCESSING,
    SHIPPING: ordersPageContent[locale].statuses.SHIPPING,
    COMPLETED: ordersPageContent[locale].statuses.COMPLETED,
    CANCELLED: ordersPageContent[locale].statuses.CANCELLED,
    RETURNED: ordersPageContent[locale].statuses.RETURNED,
  };

  return labels[status];
}

function getOrderDetailHref(locale: "vi" | "en", orderId: string) {
  return locale === "vi"
    ? `/vi/tai-khoan/don-hang/${orderId}`
    : `/en/account/orders/${orderId}`;
}

const tabs = [
  { labelVi: "Tất cả", labelEn: "All", value: "" },
  { labelVi: "Chờ xác nhận", labelEn: "Pending", value: "PENDING" },
  { labelVi: "Đang xử lý", labelEn: "Processing", value: "PROCESSING" },
  { labelVi: "Đang giao", labelEn: "Shipping", value: "SHIPPING" },
  { labelVi: "Hoàn thành", labelEn: "Completed", value: "COMPLETED" },
  { labelVi: "Đã hủy", labelEn: "Cancelled", value: "CANCELLED" },
  { labelVi: "Đã trả hàng", labelEn: "Returned", value: "RETURNED" },
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
  const content = ordersPageContent[locale];

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
              {locale === "vi" ? tab.labelVi : tab.labelEn}
            </Link>
          );
        })}
      </div>

      <OrdersSearch
        base={base}
        activeStatus={activeStatus}
        defaultKeyword={searchParams?.q || ""}
        locale={locale}
      />

      <div className={styles.orderList}>
        {filteredOrders.map((order) => (
          <div className={styles.orderCard} key={order.id}>
            <div className={styles.orderTop}>
              <div>
                <Link href={getOrderDetailHref(locale, order.id)}>
                  <strong>{content.orderPrefix}{order.code}</strong>
                </Link>
              </div>

              <div>
                <em>{statusLabel(order.status, locale)}</em>
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

                <strong>{formatPrice(item.price, locale)}</strong>
              </div>
            ))}

            <div className={styles.orderBottom}>
              <p>
                {content.totalLabel} <strong>{formatPrice(order.total, locale)}</strong>
              </p>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className={styles.card}>{content.emptyText}</div>
        )}
      </div>
    </section>
  );
}