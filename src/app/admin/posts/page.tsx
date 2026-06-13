import Link from "next/link";
import { getAdminPosts } from "./post-query";
import { PostsTable } from "./posts-table";
import { PostToast } from "./post-toast";

type Props = {
  searchParams?: {
    success?: string;
    error?: string;
  };
};

export default async function AdminPostsPage({ searchParams }: Props) {
  const posts = await getAdminPosts();

  const total = posts.length;
  const publishedCount = posts.filter(
    (item) => item.status === "PUBLISHED"
  ).length;
  const draftCount = posts.filter((item) => item.status === "DRAFT").length;
  const featuredCount = posts.filter((item) => item.isFeatured).length;

  return (
    <div className="space-y-6">
      <PostToast success={searchParams?.success} error={searchParams?.error} />

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý bài viết
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý tin tức, bài viết, danh mục và tag.
          </p>
        </div>

        <Link
          href="/admin/posts/create"
          className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Thêm bài viết
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Tổng bài viết</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{total}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Đã xuất bản</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {publishedCount}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Bản nháp</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {draftCount}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Nổi bật</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {featuredCount}
          </div>
        </div>
      </div>

      <PostsTable posts={posts} />
    </div>
  );
}