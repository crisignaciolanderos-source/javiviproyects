"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "✨ Solo online · −30% edición fundadora",
  "🚚 Envío gratis en pedidos a partir de $35.000",
  "🏪 Recogida en tienda siempre gratis",
  "🎀 Regalo de bienvenida en tu primer pedido",
];

export default function Topbar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % MESSAGES.length), 3500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-ink text-white h-9 w-full flex items-center justify-center overflow-hidden" aria-label="Promociones">
      <div className="relative h-9 w-full max-w-[720px]">
        {MESSAGES.map((m, k) => (
          <div
            key={k}
            className={`absolute inset-0 flex items-center justify-center gap-2 text-[0.6875rem] uppercase tracking-[0.16em] font-medium text-center px-3 whitespace-nowrap transition-opacity duration-600 ${
              k === i ? "opacity-100" : "opacity-0"
            }`}
          >
            {m}
          </div>
        ))}
      </div>
    </div>
  );
}