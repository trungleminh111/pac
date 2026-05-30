import "../[locale]/globals.css";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata = {
  title: {
    default: "P.A.C STONE Admin",
    template: "%s | P.A.C STONE",
  },
  description: "Hệ thống quản trị P.A.C STONE",
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <div className="min-h-screen bg-slate-50">
          <AdminSidebar />

          <div className="pl-64">
            <AdminHeader />

            <main className="p-6">
              {children}
            </main>
          </div>
        </div>

      </body>
    </html>
  );
}