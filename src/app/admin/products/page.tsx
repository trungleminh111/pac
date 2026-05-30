import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductsTable from "./products-table";
import { requirePermission } from "@/lib/admin-permissions";

async function deleteProducts(formData: FormData) {
  "use server";

  const ids = formData.getAll("ids").map(String).filter(Boolean);
  if (!ids.length) return;

  await prisma.product.deleteMany({
    where: { id: { in: ids } },
  });

  redirect("/admin/products");
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; locale?: string; status?: string }>;
}) {
  await requirePermission("products");
  const params = await searchParams;

  const q = params.q?.trim() || "";
  const locale = params.locale || "";
  const status = params.status || "";

  const products = await prisma.product.findMany({
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
    orderBy: { createdAt: "desc" },
  });

  const productsForTable = products.map((product) => ({
    ...product,
    price: product.price ? product.price.toString() : null,
  }));

  return (
    <ProductsTable
      products={productsForTable}
      q={q}
      locale={locale}
      status={status}
      deleteAction={deleteProducts}
    />
  );
}