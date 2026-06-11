"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/server/cart/cart.action";
import { useToast } from "@/components/ui/Toast provider";

type CheckoutOrderButtonProps = {
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export function CheckoutOrderButton({
  disabled,
  children,
  className,
}: CheckoutOrderButtonProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.form;

    if (!form) {
      showToast("error", "Không tìm thấy biểu mẫu thanh toán.");
      return;
    }

    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createOrder(formData);

      showToast(result.ok ? "success" : "error", result.message);

      if (result.redirectTo) {
        router.push(result.redirectTo);
      }
    });
  }

  return (
    <button
      type="button"
      className={className}
      disabled={disabled || isPending}
      onClick={handleClick}
      style={{ opacity: disabled || isPending ? 0.6 : 1 }}
    >
      {isPending ? "Đang đặt hàng..." : children || "Đặt hàng"}
    </button>
  );
}