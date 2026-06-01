"use client";

import { useEffect, useState } from "react";

export default function ScrollTopProgress() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

      const scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );

      const clientHeight = window.innerHeight;

      const docHeight = scrollHeight - clientHeight;

      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setScrollPercent(Math.min(100, Math.max(0, percent)));
      setShow(scrollTop > 50);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!show) return null;

  return (
    <button type="button" className="scroll-progress-btn" onClick={scrollToTop}>
      <div className="scroll-progress-line">
        <div
          className="scroll-progress-fill"
          style={{ height: `${scrollPercent}%` }}
        />
      </div>

      <span>VỀ ĐẦU TRANG</span>
    </button>
  );
}