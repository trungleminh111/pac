import Link from "next/link";
import { deleteServiceAction } from "./service-actions";
import type { AdminServiceItem } from "./service.type";

function StatusBadge({ status }: { status: AdminServiceItem["status"] }) {
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

export function ServicesTable({ services }: { services: AdminServiceItem[] }) {
  if (!services.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="text-base font-semibold text-slate-900">
          Chưa có dịch vụ nào
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Tạo dịch vụ đầu tiên cho website.
        </p>

        <Link
          href="/admin/services/create"
          className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Thêm dịch vụ
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Dịch vụ</th>
              <th className="px-5 py-3">Danh mục</th>
              <th className="px-5 py-3">Trạng thái</th>
              <th className="px-5 py-3">Thứ tự</th>
              <th className="px-5 py-3">Ngày đăng</th>
              <th className="px-5 py-3 text-right">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <div className="flex gap-3">
                    <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {service.thumbnail ? (
                        <img
                          src={service.thumbnail}
                          alt={service.titleVi}
                          className="h-full w-full object-cover"
                        />
                      ) : service.icon ? (
                        <img
                          src={service.icon}
                          alt={service.titleVi}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-medium text-slate-900">
                        {service.titleVi}
                      </div>

                      {service.titleEn && (
                        <div className="mt-1 text-xs text-slate-500">
                          EN: {service.titleEn}
                        </div>
                      )}

                      <div className="mt-1 text-xs text-slate-400">
                        /{service.slugVi || service.slugEn}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {service.categoryName}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={service.status} />
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {service.sortOrder}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {service.publishedAt || "—"}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/services/${service.id}/edit?locale=vi`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Sửa
                    </Link>

                    <form action={deleteServiceAction}>
                      <input type="hidden" name="id" value={service.id} />
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