import Link from "next/link";
import { getAdminServices } from "./service-query";
import { ServicesTable } from "./services-table";
import { ServiceToast } from "./service-toast";

type Props = {
  searchParams?: {
    success?: string;
    error?: string;
  };
};

export default async function AdminServicesPage({ searchParams }: Props) {
  const services = await getAdminServices();

  const total = services.length;
  const publishedCount = services.filter(
    (item) => item.status === "PUBLISHED"
  ).length;
  const draftCount = services.filter((item) => item.status === "DRAFT").length;
  const archivedCount = services.filter(
    (item) => item.status === "ARCHIVED"
  ).length;

  return (
    <div className="space-y-6">
      <ServiceToast
        success={searchParams?.success}
        error={searchParams?.error}
      />

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý dịch vụ
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý dịch vụ, icon, ảnh đại diện, nội dung và SEO song ngữ.
          </p>
        </div>

        <Link
          href="/admin/services/create"
          className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Thêm dịch vụ
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Tổng dịch vụ</div>
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
          <div className="text-sm text-slate-500">Lưu trữ</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {archivedCount}
          </div>
        </div>
      </div>

      <ServicesTable services={services} />
    </div>
  );
}