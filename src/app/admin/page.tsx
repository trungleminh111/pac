import Link from "next/link";
import {
  FileText,
  Package,
  Wrench,
  Building2,
  ImageIcon,
  Users,
  ArrowRight,
} from "lucide-react";
import { getDashboardStats } from "@/lib/admin-dashboard";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    {
      label: "Bài viết",
      value: stats.posts,
      href: "/admin/posts",
      icon: FileText,
    },
    {
      label: "Sản phẩm",
      value: stats.products,
      href: "/admin/products",
      icon: Package,
    },
    {
      label: "Dịch vụ",
      value: stats.services,
      href: "/admin/services",
      icon: Wrench,
    },
    {
      label: "Công trình",
      value: stats.projects,
      href: "/admin/projects",
      icon: Building2,
    },
    {
      label: "Media",
      value: stats.media,
      href: "/admin/media",
      icon: ImageIcon,
    },
    {
      label: "Người dùng",
      value: stats.users,
      href: "/admin/users",
      icon: Users,
    },
  ];

  const totalPosts = stats.publishedPosts + stats.draftPosts;
  const publishedPercent =
    totalPosts > 0 ? Math.round((stats.publishedPosts / totalPosts) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tổng quan dữ liệu thật trong hệ thống CMS.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#2271b1]">
                  <Icon className="h-6 w-6" />
                </div>

                <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700" />
              </div>

              <div className="mt-5">
                <div className="text-sm font-medium text-slate-500">
                  {card.label}
                </div>
                <div className="mt-2 text-4xl font-bold text-slate-950">
                  {card.value}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          Trạng thái bài viết
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Đã xuất bản</div>
            <div className="mt-2 text-3xl font-bold text-slate-950">
              {stats.publishedPosts}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Bản nháp</div>
            <div className="mt-2 text-3xl font-bold text-slate-950">
              {stats.draftPosts}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-500">Tỷ lệ xuất bản</span>
            <strong>{publishedPercent}%</strong>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#2271b1]"
              style={{ width: `${publishedPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}