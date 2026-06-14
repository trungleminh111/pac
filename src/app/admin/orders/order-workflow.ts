import type { OrderStatus, OrderStatusReasonType } from "@prisma/client";

export type OrderActionTone =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export type OrderStatusActionDirection = "forward" | "backward" | "terminal";

export type OrderStatusAction = {
  to: OrderStatus;
  label: string;
  description: string;
  defaultReason: string;
  requiresReason: boolean;
  requiresConfirm: boolean;
  direction: OrderStatusActionDirection;
  allowedReasonTypes: OrderStatusReasonType[];
  reasonPlaceholder: string;
  notePlaceholder: string;
  tone: OrderActionTone;
};

const Status = {
  PENDING: "PENDING" as OrderStatus,
  CONFIRMED: "CONFIRMED" as OrderStatus,
  PROCESSING: "PROCESSING" as OrderStatus,
  SHIPPING: "SHIPPING" as OrderStatus,
  COMPLETED: "COMPLETED" as OrderStatus,
  CANCELLED: "CANCELLED" as OrderStatus,
  RETURNED: "RETURNED" as OrderStatus,
};

const ReasonType = {
  NORMAL: "NORMAL" as OrderStatusReasonType,
  CUSTOMER_REQUEST: "CUSTOMER_REQUEST" as OrderStatusReasonType,
  STAFF_MISTAKE: "STAFF_MISTAKE" as OrderStatusReasonType,
  OPERATION_FIX: "OPERATION_FIX" as OrderStatusReasonType,
  PAYMENT_ISSUE: "PAYMENT_ISSUE" as OrderStatusReasonType,
  DELIVERY_ISSUE: "DELIVERY_ISSUE" as OrderStatusReasonType,
  PRODUCT_ISSUE: "PRODUCT_ISSUE" as OrderStatusReasonType,
  OTHER: "OTHER" as OrderStatusReasonType,
};

export const orderStatuses: OrderStatus[] = [
  Status.PENDING,
  Status.CONFIRMED,
  Status.PROCESSING,
  Status.SHIPPING,
  Status.COMPLETED,
  Status.CANCELLED,
  Status.RETURNED,
];

export const orderStatusReasonTypes: OrderStatusReasonType[] = [
  ReasonType.NORMAL,
  ReasonType.CUSTOMER_REQUEST,
  ReasonType.STAFF_MISTAKE,
  ReasonType.OPERATION_FIX,
  ReasonType.PAYMENT_ISSUE,
  ReasonType.DELIVERY_ISSUE,
  ReasonType.PRODUCT_ISSUE,
  ReasonType.OTHER,
];

export function isOrderStatus(value: string): value is OrderStatus {
  return orderStatuses.includes(value as OrderStatus);
}

export function isOrderStatusReasonType(
  value: string
): value is OrderStatusReasonType {
  return orderStatusReasonTypes.includes(value as OrderStatusReasonType);
}

