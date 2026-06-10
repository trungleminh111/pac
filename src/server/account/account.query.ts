import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function getCurrentAccount() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) return null;

  return prisma.user.findUnique({
    where: { email: session.user.email },
  });
}

export async function getAccountProfile() {
  const user = await getCurrentAccount();

  if (!user) return null;

  return {
    id: user.id,
    name: user.name || "",
    email: user.email,
    image: user.image || "",
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function getAccountAddresses() {
  const user = await getCurrentAccount();

  if (!user) return [];

  return prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function getAccountOrders(status?: OrderStatus) {
  const user = await getCurrentAccount();

  if (!user) return [];

  return prisma.order.findMany({
    where: {
      userId: user.id,
      ...(status ? { status } : {}),
    },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}