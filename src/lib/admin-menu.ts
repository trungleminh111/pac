import {
  BarChart3,
  FileText,
  FolderTree,
  ImageIcon,
  Package,
  Settings,
  Users,
  Wrench,
  Building2,
} from "lucide-react";
import type { AdminModule } from "@/lib/admin-permissions";

export const adminMenuItems: {
  label: string;
  href: string;
  icon: any;
  module: AdminModule;
}[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: BarChart3,
    module: "dashboard",
  },
  {
    label: "Bài viết",
    href: "/admin/posts",
    icon: FileText,
    module: "posts",
  },
  {
    label: "Sản phẩm",
    href: "/admin/products",
    icon: Package,
    module: "products",
  },
  {
    label: "Dịch vụ",
    href: "/admin/services",
    icon: Wrench,
    module: "services",
  },
  {
    label: "Công trình",
    href: "/admin/projects",
    icon: Building2,
    module: "projects",
  },
  {
    label: "Media",
    href: "/admin/media",
    icon: ImageIcon,
    module: "media",
  },
  {
    label: "Danh mục",
    href: "/admin/categories",
    icon: FolderTree,
    module: "categories",
  },
  {
    label: "Người dùng",
    href: "/admin/users",
    icon: Users,
    module: "users",
  },
  {
    label: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
    module: "settings",
  },
];