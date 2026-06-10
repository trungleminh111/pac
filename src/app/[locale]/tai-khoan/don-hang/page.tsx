import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { getAccountOrders } from "@/server/account/account.query";
import styles from "../account.module.css";

function formatPrice(value: any) {
  return Number(value).toLocaleString("vi-VN") + "đ";
}

function statusLabel(status: OrderStatus) {
  const labels: Record<OrderStatus, string> = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPING: "Đang giao",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
  };

  return labels[status];
}

const tabs = [
  { label: "Tất cả", value: "" },
  { label: "Chờ xác nhận", value: "PENDING" },
  { label: "Đang xử lý", value: "PROCESSING" },
  { label: "Đang giao", value: "SHIPPING" },
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Đã hủy", value: "CANCELLED" },
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
  };
}) {
  const activeStatus = searchParams?.status || "";
  const status = activeStatus ? (activeStatus as OrderStatus) : undefined;
  const orders = await getAccountOrders(status);

  const base =
    params.locale === "vi" ? "/vi/tai-khoan/don-hang" : "/en/account/orders";

  return (
    <section>
      <div className={styles.orderTabs}>
        {tabs.map((tab) => (
          <Link
            key={tab.value || "all"}
            href={tab.value ? `${base}?status=${tab.value}` : base}
            className={activeStatus === tab.value ? styles.activeTab : ""}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className={styles.searchBox}>
        🔍 Bạn có thể tìm kiếm theo mã đơn hàng hoặc tên sản phẩm
      </div>

      <div className={styles.orderList}>
        {orders.map((order) => (
          <div className={styles.orderCard} key={order.id}>
            <div className={styles.orderTop}>
              <div>
                <strong>Đơn hàng #{order.code}</strong>
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

              <div>
                <button>Mua lại</button>
                <button>Liên hệ tư vấn</button>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className={styles.card}>Chưa có đơn hàng.</div>
        )}
      </div>
    </section>
  );
}