import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectsTable from "./projects-table";
import { requirePermission } from "@/lib/admin-permissions";
async function deleteProjects(formData: FormData) {
  "use server";

  const ids = formData.getAll("ids").map(String).filter(Boolean);
  if (!ids.length) return;

  await prisma.project.deleteMany({
    where: { id: { in: ids } },
  });

  redirect("/admin/projects");
}

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; locale?: string; status?: string }>;
}) {
  await requirePermission("projects");
  const params = await searchParams;

  const q = params.q?.trim() || "";
  const locale = params.locale || "";
  const status = params.status || "";

  const projects = await prisma.project.findMany({
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

  return (
    <ProjectsTable
      projects={projects}
      q={q}
      locale={locale}
      status={status}
      deleteAction={deleteProjects}
    />
  );
}