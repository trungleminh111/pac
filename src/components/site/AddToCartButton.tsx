"use client";

import { useTransition } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { addToCart } from "@/server/cart/add-to-cart.action";
import { useToast } from "@/components/ui/Toast provider";

export function AddToCartButton({ productId }: { productId: string }) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await addToCart(productId);
      showToast(result.ok ? "success" : "error", result.message);
    });
  }

  return (
    <button
      type="button"
      aria-label="Add to cart"
      disabled={isPending}
      onClick={handleClick}
      style={{ opacity: isPending ? 0.6 : 1 }}
    >
      <FaCartShopping className="product-cart-icon" />
    </button>
  );
}