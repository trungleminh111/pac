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

type Locale = "vi" | "en";

const orderDetailContent = {
  vi: {
    pageTitle: "Thông tin đơn hàng",
    addressTitle: "Địa chỉ nhận hàng",
    noAddress: "Chưa có địa chỉ",
    storeName: "P.A.C STONE Official Store",
    totalLabel: "Thành tiền:",
    supportTitle: "Bạn cần hỗ trợ?",
    returnRequest: "Gửi yêu cầu Trả hàng/Hoàn tiền",
    buyAgain: "Mua lại",
    dateLocale: "vi-VN",
    statuses: {
      PENDING: "Đơn hàng đang chờ xác nhận",
      CONFIRMED: "Đơn hàng đã được xác nhận",
      PROCESSING: "Đơn hàng đang xử lý",
      SHIPPING: "Đơn hàng đang giao",
      COMPLETED: "Đơn hàng đã hoàn thành",
      CANCELLED: "Đơn hàng đã hủy",
      RETURNED: "Đơn hàng đã trả hàng",
    },
    shippingStatuses: {
      PENDING: "Chờ xác nhận đơn hàng",
      CONFIRMED: "Đã xác nhận đơn hàng",
      PROCESSING: "Đang chuẩn bị hàng",
      SHIPPING: "Đang giao hàng",
      COMPLETED: "Giao hàng thành công",
      CANCELLED: "Đơn hàng đã hủy",
      RETURNED: "Đơn hàng đã trả hàng",
    },
  },
  en: {
    pageTitle: "Order Information",
    addressTitle: "Shipping Address",
    noAddress: "No address available",
    storeName: "P.A.C STONE Official Store",
    totalLabel: "Total:",
    supportTitle: "Need support?",
    returnRequest: "Request Return/Refund",
    buyAgain: "Buy again",
    dateLocale: "en-US",
    statuses: {
      PENDING: "Order is pending confirmation",
      CONFIRMED: "Order has been confirmed",
      PROCESSING: "Order is being processed",
      SHIPPING: "Order is being shipped",
      COMPLETED: "Order has been completed",
      CANCELLED: "Order has been cancelled",
      RETURNED: "Order has been returned",
    },
    shippingStatuses: {
      PENDING: "Waiting for order confirmation",
      CONFIRMED: "Order confirmed",
      PROCESSING: "Preparing your order",
      SHIPPING: "Shipping in progress",
      COMPLETED: "Delivered successfully",
      CANCELLED: "Order cancelled",
      RETURNED: "Order returned",
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

function formatDateTime(
  value: Date | string | null | undefined,
  locale: Locale = "vi"
) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString(orderDetailContent[locale].dateLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusTitle(status: OrderStatus, locale: Locale = "vi") {
  const labels: Record<OrderStatus, string> = {
    PENDING: orderDetailContent[locale].statuses.PENDING,
    CONFIRMED: orderDetailContent[locale].statuses.CONFIRMED,
    PROCESSING: orderDetailContent[locale].statuses.PROCESSING,
    SHIPPING: orderDetailContent[locale].statuses.SHIPPING,
    COMPLETED: orderDetailContent[locale].statuses.COMPLETED,
    CANCELLED: orderDetailContent[locale].statuses.CANCELLED,
    RETURNED: orderDetailContent[locale].statuses.RETURNED,
  };

  return labels[status];
}

function shippingStatusLabel(status: OrderStatus, locale: Locale = "vi") {
  const labels: Record<OrderStatus, string> = {
    PENDING: orderDetailContent[locale].shippingStatuses.PENDING,
    CONFIRMED: orderDetailContent[locale].shippingStatuses.CONFIRMED,
    PROCESSING: orderDetailContent[locale].shippingStatuses.PROCESSING,
    SHIPPING: orderDetailContent[locale].shippingStatuses.SHIPPING,
    COMPLETED: orderDetailContent[locale].shippingStatuses.COMPLETED,
    CANCELLED: orderDetailContent[locale].shippingStatuses.CANCELLED,
    RETURNED: orderDetailContent[locale].shippingStatuses.RETURNED,
  };

  return labels[status];
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
  const content = orderDetailContent[locale];
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
      ? formatDateTime(order.updatedAt, locale)
      : formatDateTime(order.createdAt, locale);

  return (
    <section className={styles.orderDetailPage}>
      <div className={styles.orderDetailHeader}>
        <Link href={ordersHref(locale)} className={styles.orderBackLink}>
          <FiArrowLeft />
        </Link>

        <h1>{content.pageTitle}</h1>
      </div>

      <div className={styles.orderDetailBody}>
        <div className={styles.orderStatusCard}>
          <div className={styles.orderStatusTitle}>
            {statusTitle(order.status, locale)}
          </div>

          <div className={styles.orderWhiteBlock}>
            <div className={styles.orderShippingRow}>
              <FiTruck />
              <div>
                <strong>{shippingStatusLabel(order.status, locale)}</strong>
                <p>{shippingTime}</p>
              </div>
            </div>
          </div>

          <div className={styles.orderWhiteBlock}>
            <h2>{content.addressTitle}</h2>

            <div className={styles.orderAddressRow}>
              <FiMapPin />

              <div>
                <p>
                  <strong>{order.receiverName}</strong>{" "}
                  <span>{order.receiverPhone}</span>
                </p>

                <p>{address || content.noAddress}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.orderStoreCard}>
          <div className={styles.orderStoreHeader}>
            <strong>{content.storeName}</strong>
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

              <strong>{formatPrice(item.price, locale)}</strong>
            </div>
          ))}

          <div className={styles.orderDetailTotal}>
            <p>
              {content.totalLabel} <strong>{formatPrice(order.total, locale)}</strong>
            </p>

            <FiChevronDown />
          </div>
        </div>

        <div className={styles.orderSupportCard}>
          <h2>{content.supportTitle}</h2>

          <div className={styles.orderSupportItem}>
            <FiRotateCcw />

            <span>{content.returnRequest}</span>

            <FiChevronRight />
          </div>
        </div>
      </div>

      <div className={styles.orderBuyAgainBar}>
        <Link href={productsHref(locale)}>{content.buyAgain}</Link>
      </div>
    </section>
  );
}