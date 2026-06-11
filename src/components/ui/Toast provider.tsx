"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from "react-icons/fi";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue>({
  showToast: () => { },
});

export function useToast() {
  return useContext(ToastContext);
}

// ─── Single Toast ─────────────────────────────────────────────────────────────

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <FiCheckCircle size={20} />,
  error: <FiXCircle size={20} />,
  info: <FiInfo size={20} />,
};

const COLORS: Record<ToastType, string> = {
  success: "#00a884",
  error: "#ee4d2d",
  info: "#1677ff",
};

function Toast({
  item,
  onRemove,
}: {
  item: ToastItem;
  onRemove: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setVisible(false);

    removeTimerRef.current = setTimeout(() => {
      onRemove(item.id);
    }, 300);
  }, [item.id, onRemove]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setVisible(true);
    });

    timerRef.current = setTimeout(() => {
      dismiss();
    }, 3000);

    return () => {
      cancelAnimationFrame(raf);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (removeTimerRef.current) {
        clearTimeout(removeTimerRef.current);
      }
    };
  }, [dismiss]);

  return (
    <div
      onClick={dismiss}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        minWidth: 280,
        maxWidth: 360,
        background: "#fff",
        borderRadius: 6,
        boxShadow: "0 4px 20px rgba(0,0,0,0.14)",
        padding: "14px 16px",
        cursor: "pointer",
        borderLeft: `4px solid ${COLORS[item.type]}`,
        transform: visible ? "translateX(0)" : "translateX(110%)",
        opacity: visible ? 1 : 0,
        transition:
          "transform 0.3s cubic-bezier(.22,1,.36,1), opacity 0.3s ease",
      }}
    >
      <span
        style={{
          color: COLORS[item.type],
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        {ICONS[item.type]}
      </span>

      <span
        style={{
          flex: 1,
          fontSize: 14,
          color: "#333",
          lineHeight: 1.5,
        }}
      >
        {item.message}
      </span>

      <span
        style={{
          color: "#aaa",
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        <FiX size={16} />
      </span>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {mounted &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 24,
              right: 24,
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              alignItems: "flex-end",
              pointerEvents: "none",
            }}
          >
            {toasts.map((toast) => (
              <div key={toast.id} style={{ pointerEvents: "auto" }}>
                <Toast item={toast} onRemove={removeToast} />
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}