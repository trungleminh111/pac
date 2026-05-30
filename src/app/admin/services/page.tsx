import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServicesTable from "./services-table";
import { requirePermission } from "@/lib/admin-permissions";

async function deleteServices(formData: FormData) {
  "use server";

  const ids = formData.getAll("ids").map(String).filter(Boolean);
  if (!ids.length) return;

  await prisma.service.deleteMany({
    where: { id: { in: ids } },
  });

  redirect("/admin/services");
}

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; locale?: string; status?: string }>;
}) {
  await requirePermission("services");
  const params = await searchParams;

  const q = params.q?.trim() || "";
  const locale = params.locale || "";
  const status = params.status || "";

  const services = await prisma.service.findMany({
    where: {
      ...(status
        ? { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" }
        : {}),
      translations: {
        some: {
          ...(locale ? { locale: locale as "vi" | "en" } : {}),
          ...(q
            ? {
                OR: [
                  { title: { contains: q, mode: "insensitive" } },
                  { slug: { contains: q, mode: "insensitive" } },
                ],
              }
            : {}),
        },
      },
    },
    include: {
      category: true,
      translations: true,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <ServicesTable
      services={services}
      q={q}
      locale={locale}
      status={status}
      deleteAction={deleteServices}
    />
  );
}