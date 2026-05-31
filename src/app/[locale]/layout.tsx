import type { Metadata } from "next";

import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import "@/styles/site.css";
import "@/styles/floens.css";
import "@/styles/icon.css";
import "@/styles/gioithieu.css";
import "@/styles/footer.css";
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
      <body>{children}

       <ScrollTopProgress />
      </body>
    </html>
  );
}