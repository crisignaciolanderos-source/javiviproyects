"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPromotions } from "@/lib/admin-store";
import type { Promotion } from "@/types";

export default function PromoCarousel() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStartRef = useRef(0);
  const dragCurrentRef = useRef(0);

  useEffect(() => {
    async function load() {
      try {
        const { getPromotions } = await import("@/lib/admin-store");
        const promos = await getPromotions();
        setPromotions(promos);
      } catch {}
    }
    load();
    const t = setInterval(() => setCurrent((c) => (c + 1) % (promotions.length || 1)), 5000);
    return () => clearInterval(t);
  }, [promotions]);

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    dragStartRef.current = e.clientX;
    dragCurrentRef.current = current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartRef.current;
    const threshold = 50;
    if (Math.abs(dx) > threshold) {
      if (dx > 0) {
        setCurrent((c) => (c === 0 ? promotions.length - 1 : c - 1));
      } else {
        setCurrent((c) => (c === promotions.length - 1 ? 0 : c + 1));
      }
      dragStartRef.current = e.clientX;
    }
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  if (promotions.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[var(--white)]">
      <div
        className="relative h-[300px] md:h-[400px] lg:h-[450px] cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          className="relative h-full flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {promotions.map((promo, i) => {
            const link = promo.productId ? `/producto/${promo.productId}` : undefined;
            return (
              <div
                key={i}
                className="min-w-full flex-shrink-0 h-full flex items-center justify-center bg-[var(--pink-soft)]"
              >
                {link ? (
                  <Link href={link} className="block w-full h-full" draggable={false}>
                    <Image
                      src={promo.imageUrl}
                      alt={`Promoción ${i + 1}`}
                      fill
                      sizes="(max-width:768px) 100vw, 80vw"
                      className="object-contain w-full h-full cursor-pointer"
                      loading="lazy"
                      draggable={false}
                    />
                  </Link>
                ) : (
                  <Image
                    src={promo.imageUrl}
                    alt={`Promoción ${i + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain w-full h-full"
                    loading="lazy"
                    draggable={false}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Dots de navegación */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {promotions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === current ? "bg-[#2a2a4a] w-6" : "bg-line-2 hover:bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}