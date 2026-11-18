"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getPromotions } from "@/lib/admin-store";

export default function PromoCarousel() {
  const [promotions, setPromotions] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Leer promociones del admin-store (mock/Supabase)
    const stored = localStorage.getItem("javivi_promotions");
    if (stored) {
      try {
        setPromotions(JSON.parse(stored));
      } catch {}
    }
    // Auto-play cada 5 segundos
    const t = setInterval(() => setCurrent((c) => (c + 1) % (promotions.length || 1)), 5000);
    return () => clearInterval(t);
  }, [promotions]);

  if (promotions.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative h-[500px] md:h-[600px]">
        {/* Diapositivas */}
        <div className="relative h-full flex transition-transform duration-700 ease-in-out -translate-x-[{current * 100}%]">
          {promotions.map((src, i) => (
            <div
              key={i}
              className="min-w-full flex-shrink-0 h-full flex items-center justify-center"
            >
              <Image
                src={src}
                alt={`Promoción ${i + 1}`}
                fill
                sizes="100vw"
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Flechas de navegación */}
        <button
          onClick={() => setCurrent((c) => (c === 0 ? promotions.length - 1 : c - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-ink text-white px-6 py-3 rounded-lg font-bold hover:bg-rose transition z-20 hover:shadow-lg"
        >
          〈
        </button>
        <button
          onClick={() => setCurrent((c) => (c === promotions.length - 1 ? 0 : c + 1))}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-ink text-white px-6 py-3 rounded-lg font-bold hover:bg-rose transition z-20 hover:shadow-lg"
        >
          〉
        </button>

        {/* Dots de navegación */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {promotions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === current ? "bg-ink w-6" : "bg-line-2 hover:bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}