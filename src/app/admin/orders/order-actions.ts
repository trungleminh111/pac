"use server";

import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { OrderStatus, OrderStatusReasonType } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getOrderStatusAction,
  isOrderStatus,
  isOrderStatusReasonType,
  orderStatusLabel,
  reasonTypeLabel,
} from "./order-workflow";

function messageParam(message: string) {
  return encodeURIComponent(message);
}

function errorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Không thể cập nhật trạng thái đơn hàng.";
}

async function getActor() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name || user.email || "Admin",
    email: user.email,
    role: user.role,
  };
}

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = String(formData.get("orderId") || "");
  const nextStatusRaw = String(formData.get("status") || "");
  const reasonTypeRaw = String(formData.get("reasonType") || "");
  const reason = String(formData.get("reason") || "").trim();
  const note = String(formData.get("note") || "").trim();

  if (!orderId) {
    redirect(`/admin/orders?error=${messageParam("Thiếu mã đơn hàng.")}`);
  }

  if (!isOrderStatus(nextStatusRaw)) {
    redirect(
      `/admin/orders/${orderId}?error=${messageParam(
        "Trạng thái mới không hợp lệ."
      )}`
    );
  }

  if (!isOrderStatusReasonType(reasonTypeRaw)) {
    redirect(
      `/admin/orders/${orderId}?error=${messageParam(
        "Loại lý do không hợp lệ."
      )}`
    );
  }

  const actor = await getActor();

  if (!actor) {
    redirect(
      `/admin/orders/${orderId}?error=${messageParam(
        "Không xác định được người thao tác. Vui lòng đăng nhập lại."
      )}`
    );
  }

  const nextStatus = nextStatusRaw as OrderStatus;
  const reasonType = reasonTypeRaw as OrderStatusReasonType;

  let redirectTo = `/admin/orders/${orderId}?success=${messageParam(
    "Đã cập nhật trạng thái đơn hàng."
  )}`;

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: {
          id: orderId,
        },
        select: {
          id: true,
          code: true,
          status: true,
        },
      });

      if (!order) {
        throw new Error("Không tìm thấy đơn hàng.");
      }

      const currentStatus = order.status;

      if (currentStatus === nextStatus) {
        throw new Error("Trạng thái mới đang trùng với trạng thái hiện tại.");
      }

      const action = getOrderStatusAction(currentStatus, nextStatus);

      if (!action) {
        throw new Error(
          `Không thể chuyển từ "${orderStatusLabel(
            currentStatus
          )}" sang "${orderStatusLabel(nextStatus)}".`
        );
      }

      if (!action.allowedReasonTypes.includes(reasonType)) {
        throw new Error(
          `Loại lý do "${reasonTypeLabel(
            reasonType
          )}" không phù hợp với thao tác "${action.label}".`
        );
      }

      if (action.requiresReason && !reason) {
        throw new Error("Bắt buộc nhập lý do rõ ràng cho thao tác này.");
      }

      const finalReason = reason || action.defaultReason;

      if (!finalReason) {
        throw new Error("Thiếu lý do cập nhật trạng thái.");
      }

      await tx.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: nextStatus,
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          fromStatus: currentStatus,
          toStatus: nextStatus,
          reasonType,
          reason: finalReason,
          note: note || null,
          actorId: actor.id,
          actorName: actor.name,
          actorEmail: actor.email,
        },
      });
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/vi/tai-khoan/don-hang");
    revalidatePath("/en/account/orders");
  } catch (error) {
    redirectTo = `/admin/orders/${orderId}?error=${messageParam(
      errorMessage(error)
    )}`;
  }

  redirect(redirectTo);
}