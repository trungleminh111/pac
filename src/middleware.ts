import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    const isAdminPath = pathname.startsWith("/admin");
    const isLoginPath = pathname.startsWith("/login");
    const isProfilePath = pathname.includes("/profile");

    // Đã đăng nhập, vào /login → redirect theo role
    if (isLoginPath && token) {
      if (token.role === "USER") {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Vào /admin mà là USER → về /
    if (isAdminPath && token?.role === "USER") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Vào /profile mà chưa đăng nhập → về /login
    if (isProfilePath && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/:locale/profile/:path*", // có locale (vi/en)
    "/profile/:path*",          // không có locale
  ],
};