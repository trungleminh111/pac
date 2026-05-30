import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostsTable from "./posts-table";
import { requirePermission } from "@/lib/admin-permissions";

async function deletePosts(formData: FormData) {
  "use server";

  const ids = formData.getAll("ids").map(String).filter(Boolean);

  if (ids.length === 0) {
    return;
  }

  await prisma.post.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  redirect("/admin/posts");
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    locale?: string;
    status?: string;
  }>;
}) {
  await requirePermission("posts");
  const params = await searchParams;

  const q = params.q?.trim() || "";
  const locale = params.locale || "";
  const status = params.status || "";

  const posts = await prisma.post.findMany({
    where: {
      ...(status
        ? {
            status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
          }
        : {}),

      translations: {
        some: {
          ...(locale ? { locale: locale as "vi" | "en" } : {}),
          ...(q
            ? {
                OR: [
                  {
                    title: {
                      contains: q,
                      mode: "insensitive",
                    },
                  },
                  {
                    slug: {
                      contains: q,
                      mode: "insensitive",
                    },
                  },
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <PostsTable
      posts={posts}
      q={q}
      locale={locale}
      status={status}
      deleteAction={deletePosts}
    />
  );
}