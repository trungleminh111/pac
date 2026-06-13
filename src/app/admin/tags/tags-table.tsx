import Link from "next/link";
import { deleteTagAction } from "./tag-actions";
import type { AdminTagItem } from "./tag.type";

export function TagsTable({ tags }: { tags: AdminTagItem[] }) {
  if (!tags.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="text-base font-semibold text-slate-900">
          Chưa có tag nào
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Tạo tag để phân nhóm tin tức theo chủ đề.
        </p>

        <Link
          href="/admin/tags/create"
          className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Thêm tag
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Tag</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">English</th>
              <th className="px-5 py-3">Bài viết</th>
              <th className="px-5 py-3">Trạng thái</th>
              <th className="px-5 py-3">Thứ tự</th>
              <th className="px-5 py-3 text-right">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <div className="font-medium text-slate-900">
                    {tag.nameVi}
                  </div>

                  {tag.descriptionVi && (
                    <div className="mt-1 line-clamp-1 text-xs text-slate-500">
                      {tag.descriptionVi}
                    </div>
                  )}
                </td>

                <td className="px-5 py-4">
                  <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
                    {tag.slug}
                  </code>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {tag.nameEn || "—"}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {tag.postsCount}
                </td>

                <td className="px-5 py-4">
                  {tag.isActive ? (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                      Đang hiện
                    </span>
                  ) : (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-500">
                      Tạm ẩn
                    </span>
                  )}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {tag.sortOrder}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/tags/${tag.id}/edit`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Sửa
                    </Link>

                    <form action={deleteTagAction}>
                      <input type="hidden" name="id" value={tag.id} />
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