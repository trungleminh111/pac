import { prisma } from "@/lib/prisma";
import { PagesClient } from "./pages-client";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({
    include: {
      translations: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return <PagesClient pages={pages} />;
}