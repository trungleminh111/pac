import Link from "next/link";
import { notFound } from "next/navigation";
import type { OrderStatus } from "@prisma/client";
import { getAdminOrderById } from "../order-query";
import { OrderStatusActions } from "../order-status-actions";
import {
  getOrderStatusActions,
  orderStatusBadgeClass,
  orderStatusLabel,
  paymentStatusLabel,
  reasonTypeLabel,
} from "../order-workflow";

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

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function addressText(order: {
  street?: string | null;
  ward?: string | null;
  district?: string | null;
  city?: string | null;
}) {
  return [order.street, order.ward, order.district, order.city]
    .filter(Boolean)
    .join(", ");
}

function getSnapshotValue(snapshot: unknown, key: string) {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    return "";
  }

  const value = (snapshot as Record<string, unknown>)[key];

  if (value === null || value === undefined) return "";

  return String(value);
}

function statusBadge(status: OrderStatus) {
  return [
    "inline-flex min-h-7 items-center justify-center rounded-full px-3 text-xs font-semibold ring-1",
    orderStatusBadgeClass(status),
  ].join(" ");
}

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: {
  params:
    | {
        id: string;
      }
    | Promise<{
        id: string;
      }>;
  searchParams?:
    | {
        success?: string;
        error?: string;
      }
    | Promise<{
        success?: string;
        error?: string;
      }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const order = await getAdminOrderById(safeDecode(resolvedParams.id));

  if (!order) {
    notFound();
  }

  const actions = getOrderStatusActions(order.status);
  const address = addressText(order);

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 xl:grid-cols-[auto_1fr_auto] xl:items-center">
        <Link
          href="/admin/orders"
          className="inline-flex h-10 w-max items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          ← Quay lại
        </Link>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-950">
              Đơn hàng {order.code}
            </h1>

            <span className={statusBadge(order.status)}>
              {orderStatusLabel(order.status)}
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Tạo lúc {formatDateTime(order.createdAt)} · Cập nhật{" "}
            {formatDateTime(order.updatedAt)}
          </p>
        </div>

        <div className="text-left xl:text-right">
          <span className="block text-sm text-gray-500">Tổng tiền</span>
          <strong className="text-2xl font-bold text-orange-600">
            {formatPrice(order.total)}
          </strong>
        </div>
      </div>

      {resolvedSearchParams?.success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {resolvedSearchParams.success}
        </div>
      )}

      {resolvedSearchParams?.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {resolvedSearchParams.error}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-lg font-bold text-gray-950">
              Xử lý trạng thái
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Chỉ hiển thị thao tác hợp lệ theo trạng thái hiện tại. Mọi thay
              đổi đều phải xác nhận và ghi lịch sử.
            </p>
          </div>

          <div className="p-5">
            <OrderStatusActions
              orderId={order.id}
              currentStatus={order.status}
              actions={actions}
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-lg font-bold text-gray-950">Note của khách</h2>
          </div>

          <div className="p-5">
            {order.note ? (
              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-orange-800">
                {order.note}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
                Khách không để lại ghi chú.
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-lg font-bold text-gray-950">
              Thông tin khách hàng
            </h2>
          </div>

          <div className="divide-y divide-gray-100 px-5 py-2">
            <div className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
              <span className="text-sm text-gray-500">Người nhận</span>
              <strong className="text-sm text-gray-950">
                {order.receiverName}
              </strong>
            </div>

            <div className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
              <span className="text-sm text-gray-500">Số điện thoại</span>
              <strong className="text-sm text-gray-950">
                {order.receiverPhone}
              </strong>
            </div>

            <div className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
              <span className="text-sm text-gray-500">Email nhận hàng</span>
              <strong className="text-sm text-gray-950">
                {order.receiverEmail || "Không có"}
              </strong>
            </div>

            <div className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
              <span className="text-sm text-gray-500">Email tài khoản</span>
              <strong className="text-sm text-gray-950">
                {order.user?.email || "Không có"}
              </strong>
            </div>

            <div className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
              <span className="text-sm text-gray-500">Địa chỉ snapshot</span>
              <strong className="text-sm leading-6 text-gray-950">
                {address || "Không có địa chỉ"}
              </strong>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-lg font-bold text-gray-950">Thanh toán</h2>
          </div>

          <div className="divide-y divide-gray-100 px-5 py-2">
            <div className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
              <span className="text-sm text-gray-500">Phương thức</span>
              <strong className="text-sm text-gray-950">
                {order.paymentMethod || "Không rõ"}
              </strong>
            </div>

            <div className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
              <span className="text-sm text-gray-500">Trạng thái</span>
              <strong className="text-sm text-gray-950">
                {paymentStatusLabel(order.paymentStatus)}
              </strong>
            </div>

            <div className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
              <span className="text-sm text-gray-500">Tạm tính</span>
              <strong className="text-sm text-gray-950">
                {formatPrice(order.subtotal)}
              </strong>
            </div>

            <div className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
              <span className="text-sm text-gray-500">Giảm giá</span>
              <strong className="text-sm text-gray-950">
                {formatPrice(order.discount)}
              </strong>
            </div>

            <div className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
              <span className="text-sm text-gray-500">Phí vận chuyển</span>
              <strong className="text-sm text-gray-950">
                {formatPrice(order.shippingFee)}
              </strong>
            </div>

            <div className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
              <span className="text-sm text-gray-500">Tổng tiền</span>
              <strong className="text-xl text-orange-600">
                {formatPrice(order.total)}
              </strong>
            </div>
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-950">
            Sản phẩm trong đơn
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Dữ liệu bên dưới là snapshot lúc khách đặt hàng, không phụ thuộc
            việc sửa sản phẩm sau này.
          </p>
        </div>

        <div className="grid gap-4 p-5 xl:grid-cols-2">
          {order.items.map((item) => {
            const snapshotSku = getSnapshotValue(item.snapshot, "sku");
            const snapshotTitle = getSnapshotValue(item.snapshot, "title");
            const snapshotImage = getSnapshotValue(item.snapshot, "image");

            return (
              <article
                key={item.id}
                className="grid gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-[96px_1fr]"
              >
                <img
                  src={
                    item.image ||
                    snapshotImage ||
                    "/assets/images/products/product-1-1.png"
                  }
                  alt={item.title}
                  className="h-24 w-24 rounded-xl bg-white object-cover"
                />

                <div className="min-w-0">
                  <h3 className="text-base font-bold leading-6 text-gray-950">
                    {item.title}
                  </h3>

                  {snapshotTitle && snapshotTitle !== item.title && (
                    <p className="mt-1 text-xs text-gray-500">
                      Snapshot title: {snapshotTitle}
                    </p>
                  )}

                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <p>
                      <span className="text-gray-500">SKU:</span>{" "}
                      <strong>{item.sku || snapshotSku || "Không có"}</strong>
                    </p>

                    <p>
                      <span className="text-gray-500">Số lượng:</span>{" "}
                      <strong>x{item.quantity}</strong>
                    </p>

                    <p>
                      <span className="text-gray-500">Đơn giá:</span>{" "}
                      <strong>{formatPrice(item.price)}</strong>
                    </p>

                    <p>
                      <span className="text-gray-500">Tạm tính:</span>{" "}
                      <strong className="text-orange-600">
                        {formatPrice(item.subtotal)}
                      </strong>
                    </p>
                  </div>

                  <p className="mt-3 text-xs text-gray-500">
                    Product ID: {item.productId || "Không còn liên kết"}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-950">
            Lịch sử trạng thái
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Dùng để đối chiếu ai đã thao tác, đổi từ đâu sang đâu, lý do là gì.
          </p>
        </div>

        <div className="space-y-4 p-5">
          {order.statusHistories.map((history) => (
            <article
              key={history.id}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {history.fromStatus && (
                      <span className={statusBadge(history.fromStatus)}>
                        {orderStatusLabel(history.fromStatus)}
                      </span>
                    )}

                    <span className="text-sm text-gray-400">→</span>

                    <span className={statusBadge(history.toStatus)}>
                      {orderStatusLabel(history.toStatus)}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-700">
                    <strong>Loại lý do:</strong>{" "}
                    {reasonTypeLabel(history.reasonType)}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    <strong>Lý do:</strong> {history.reason}
                  </p>

                  {history.note && (
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      <strong>Ghi chú nội bộ:</strong> {history.note}
                    </p>
                  )}
                </div>

                <div className="text-left text-sm text-gray-500 xl:text-right">
                  <p>{formatDateTime(history.createdAt)}</p>
                  <p className="mt-1">
                    Bởi:{" "}
                    <strong className="text-gray-950">
                      {history.actorName || "Không rõ"}
                    </strong>
                  </p>
                  {history.actorEmail && <p>{history.actorEmail}</p>}
                </div>
              </div>
            </article>
          ))}

          {order.statusHistories.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm text-gray-500">
              Chưa có lịch sử thay đổi trạng thái.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}