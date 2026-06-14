"use client";

import { useMemo, useState, useTransition } from "react";
import type { OrderStatus, OrderStatusReasonType } from "@prisma/client";
import type { OrderStatusAction } from "./order-workflow";
import {
  orderStatusLabel,
  reasonTypeLabel,
} from "./order-workflow";
import { updateOrderStatusAction } from "./order-actions";

function actionButtonClass(tone: OrderStatusAction["tone"]) {
  const classes: Record<OrderStatusAction["tone"], string> = {
    primary: "bg-orange-600 text-white hover:bg-orange-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    warning: "bg-amber-500 text-white hover:bg-amber-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
    neutral: "bg-gray-900 text-white hover:bg-gray-800",
  };

  return [
    "inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
    classes[tone],
  ].join(" ");
}

export function OrderStatusActions({
  orderId,
  currentStatus,
  actions,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  actions: OrderStatusAction[];
}) {
  const [activeAction, setActiveAction] = useState<OrderStatusAction | null>(
    null
  );
  const [reasonType, setReasonType] = useState<OrderStatusReasonType | "">("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isPending, startTransition] = useTransition();

  const canSubmit = useMemo(() => {
    if (!activeAction) return false;
    if (!reasonType) return false;
    if (!isChecked) return false;
    if (activeAction.requiresReason && !reason.trim()) return false;

    return true;
  }, [activeAction, reasonType, reason, isChecked]);

  function closeModal() {
    if (isPending) return;

    setActiveAction(null);
    setReasonType("");
    setReason("");
    setNote("");
    setIsChecked(false);
  }

  function openModal(action: OrderStatusAction) {
    setActiveAction(action);
    setReasonType(action.allowedReasonTypes[0] || "");
    setReason(action.requiresReason ? "" : action.defaultReason);
    setNote("");
    setIsChecked(false);
  }

  function submitAction() {
  if (!activeAction) return;

  if (!canSubmit) {
    alert("Vui lòng kiểm tra loại lý do, lý do bắt buộc và xác nhận thao tác.");
    return;
  }

  const action = activeAction;

  const formData = new FormData();
  formData.set("orderId", orderId);
  formData.set("status", action.to);
  formData.set("reasonType", reasonType);
  formData.set("reason", reason.trim() || action.defaultReason);
  formData.set("note", note.trim());

  setActiveAction(null);
  setReasonType("");
  setReason("");
  setNote("");
  setIsChecked(false);

  startTransition(() => {
    updateOrderStatusAction(formData);
  });
}

  if (actions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm leading-6 text-gray-500">
        Đơn hàng đang ở trạng thái kết thúc. Không thể chuyển trạng thái nữa.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {actions.map((action) => (
          <div
            className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
            key={action.to}
          >
            <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-950">
                  {action.label}
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {action.description}
                </p>

                {action.direction === "backward" && (
                  <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
                    Đây là thao tác lùi trạng thái. Chỉ dùng khi có sai sót của
                    nhân viên, yêu cầu khách hàng hoặc cần xử lý lại. Bắt buộc
                    lưu lý do để đối chiếu.
                  </p>
                )}

                {action.direction === "terminal" && (
                  <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-800">
                    Đây là thao tác kết thúc đơn. Sau khi chuyển sang trạng thái
                    này, đơn sẽ không thể xử lý tiếp theo workflow thông thường.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => openModal(action)}
                className={actionButtonClass(action.tone)}
              >
                {action.label}
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-lg font-bold text-gray-950">
                Xác nhận thay đổi trạng thái
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Từ <strong>{orderStatusLabel(currentStatus)}</strong> sang{" "}
                <strong>{orderStatusLabel(activeAction.to)}</strong>
              </p>
            </div>

            <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
                Hành động này sẽ được lưu lịch sử kèm người thao tác, thời gian
                và lý do. Vui lòng kiểm tra kỹ trước khi xác nhận.
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Loại lý do
                </label>

                <select
                  value={reasonType}
                  onChange={(event) =>
                    setReasonType(event.target.value as OrderStatusReasonType)
                  }
                  className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  {activeAction.allowedReasonTypes.map((type) => (
                    <option value={type} key={type}>
                      {reasonTypeLabel(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Lý do {activeAction.requiresReason && "*"}
                </label>

                <textarea
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  required={activeAction.requiresReason}
                  rows={4}
                  placeholder={
                    activeAction.reasonPlaceholder ||
                    "Nhập lý do hoặc giữ lý do mặc định..."
                  }
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Ghi chú nội bộ
                </label>

                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={3}
                  placeholder={activeAction.notePlaceholder}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm leading-6 text-gray-700">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(event) => setIsChecked(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />

                <span>
                  Tôi đã kiểm tra đúng đơn hàng, đúng trạng thái cần chuyển và
                  chịu trách nhiệm về thao tác này.
                </span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-gray-100 p-5">
              <button
                type="button"
                onClick={closeModal}
                disabled={isPending}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={submitAction}
                disabled={isPending || !canSubmit}
                className={actionButtonClass(activeAction.tone)}
              >
                {isPending ? "Đang xử lý..." : "Xác nhận thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}