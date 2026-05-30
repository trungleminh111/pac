import type { Metadata } from "next";


import "../[locale]/globals.css";




export const metadata = {
  title: "Đăng nhập",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}