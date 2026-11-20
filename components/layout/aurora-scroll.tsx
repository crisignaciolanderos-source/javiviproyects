"use client";

import { useEffect } from "react";

export default function AuroraScroll() {
  useEffect(() => {
    const blob1 = document.getElementById("aurora-blob-1");
    const blob2 = document.getElementById("aurora-blob-2");
    if (!blob1 || !blob2) return;

    function onScroll() {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

      // Mover blobs basado en scroll
      blob1!.style.transform = `translate(-50%, ${-50 + progress * 30}%) scale(${1 + progress * 0.2})`;
      blob2!.style.transform = `translate(${progress * 20}%, ${-progress * 10}%) scale(${1 + progress * 0.15})`;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}