import Link from "next/link";
import { deleteProjectAction } from "./project-actions";
import type { AdminProjectItem } from "./project.type";

function StatusBadge({ status }: { status: AdminProjectItem["status"] }) {
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

export function ProjectsTable({ projects }: { projects: AdminProjectItem[] }) {
  if (!projects.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="text-base font-semibold text-slate-900">
          Chưa có công trình nào
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Tạo công trình đầu tiên cho website.
        </p>

        <Link
          href="/admin/projects/create"
          className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Thêm công trình
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
              <th className="px-5 py-3">Công trình</th>
              <th className="px-5 py-3">Danh mục</th>
              <th className="px-5 py-3">Khách hàng</th>
              <th className="px-5 py-3">Hạng mục</th>
              <th className="px-5 py-3">Trạng thái</th>
              <th className="px-5 py-3">Hoàn thành</th>
              <th className="px-5 py-3 text-right">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <div className="flex gap-3">
                    <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.titleVi}
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
                        {project.titleVi}
                      </div>

                      {project.titleEn && (
                        <div className="mt-1 text-xs text-slate-500">
                          EN: {project.titleEn}
                        </div>
                      )}

                      <div className="mt-1 text-xs text-slate-400">
                        /{project.slugVi || project.slugEn}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {project.categoryName}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {project.clientName || "—"}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {project.projectType || "—"}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={project.status} />
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {project.completedAt || "—"}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/projects/${project.id}/edit?locale=vi`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Sửa
                    </Link>

                    <form action={deleteProjectAction}>
                      <input type="hidden" name="id" value={project.id} />
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