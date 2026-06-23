import "bootstrap/dist/css/bootstrap.min.css";
import Preloader from "@/components/site/Preloader";
import { ToastProvider } from "@/components/ui/Toast provider"; // thêm dòng này
import { Suspense } from "react";
import "@/styles/site.css";
import "@/styles/animate.min.css";
import "@/styles/header.css";
import "@/styles/ClientCarousel.css";
import "@/styles/services.css";
import "@/styles/floens.css";
import "@/styles/icon.css";
import "@/styles/gioithieu.css";
import "@/styles/footer.css";
import "@/styles/title.css";
import "@/styles/scroll-reveal.css";
import "@/globals.css";
import "@/styles/lienhe.css";
import "@/styles/sanpham.css";

import ScrollTopProgress from "@/components/site/ScrollTopProgress";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Preloader />
        <ToastProvider>   {/* bọc children */}
          {children}
        </ToastProvider>
        <ScrollTopProgress />
      </body>
    </html>
  );
}