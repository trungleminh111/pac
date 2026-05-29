"use client";

import { useEffect, useState } from "react";

export default function ScrollTopProgress() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const percent = (scrollTop / docHeight) * 100;

      setScrollPercent(percent);

      setShow(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
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
    <button className="scroll-progress-btn" onClick={scrollToTop}>
      <div className="scroll-progress-line">
        <div
          className="scroll-progress-fill"
          style={{
            height: `${scrollPercent}%`,
          }}
        />
      </div>

      <span>VỀ ĐẦU TRANG</span>
    </button>
  );
}