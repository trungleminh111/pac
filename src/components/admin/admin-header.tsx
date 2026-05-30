import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Nhớ đổi đúng đường dẫn authOptions của bạn nhé
import { redirect } from "next/navigation";

// Server Action xử lý Đăng xuất ngay trong file
async function logoutAction() {
  "use server";
  
  // Khi dùng NextAuth, ta không xóa cookie thủ công nữa 
  // Cách nhanh nhất ở Server Side là ép chuyển hướng về route xử lý signout của NextAuth
  // Nó sẽ tự động dọn sạch session và cookie cho bạn.
  redirect("/api/auth/signout?callbackUrl=/login");
}

export async function AdminHeader() {
  
  const session = await getServerSession(/* authOptions */); 

  
  const name = session?.user?.name || "Admin2";
  const email = session?.user?.email || "admin@phucnam2.vn";
  const avatar = name.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur">
      <div>
        <h1 className="text-lg font-semibold text-slate-950">
          Quản trị hệ thống
        </h1>
        <p className="text-xs text-slate-500">
          Quản lý nội dung website P.A.C STONE
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-medium text-slate-900">{name}</div>
          <div className="text-xs text-slate-500">{email}</div>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2271b1] text-sm font-bold text-white">
          {avatar}
        </div>

        {/* Form gọi Server Action khi bấm nút */}
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Đăng xuất
          </button>
        </form>
      </div>
    </header>
  );
}