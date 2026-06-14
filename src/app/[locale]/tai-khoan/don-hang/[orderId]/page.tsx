import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import {
  FiArrowLeft,
  FiChevronDown,
  FiChevronRight,
  FiMapPin,
  FiRotateCcw,
  FiTruck,
} from "react-icons/fi";
import { getAccountOrderDetail } from "@/server/account/account.query";
import styles from "../../account.module.css";

function formatPrice(value: any) {
  return Number(value || 0).toLocaleString("vi-VN") + "đ";
}

function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusTitle(status: OrderStatus) {
  const labels: Record<OrderStatus, string> = {
    PENDING: "Đơn hàng đang chờ xác nhận",
    CONFIRMED: "Đơn hàng đã được xác nhận",
    PROCESSING: "Đơn hàng đang xử lý",
    SHIPPING: "Đơn hàng đang giao",
    COMPLETED: "Đơn hàng đã hoàn thành",
    CANCELLED: "Đơn hàng đã hủy",
    RETURNED: "Đơn hàng đã trả hàng",
  };

  return labels[status];
}

function shippingStatusLabel(status: OrderStatus) {
  if (status === "COMPLETED") return "Giao hàng thành công";
  if (status === "SHIPPING") return "Đang giao hàng";
  if (status === "CANCELLED") return "Đơn hàng đã hủy";
  if (status === "RETURNED") return "Đơn hàng đã trả hàng";
  if (status === "PROCESSING") return "Đang chuẩn bị hàng";
  if (status === "CONFIRMED") return "Đã xác nhận đơn hàng";

  return "Chờ xác nhận đơn hàng";
}

function formatAddress(order: {
  street?: string | null;
  ward?: string | null;
  district?: string | null;
  city?: string | null;
}) {
  return [order.street, order.ward, order.district, order.city]
    .filter(Boolean)
    .join(", ");
}

function productsHref(locale: "vi" | "en") {
  return locale === "vi" ? "/vi/san-pham" : "/en/products";
}

function ordersHref(locale: "vi" | "en") {
  return locale === "vi" ? "/vi/tai-khoan/don-hang" : "/en/account/orders";
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params:
    | {
        locale: "vi" | "en";
        orderId: string;
      }
    | Promise<{
        locale: "vi" | "en";
        orderId: string;
      }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale === "en" ? "en" : "vi";
  const orderId = safeDecode(resolvedParams.orderId || "");

  if (!orderId) {
    notFound();
  }

  const order = await getAccountOrderDetail(orderId);

  if (!order) {
    notFound();
  }

  const address = formatAddress(order);
  const shippingTime =
    order.status === "COMPLETED"
      ? formatDateTime(order.updatedAt)
      : formatDateTime(order.createdAt);

  return (
    <section className={styles.orderDetailPage}>
      <div className={styles.orderDetailHeader}>
        <Link href={ordersHref(locale)} className={styles.orderBackLink}>
          <FiArrowLeft />
        </Link>

        <h1>Thông tin đơn hàng</h1>
      </div>

      <div className={styles.orderDetailBody}>
        <div className={styles.orderStatusCard}>
          <div className={styles.orderStatusTitle}>
            {statusTitle(order.status)}
          </div>

          <div className={styles.orderWhiteBlock}>
            <div className={styles.orderShippingRow}>
              <FiTruck />
              <div>
                <strong>{shippingStatusLabel(order.status)}</strong>
                <p>{shippingTime}</p>
              </div>
            </div>
          </div>

          <div className={styles.orderWhiteBlock}>
            <h2>Địa chỉ nhận hàng</h2>

            <div className={styles.orderAddressRow}>
              <FiMapPin />

              <div>
                <p>
                  <strong>{order.receiverName}</strong>{" "}
                  <span>{order.receiverPhone}</span>
                </p>

                <p>{address || "Chưa có địa chỉ"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.orderStoreCard}>
          <div className={styles.orderStoreHeader}>
            <strong>P.A.C STONE Official Store</strong>
            <FiChevronRight />
          </div>

          {order.items.map((item) => (
            <div className={styles.orderDetailProduct} key={item.id}>
              <img
                src={item.image || "/assets/images/products/product-1-1.png"}
                alt={item.title}
              />

              <div>
                <h3>{item.title}</h3>
                {"sku" in item && item.sku && <p>{item.sku}</p>}
                <span>x{item.quantity}</span>
              </div>

              <strong>{formatPrice(item.price)}</strong>
            </div>
          ))}

          <div className={styles.orderDetailTotal}>
            <p>
              Thành tiền: <strong>{formatPrice(order.total)}</strong>
            </p>

            <FiChevronDown />
          </div>
        </div>

        <div className={styles.orderSupportCard}>
          <h2>Bạn cần hỗ trợ?</h2>

          <div className={styles.orderSupportItem}>
            <FiRotateCcw />

            <span>Gửi yêu cầu Trả hàng/Hoàn tiền</span>

            <FiChevronRight />
          </div>
        </div>
      </div>

      <div className={styles.orderBuyAgainBar}>
        <Link href={productsHref(locale)}>Mua lại</Link>
      </div>
    </section>
  );
}