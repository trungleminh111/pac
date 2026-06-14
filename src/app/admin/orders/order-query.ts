import { Prisma, type OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { orderStatuses } from "./order-workflow";

const adminOrderListSelect = {
  id: true,
  code: true,
  status: true,
  paymentStatus: true,
  paymentMethod: true,
  subtotal: true,
  shippingFee: true,
  discount: true,
  total: true,
  note: true,
  receiverName: true,
  receiverPhone: true,
  receiverEmail: true,
  city: true,
  district: true,
  ward: true,
  street: true,
  createdAt: true,
  updatedAt: true,

  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },

  items: {
    select: {
      id: true,
      productId: true,
      variantId: true,
      sku: true,
      title: true,
      image: true,
      quantity: true,
      price: true,
      subtotal: true,
      attributes: true,
      snapshot: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  },

  statusHistories: {
    select: {
      id: true,
      fromStatus: true,
      toStatus: true,
      reasonType: true,
      reason: true,
      note: true,
      actorName: true,
      actorEmail: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  },
} satisfies Prisma.OrderSelect;

const adminOrderDetailSelect = {
  id: true,
  code: true,
  status: true,
  paymentStatus: true,
  paymentMethod: true,
  subtotal: true,
  shippingFee: true,
  discount: true,
  total: true,
  note: true,
  receiverName: true,
  receiverPhone: true,
  receiverEmail: true,
  city: true,
  district: true,
  ward: true,
  street: true,
  createdAt: true,
  updatedAt: true,

  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },

  items: {
    select: {
      id: true,
      productId: true,
      variantId: true,
      sku: true,
      title: true,
      image: true,
      quantity: true,
      price: true,
      subtotal: true,
      attributes: true,
      snapshot: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  },

  statusHistories: {
    select: {
      id: true,
      fromStatus: true,
      toStatus: true,
      reasonType: true,
      reason: true,
      note: true,
      actorId: true,
      actorName: true,
      actorEmail: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  },
} satisfies Prisma.OrderSelect;

export async function getAdminOrders(input?: {
  status?: OrderStatus;
  q?: string;
}) {
  const q = input?.q?.trim();

  const where: Prisma.OrderWhereInput = {
    ...(input?.status ? { status: input.status } : {}),
  };

  if (q) {
    where.OR = [
      {
        code: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        receiverName: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        receiverPhone: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        receiverEmail: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        note: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        paymentMethod: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        items: {
          some: {
            title: {
              contains: q,
              mode: "insensitive",
            },
          },
        },
      },
      {
        items: {
          some: {
            sku: {
              contains: q,
              mode: "insensitive",
            },
          },
        },
      },
      {
        user: {
          is: {
            email: {
              contains: q,
              mode: "insensitive",
            },
          },
        },
      },
      {
        user: {
          is: {
            name: {
              contains: q,
              mode: "insensitive",
            },
          },
        },
      },
    ];
  }

  return prisma.order.findMany({
    where,
    select: adminOrderListSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAdminOrderById(orderIdOrCode: string) {
  return prisma.order.findFirst({
    where: {
      OR: [
        {
          id: orderIdOrCode,
        },
        {
          code: orderIdOrCode,
        },
      ],
    },
    select: adminOrderDetailSelect,
  });
}

export async function getAdminOrderStats() {
  const grouped = await prisma.order.groupBy({
    by: ["status"],
    _count: {
      _all: true,
    },
  });

  const byStatus = orderStatuses.reduce<Record<OrderStatus, number>>(
    (acc, status) => {
      acc[status] = 0;
      return acc;
    },
    {} as Record<OrderStatus, number>
  );

  let total = 0;

  grouped.forEach((item) => {
    byStatus[item.status] = item._count._all;
    total += item._count._all;
  });

  return {
    total,
    byStatus,
  };
}