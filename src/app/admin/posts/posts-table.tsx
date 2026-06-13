import Link from "next/link";
import { deletePostAction } from "./post-actions";
import type { AdminPostItem } from "./post.type";

function StatusBadge({ status }: { status: AdminPostItem["status"] }) {
  if (status === "PUBLISHED") {
    return (
      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
        Đã xuất bản
      </span>
    );
  }

  if (status === "ARCHIVED") {
    return (
      <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-500">
        Lưu trữ
      </span>
    );
  }

  return (
    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
      Nháp
    </span>
  );
}

export function PostsTable({ posts }: { posts: AdminPostItem[] }) {
  if (!posts.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="text-base font-semibold text-slate-900">
          Chưa có bài viết nào
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Tạo bài viết đầu tiên cho mục tin tức.
        </p>

        <Link
          href="/admin/posts/create"
          className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Thêm bài viết
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Bài viết</th>
              <th className="px-5 py-3">Danh mục</th>
              <th className="px-5 py-3">Tags</th>
              <th className="px-5 py-3">Trạng thái</th>
              <th className="px-5 py-3">Nổi bật</th>
              <th className="px-5 py-3">Ngày đăng</th>
              <th className="px-5 py-3 text-right">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <div className="flex gap-3">
                    <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {post.thumbnail ? (
                        <img
                          src={post.thumbnail}
                          alt={post.titleVi}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-medium text-slate-900">
                        {post.titleVi}
                      </div>

                      {post.titleEn && (
                        <div className="mt-1 text-xs text-slate-500">
                          EN: {post.titleEn}
                        </div>
                      )}

                      <div className="mt-1 text-xs text-slate-400">
                        /{post.slugVi || post.slugEn}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {post.categoryName}
                </td>

                <td className="px-5 py-4">
                  {post.tags.length ? (
                    <div className="flex max-w-xs flex-wrap gap-1">
                      {post.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}

                      {post.tags.length > 4 && (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                          +{post.tags.length - 4}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={post.status} />
                </td>

                <td className="px-5 py-4">
                  {post.isFeatured ? (
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      Có
                    </span>
                  ) : (
                    <span className="text-slate-400">Không</span>
                  )}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {post.publishedAt || "—"}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/posts/${post.id}/edit?locale=vi`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Sửa
                    </Link>

                    <form action={deletePostAction}>
                      <input type="hidden" name="id" value={post.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Xoá
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}