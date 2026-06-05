"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Route change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="preloader" style={{ display: loading ? "flex" : "none" }}>
      <div
        className="preloader__image"
        style={{ backgroundImage: "url(/assets/images/logo-PACSTONE.webp)" }}
      />
    </div>
  );
}