import Link from "next/link";
import {
  getAdminOrders,
  getAdminOrderStats,
} from "./order-query";
import {
  isOrderStatus,
  orderStatusBadgeClass,
  orderStatusLabel,
  orderStatuses,
  paymentStatusLabel,
} from "./order-workflow";

function formatPrice(value: any) {
  return Number(value || 0).toLocaleString("vi-VN") + "đ";
}

function formatDateTime(value: Date | string) {
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function filterHref(status: string, q: string) {
  const params = new URLSearchParams();

  if (status) params.set("status", status);
  if (q) params.set("q", q);

  const query = params.toString();

  return query ? `/admin/orders?${query}` : "/admin/orders";
}

function statusBadge(status: any) {
  return [
    "inline-flex min-h-7 items-center justify-center rounded-full px-3 text-xs font-semibold ring-1",
    orderStatusBadgeClass(status),
  ].join(" ");
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

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?:
    | {
        status?: string;
        q?: string;
        success?: string;
        error?: string;
      }
    | Promise<{
        status?: string;
        q?: string;
        success?: string;
        error?: string;
      }>;
}) {
  const resolvedSearchParams = await searchParams;

  const q = String(resolvedSearchParams?.q || "").trim();
  const rawStatus = String(resolvedSearchParams?.status || "");
  const activeStatus = isOrderStatus(rawStatus) ? rawStatus : "";

  const [orders, stats] = await Promise.all([
    getAdminOrders({
      q,
      status: activeStatus || undefined,
    }),
    getAdminOrderStats(),
  ]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-950">Quản lý đơn hàng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý đơn theo workflow, xem note khách, địa chỉ snapshot, sản phẩm snapshot và lịch sử thao tác.
          </p>
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          href={filterHref("", q)}
          className={[
            "rounded-2xl border bg-white p-4 text-gray-950 shadow-sm transition hover:border-orange-300 hover:shadow-md",
            !activeStatus
              ? "border-orange-500 ring-1 ring-orange-100"
              : "border-gray-200",
          ].join(" ")}
        >
          <span className="text-sm text-gray-500">Tổng đơn</span>
          <strong className="mt-2 block text-2xl leading-none">
            {stats.total}
          </strong>
        </Link>

        {orderStatuses.map((status) => (
          <Link
            href={filterHref(status, q)}
            className={[
              "rounded-2xl border bg-white p-4 text-gray-950 shadow-sm transition hover:border-orange-300 hover:shadow-md",
              activeStatus === status
                ? "border-orange-500 ring-1 ring-orange-100"
                : "border-gray-200",
            ].join(" ")}
            key={status}
          >
            <span className="text-sm text-gray-500">
              {orderStatusLabel(status)}
            </span>
            <strong className="mt-2 block text-2xl leading-none">
              {stats.byStatus[status] || 0}
            </strong>
          </Link>
        ))}
      </div>

      <form
        className="grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm xl:grid-cols-[1fr_220px_auto_auto]"
        action="/admin/orders"
      >
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Tìm mã đơn, tên khách, SĐT, email, note, SKU, sản phẩm..."
          className="h-11 rounded-xl border border-gray-300 px-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />

        <select
          name="status"
          defaultValue={activeStatus}
          className="h-11 rounded-xl border border-gray-300 px-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        >
          <option value="">Tất cả trạng thái</option>
          {orderStatuses.map((status) => (
            <option value={status} key={status}>
              {orderStatusLabel(status)}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-orange-600 px-5 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          Tìm kiếm
        </button>

        {(q || activeStatus) && (
          <Link
            href="/admin/orders"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-orange-600 bg-white px-5 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
          >
            Xóa lọc
          </Link>
        )}
      </form>

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
        {orders.map((order) => {
          const totalQuantity = order.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          const lastHistory = order.statusHistories[0];

          return (
            <article
              key={order.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex flex-col gap-4 border-b border-gray-100 p-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-lg font-bold text-orange-600 hover:underline"
                    >
                      {order.code}
                    </Link>

                    <span className={statusBadge(order.status)}>
                      {orderStatusLabel(order.status)}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    Tạo lúc {formatDateTime(order.createdAt)}
                  </p>

                  {lastHistory && (
                    <p className="mt-1 text-xs text-gray-400">
                      Cập nhật gần nhất bởi{" "}
                      <strong>{lastHistory.actorName || "Không rõ"}</strong> lúc{" "}
                      {formatDateTime(lastHistory.createdAt)}
                    </p>
                  )}
                </div>

                <div className="text-left xl:text-right">
                  <span className="block text-sm text-gray-500">Tổng tiền</span>
                  <strong className="text-2xl font-bold text-orange-600">
                    {formatPrice(order.total)}
                  </strong>
                </div>
              </div>

              <div className="grid gap-5 p-5 xl:grid-cols-[1fr_1fr]">
                <section className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Khách hàng
                    </span>
                    <strong className="mt-1 block text-sm text-gray-950">
                      {order.receiverName} - {order.receiverPhone}
                    </strong>
                    {order.receiverEmail && (
                      <p className="mt-1 text-sm text-gray-500">
                        {order.receiverEmail}
                      </p>
                    )}
                    {order.user?.email && (
                      <p className="mt-1 text-sm text-gray-500">
                        Tài khoản: {order.user.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Địa chỉ snapshot
                    </span>
                    <p className="mt-1 text-sm leading-6 text-gray-700">
                      {addressText(order) || "Không có địa chỉ"}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Thanh toán
                    </span>
                    <p className="mt-1 text-sm text-gray-700">
                      {paymentStatusLabel(order.paymentStatus)} ·{" "}
                      {order.paymentMethod || "Không rõ"}
                    </p>
                  </div>
                </section>

                <section className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Sản phẩm
                    </span>

                    <div className="mt-2 space-y-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-3 rounded-xl bg-gray-50 p-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-950">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {item.sku || "Không có SKU"} · x{item.quantity}
                            </p>
                          </div>

                          <strong className="shrink-0 text-sm text-gray-900">
                            {formatPrice(item.subtotal)}
                          </strong>
                        </div>
                      ))}

                      {order.items.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{order.items.length - 3} sản phẩm khác
                        </p>
                      )}

                      <p className="text-xs text-gray-500">
                        Tổng số lượng: {totalQuantity}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="border-t border-gray-100 bg-gray-50 p-5">
                <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Note khách
                    </span>

                    {order.note ? (
                      <div className="mt-2 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm leading-6 text-orange-800">
                        {order.note}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-gray-400">
                        Khách không để lại ghi chú.
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-orange-600 px-5 text-sm font-semibold text-white transition hover:bg-orange-700"
                  >
                    Xem & xử lý đơn
                  </Link>
                </div>
              </div>
            </article>
          );
        })}

        {orders.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
            Không có đơn hàng phù hợp.
          </div>
        )}
      </div>
    </div>
  );
}