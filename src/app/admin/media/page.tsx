import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MediaClient from "./media-client";
import { requirePermission } from "@/lib/admin-permissions";

async function deleteMedia(formData: FormData) {
  "use server";

  const ids = formData.getAll("ids").map(String).filter(Boolean);
  if (!ids.length) return;

  await prisma.media.deleteMany({
    where: { id: { in: ids } },
  });

  redirect("/admin/media");
}

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePermission("media");
  const params = await searchParams;
  const q = params.q?.trim() || "";

  const media = await prisma.media.findMany({
    where: q
      ? {
          OR: [
            { filename: { contains: q, mode: "insensitive" } },
            { altVi: { contains: q, mode: "insensitive" } },
            { altEn: { contains: q, mode: "insensitive" } },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
  });

  return <MediaClient media={media} q={q} deleteAction={deleteMedia} />;
}