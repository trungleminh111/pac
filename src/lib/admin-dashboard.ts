import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [
    posts,
    products,
    services,
    projects,
    media,
    users,
    draftPosts,
    publishedPosts,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.product.count(),
    prisma.service.count(),
    prisma.project.count(),
    prisma.media.count(),
    prisma.user.count(),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
  ]);

  return {
    posts,
    products,
    services,
    projects,
    media,
    users,
    draftPosts,
    publishedPosts,
  };
}