export function orderStatusLabel(status: OrderStatus) {
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

export function reasonTypeLabel(type: OrderStatusReasonType) {
  const labels: Record<OrderStatusReasonType, string> = {
    NORMAL: "Xử lý bình thường",
    CUSTOMER_REQUEST: "Theo yêu cầu khách hàng",
    STAFF_MISTAKE: "Sai sót nhân viên",
    OPERATION_FIX: "Điều chỉnh vận hành",
    PAYMENT_ISSUE: "Vấn đề thanh toán",
    DELIVERY_ISSUE: "Vấn đề giao hàng",
    PRODUCT_ISSUE: "Vấn đề sản phẩm",
    OTHER: "Lý do khác",
  };

  return labels[type];
}

export function paymentStatusLabel(status: string | null | undefined) {
  const labels: Record<string, string> = {
    UNPAID: "Chưa thanh toán",
    PAID: "Đã thanh toán",
    REFUNDED: "Đã hoàn tiền",
  };

  return labels[String(status || "")] || String(status || "Không rõ");
}

export function orderStatusBadgeClass(status: OrderStatus) {
  const classes: Record<OrderStatus, string> = {
    PENDING: "bg-amber-100 text-amber-800 ring-amber-200",
    CONFIRMED: "bg-blue-100 text-blue-800 ring-blue-200",
    PROCESSING: "bg-violet-100 text-violet-800 ring-violet-200",
    SHIPPING: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    COMPLETED: "bg-green-100 text-green-800 ring-green-200",
    CANCELLED: "bg-red-100 text-red-800 ring-red-200",
    RETURNED: "bg-gray-100 text-gray-800 ring-gray-200",
  };

  return classes[status];
}

const normalReasonTypes = [ReasonType.NORMAL];

const issueReasonTypes = [
  ReasonType.CUSTOMER_REQUEST,
  ReasonType.STAFF_MISTAKE,
  ReasonType.OPERATION_FIX,
  ReasonType.PAYMENT_ISSUE,
  ReasonType.DELIVERY_ISSUE,
  ReasonType.PRODUCT_ISSUE,
  ReasonType.OTHER,
];

const rollbackReasonTypes = [
  ReasonType.STAFF_MISTAKE,
  ReasonType.OPERATION_FIX,
  ReasonType.CUSTOMER_REQUEST,
  ReasonType.OTHER,
];

export function getOrderStatusActions(status: OrderStatus): OrderStatusAction[] {
  const actions: Record<OrderStatus, OrderStatusAction[]> = {
    PENDING: [
      {
        to: Status.CONFIRMED,
        label: "Xác nhận đơn",
        description: "Xác nhận đơn hợp lệ và chuyển sang bước xử lý.",
        defaultReason: "Admin xác nhận đơn hàng hợp lệ.",
        requiresReason: false,
        requiresConfirm: true,
        direction: "forward",
        allowedReasonTypes: normalReasonTypes,
        reasonPlaceholder: "",
        notePlaceholder: "Ghi chú nội bộ khi xác nhận đơn, nếu có...",
        tone: "primary",
      },
      {
        to: Status.CANCELLED,
        label: "Hủy đơn",
        description:
          "Hủy đơn khi khách yêu cầu, sai thông tin hoặc không thể xử lý.",
        defaultReason: "",
        requiresReason: true,
        requiresConfirm: true,
        direction: "terminal",
        allowedReasonTypes: issueReasonTypes,
        reasonPlaceholder:
          "Nhập lý do hủy đơn rõ ràng. Ví dụ: Khách yêu cầu hủy, sai số điện thoại...",
        notePlaceholder: "Ghi chú nội bộ thêm, nếu có...",
        tone: "danger",
      },
    ],

    CONFIRMED: [
      {
        to: Status.PROCESSING,
        label: "Chuyển sang xử lý",
        description: "Đơn đã được xác nhận và bắt đầu chuẩn bị hàng.",
        defaultReason: "Đơn hàng được chuyển sang bước xử lý.",
        requiresReason: false,
        requiresConfirm: true,
        direction: "forward",
        allowedReasonTypes: normalReasonTypes,
        reasonPlaceholder: "",
        notePlaceholder: "Ghi chú nội bộ khi chuyển xử lý, nếu có...",
        tone: "primary",
      },
      {
        to: Status.PENDING,
        label: "Lùi về chờ xác nhận",
        description:
          "Chỉ dùng khi xác nhận nhầm hoặc cần kiểm tra lại thông tin đơn.",
        defaultReason: "",
        requiresReason: true,
        requiresConfirm: true,
        direction: "backward",
        allowedReasonTypes: rollbackReasonTypes,
        reasonPlaceholder:
          "Nhập lý do lùi trạng thái. Ví dụ: Nhân viên xác nhận nhầm, khách báo đổi thông tin...",
        notePlaceholder: "Ghi chú nội bộ thêm, nếu có...",
        tone: "warning",
      },
      {
        to: Status.CANCELLED,
        label: "Hủy đơn",
        description: "Hủy đơn sau khi đã xác nhận. Bắt buộc có lý do.",
        defaultReason: "",
        requiresReason: true,
        requiresConfirm: true,
        direction: "terminal",
        allowedReasonTypes: issueReasonTypes,
        reasonPlaceholder: "Nhập lý do hủy đơn sau xác nhận...",
        notePlaceholder: "Ghi chú nội bộ thêm, nếu có...",
        tone: "danger",
      },
    ],

    PROCESSING: [
      {
        to: Status.SHIPPING,
        label: "Chuyển sang đang giao",
        description: "Hàng đã được chuẩn bị và bàn giao cho vận chuyển.",
        defaultReason: "Đơn hàng đã được bàn giao vận chuyển.",
        requiresReason: false,
        requiresConfirm: true,
        direction: "forward",
        allowedReasonTypes: normalReasonTypes,
        reasonPlaceholder: "",
        notePlaceholder: "Mã vận đơn / đơn vị giao hàng / ghi chú nội bộ...",
        tone: "success",
      },
      {
        to: Status.CONFIRMED,
        label: "Lùi về đã xác nhận",
        description:
          "Chỉ dùng khi chuyển xử lý nhầm hoặc cần kiểm tra lại trước khi chuẩn bị hàng.",
        defaultReason: "",
        requiresReason: true,
        requiresConfirm: true,
        direction: "backward",
        allowedReasonTypes: rollbackReasonTypes,
        reasonPlaceholder: "Nhập lý do lùi trạng thái...",
        notePlaceholder: "Ghi chú nội bộ thêm, nếu có...",
        tone: "warning",
      },
      {
        to: Status.CANCELLED,
        label: "Hủy đơn",
        description: "Hủy khi đang xử lý. Bắt buộc có lý do để đối chiếu.",
        defaultReason: "",
        requiresReason: true,
        requiresConfirm: true,
        direction: "terminal",
        allowedReasonTypes: issueReasonTypes,
        reasonPlaceholder: "Nhập lý do hủy khi đang xử lý...",
        notePlaceholder: "Ghi chú nội bộ thêm, nếu có...",
        tone: "danger",
      },
    ],

    SHIPPING: [
      {
        to: Status.COMPLETED,
        label: "Hoàn thành đơn",
        description: "Đơn đã giao thành công và hoàn tất.",
        defaultReason: "Đơn hàng đã giao thành công.",
        requiresReason: false,
        requiresConfirm: true,
        direction: "forward",
        allowedReasonTypes: normalReasonTypes,
        reasonPlaceholder: "",
        notePlaceholder: "Ghi chú hoàn tất đơn, nếu có...",
        tone: "success",
      },
      {
        to: Status.PROCESSING,
        label: "Lùi về đang xử lý",
        description:
          "Chỉ dùng khi bấm giao hàng nhầm hoặc đơn chưa thực sự bàn giao vận chuyển.",
        defaultReason: "",
        requiresReason: true,
        requiresConfirm: true,
        direction: "backward",
        allowedReasonTypes: rollbackReasonTypes,
        reasonPlaceholder: "Nhập lý do lùi trạng thái...",
        notePlaceholder: "Ghi chú nội bộ thêm, nếu có...",
        tone: "warning",
      },
      {
        to: Status.RETURNED,
        label: "Trả hàng",
        description: "Đơn bị hoàn/trả. Bắt buộc nhập lý do.",
        defaultReason: "",
        requiresReason: true,
        requiresConfirm: true,
        direction: "terminal",
        allowedReasonTypes: issueReasonTypes,
        reasonPlaceholder:
          "Nhập lý do trả hàng. Ví dụ: Khách không nhận, sai hàng, lỗi vận chuyển...",
        notePlaceholder: "Ghi chú nội bộ thêm, nếu có...",
        tone: "warning",
      },
    ],

    COMPLETED: [
      {
        to: Status.RETURNED,
        label: "Trả hàng sau hoàn thành",
        description:
          "Chỉ dùng khi phát sinh hoàn/trả sau khi đơn đã hoàn tất.",
        defaultReason: "",
        requiresReason: true,
        requiresConfirm: true,
        direction: "terminal",
        allowedReasonTypes: issueReasonTypes,
        reasonPlaceholder: "Nhập lý do trả hàng sau hoàn thành...",
        notePlaceholder: "Ghi chú nội bộ thêm, nếu có...",
        tone: "warning",
      },
    ],

    CANCELLED: [],
    RETURNED: [],
  };

  return actions[status] || [];
}

export function getOrderStatusAction(
  fromStatus: OrderStatus,
  toStatus: OrderStatus
) {
  return getOrderStatusActions(fromStatus).find(
    (action) => action.to === toStatus
  );
}