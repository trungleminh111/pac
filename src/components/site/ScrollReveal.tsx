"use client";

import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  animationClass?: "fade-in-up" | "fade-in-left" | "fade-in-right";
  delay?: string;
  isFirstFold?: boolean; // THÊM THUỘC TÍNH NÀY: Dành cho các phần tử ở ngay đầu trang khi vừa load
}

export default function ScrollReveal({ 
  children, 
  animationClass = "fade-in-up", 
  delay = "0s",
  isFirstFold = false // Mặc định là false
}: ScrollRevealProps) {
  
  const { ref, inView } = useInView({
    triggerOnce: true, // Kích hoạt 1 lần duy nhất
    threshold: 0,      // ĐỔI THÀNH 0: Vừa chạm mép màn hình là hiện ngay, không cần cuộn sâu vào trong
    rootMargin: "100px 0px 100px 0px", // Đón đầu trước 100px khi phần tử sắp sửa lọt vào màn hình
  });

  // Nếu là phần tử ở đầu trang (First Fold), cho hiện ngay lập tức (inView luôn đúng)
  const shouldVisible = isFirstFold ? true : inView;

  return (
    <div
      ref={ref}
      className={`reveal-base ${animationClass} ${shouldVisible ? "is-visible" : ""}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}