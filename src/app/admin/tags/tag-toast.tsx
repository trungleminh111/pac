"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  success?: string;
  error?: string;
};

export function TagToast({ success, error }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const message = error || success || "";
  const type = error ? "error" : "success";

  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    if (!message) return;

    setVisible(true);

    const timer = window.setTimeout(() => {
      setVisible(false);

      window.setTimeout(() => {
        router.replace(pathname, {
          scroll: false,
        });
      }, 250);
    }, 4500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [message, pathname, router]);

  if (!message || !visible) return null;

  return (
    <div className="fixed right-5 top-5 z-[9999] w-[calc(100vw-40px)] max-w-md">
      <div
        className={`rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${
          type === "error"
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-emerald-200 bg-emerald-50 text-emerald-700"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {type === "error" ? "!" : "✓"}
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">
              {type === "error" ? "Không thể thực hiện" : "Thành công"}
            </div>

            <div className="mt-0.5 text-sm leading-5">{message}</div>
          </div>

          <button
            type="button"
            onClick={() => {
              setVisible(false);

              window.setTimeout(() => {
                router.replace(pathname, {
                  scroll: false,
                });
              }, 250);
            }}
            className="shrink-0 rounded-lg px-2 py-1 text-sm font-bold opacity-70 hover:bg-black/5 hover:opacity-100"
            aria-label="Đóng thông báo"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}