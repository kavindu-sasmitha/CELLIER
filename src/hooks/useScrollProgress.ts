"use client";

import { useEffect, useState, RefObject } from "react";

export interface ScrollProgressData {
  progress: number;
  isInView: boolean;
}

export function useScrollProgress(ref: RefObject<HTMLElement | null>): ScrollProgressData {
  const [data, setData] = useState<ScrollProgressData>({ progress: 0, isInView: false });

  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollableDistance = rect.height - windowHeight;

      const isInView = rect.bottom > 0 && rect.top < windowHeight;

      if (scrollableDistance <= 0) {
        setData({ progress: 0, isInView });
        return;
      }

      // 0 when top is at top of screen, 1 when bottom is at bottom of screen
      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);

      setData({ progress, isInView });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [ref]);

  return data;
}

