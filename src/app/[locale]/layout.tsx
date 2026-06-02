import type { Metadata } from "next";

import "bootstrap/dist/css/bootstrap.min.css";


import "./globals.css";
import "@/styles/site.css";
import "@/styles/header.css";
import "@/styles/ClientCarousel.css";
import "@/styles/services.css";
import "@/styles/floens.css";
import "@/styles/icon.css";
import "@/styles/gioithieu.css";
import "@/styles/footer.css";
import "@/styles/title.css";
import ErudaDebug from "@/components/ErudaDebug";
import ScrollTopProgress from "@/components/site/ScrollTopProgress";

export const metadata: Metadata = {
  title: "P.A.C STONE",
  description: "Nhà cung cấp giải pháp thiết kế, thi công đá ốp lát cao cấp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        {/* XÓA SAU KHI DEBUG */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.onload = function() {
                var s = document.createElement('script');
                s.src = 'https://cdn.jsdelivr.net/npm/eruda@3.0.1/eruda.js';
                document.body.appendChild(s);
                s.onload = function() { eruda.init(); }
              }
            `
          }}
        />
      </head>
      <body>
        {children}
        <ScrollTopProgress />
        <ErudaDebug />
      </body>
    </html>
  );
}