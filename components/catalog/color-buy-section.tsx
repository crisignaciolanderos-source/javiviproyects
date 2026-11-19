"use client";

import { useState } from "react";
import { formatCLP } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import type { Product } from "@/types";

const COLOR_HEX: Record<string, string> = {
  "Negro": "#000000",
  "Blanco": "#FFFFFF",
  "Rojo": "#EF4444",
  "Azul": "#3B82F6",
  "Verde": "#22C55E",
  "Amarillo": "#EAB308",
  "Naranja": "#F97316",
  "Rosa": "#EC4899",
  "Morado": "#8B5CF6",
  "Gris": "#6B7280",
  "Beige": "#D4B896",
  "Marrón": "#78350F",
};

export default function ColorBuySection({ product }: { product: Product }) {
  const colors = product.colors || [];
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const sold = product.sold || product.stock <= 0;

  const hasColors = colors.length > 0;
  const canBuy = !sold && (!hasColors || selectedColor !== null);

  function handleBuy() {
    if (hasColors && !selectedColor) {
      alert("Por favor selecciona un color antes de comprar.");
      return;
    }
    const url = whatsappLink(product, selectedColor);
    window.open(url, "_blank");
  }

  return (
    <div>
      {hasColors && (
        <div className="mb-4">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted mb-2">
            Color {selectedColor ? `— ${selectedColor}` : "(obligatorio)"}
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`w-9 h-9 rounded-full border-2 transition ${selectedColor === c ? "border-ink scale-110 ring-2 ring-ink/30" : "border-line-2"}`}
                style={{ backgroundColor: COLOR_HEX[c] || "#ccc" }}
                title={c}
              />
            ))}
          </div>
          {hasColors && !selectedColor && (
            <p className="text-[0.7rem] text-red mt-2">Selecciona un color para continuar.</p>
          )}
        </div>
      )}

      {sold ? (
        <div className="bg-gray border border-line rounded-lg p-4 text-center">
          <p className="font-bold text-ink">Este producto ya fue vendido</p>
          <p className="text-[0.8125rem] text-muted mt-1">Escríbenos por WhatsApp para opciones similares.</p>
        </div>
      ) : (
        <button
          onClick={handleBuy}
          disabled={!canBuy}
          className={`block w-full text-center font-bold uppercase text-[0.9375rem] tracking-[0.04em] px-6 py-4 rounded-lg min-h-[56px] transition ${
            canBuy
              ? "bg-ink text-white hover:bg-rose cursor-pointer"
              : "bg-gray text-muted cursor-not-allowed"
          }`}
        >
          Comprar por WhatsApp
        </button>
      )}
    </div>
  );
}