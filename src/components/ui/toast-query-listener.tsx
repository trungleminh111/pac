"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "./toast-provider";

export function ToastQueryListener() {
  const { showToast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const toast = searchParams.get("toast");

    if (!toast) return;

    if (toast === "add-cart-success") {
      showToast("success", "Đã thêm sản phẩm vào giỏ hàng.");
    }
    if (toast === "checkout-empty") {
  showToast("error", "Vui lòng chọn sản phẩm để thanh toán.");
}

if (toast === "address-required") {
  showToast("error", "Vui lòng thêm địa chỉ nhận hàng.");
}

    if (toast === "checkout-success") {
      showToast("success", "Đặt hàng thành công.");
    }

    if (toast === "login-required") {
      showToast("error", "Vui lòng đăng nhập để tiếp tục.");
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("toast");

    const nextUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(nextUrl);
  }, [searchParams, pathname, router, showToast]);

  return null;
}