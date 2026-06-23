import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Cho phép proxy ảnh chạy, không bị auth/admin middleware chặn
    if (pathname === "/api/admin/proxy-image") {
      return NextResponse.next();
    }

    const isAdminPath = pathname.startsWith("/admin");
    const isLoginPath = pathname.startsWith("/login");
    const isProfilePath =
      pathname === "/profile" ||
      pathname.startsWith("/profile/") ||
      pathname.includes("/profile");

    // Chưa đăng nhập mà vào /admin -> về /login
    if (isAdminPath && !token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Đã đăng nhập, vào /login -> redirect theo role
    if (isLoginPath && token) {
      if (token.role === "USER") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Vào /admin mà là USER -> về trang chủ
    if (isAdminPath && token?.role === "USER") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Vào /profile mà chưa đăng nhập -> về /login
    if (isProfilePath && !token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/:locale/profile/:path*",
    "/profile/:path*",

    // Chỉ cần nếu muốn middleware biết route này và bỏ qua auth
    "/api/admin/proxy-image",
  ],
};