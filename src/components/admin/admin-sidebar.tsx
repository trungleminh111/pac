import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Package,
  Wrench,
  Building2,
  ImageIcon,
  Users,
  Settings,
  FolderTree,
  SlidersHorizontal,
  ReceiptText,
} from "lucide-react";
import { getCurrentAdminRole } from "@/lib/admin-permissions";
import { getPermissionSettings } from "@/lib/settings";
import type { AdminModule } from "@/lib/admin-permissions";

const menu: {
  label: string;
  href: string;
  icon: any;
  module: AdminModule;
}[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, module: "dashboard" },
  { label: "Bài viết", href: "/admin/posts", icon: FileText, module: "posts" },
  { label: "Sản phẩm", href: "/admin/products", icon: Package, module: "products" },
  { label: "Dịch vụ", href: "/admin/services", icon: Wrench, module: "services" },
  { label: "Công trình", href: "/admin/projects", icon: Building2, module: "projects" },
  { label: "Danh mục", href: "/admin/categories", icon: FolderTree, module: "categories" },
  { label: "Media", href: "/admin/media", icon: ImageIcon, module: "media" },
  { label: "Người dùng", href: "/admin/users", icon: Users, module: "users" },
  { label: "Menus", href: "/admin/menus", icon: FolderTree, module: "menus" },
  { label: "Trang", href: "/admin/pages", icon: FileText, module: "pages" },
  { label: "Thuộc tính", href: "/admin/attributes", icon: SlidersHorizontal, module: "attributes" },
  { label: "Đơn hàng", href: "/admin/orders", icon: ReceiptText, module: "orders" },
  { label: "Cài đặt", href: "/admin/settings", icon: Settings, module: "settings" },
];

export async function AdminSidebar() {
  const role = await getCurrentAdminRole();
  const permissions = await getPermissionSettings();

  const visibleMenu = menu.filter((item) => {
    return permissions?.[role]?.[item.module];
  });

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <div>
          <div className="text-lg font-bold text-slate-950">P.A.C STONE</div>
          <div className="text-xs text-slate-500">Admin Panel • {role}</div>
        </div>
      </div>

      <nav className="space-y-1 p-4">
        {visibleMenu.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}