import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { formatCLP } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

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

export default function ProductCard({ product }: { product: Product }) {
  const sold = product.sold || product.stock <= 0;
  return (
    <article className="group">
      <Link href={`/producto/${product.id}`} className="block">
        <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-line bg-gradient-to-br from-pink-soft to-pink-bg">
          <Image
            src={product.images?.[0] || "https://picsum.photos/600/750"}
            alt={product.name}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {sold && (
            <span className="absolute top-3 left-3 bg-[#2a2a4a] text-white text-[0.625rem] font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded">
              Vendido
            </span>
          )}
          {product.condition === "usado" && !sold && (
            <span className="absolute top-3 left-3 bg-rose text-white text-[0.625rem] font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded">
              Usado
            </span>
          )}
        </div>
      </Link>
      <div className="pt-3 flex flex-col gap-1">
        <Link href={`/producto/${product.id}`} className="text-[0.9375rem] font-semibold leading-tight hover:underline">
          {product.name}
        </Link>
        {product.category === "ropa" && product.size && <span className="text-[0.75rem] text-muted">{product.size}</span>}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1.5 mt-1.5">
            {product.colors.map((c) => (
              <span
                key={c}
                className="w-4 h-4 rounded-full border border-line-2"
                style={{ backgroundColor: COLOR_HEX[c] || "#ccc" }}
                title={c}
              />
            ))}
          </div>
        )}
        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            {product.original_price && product.original_price > product.price && (
              <span className="text-[0.8125rem] text-muted line-through">{formatCLP(product.original_price)}</span>
            )}
            <span className={`text-[1.05rem] font-extrabold ${product.original_price && product.original_price > product.price ? "text-red" : ""}`}>
              {formatCLP(product.price)}
            </span>
          </div>
          {!sold && (
            <a
              href={whatsappLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] bg-[#2a2a4a] text-white px-3 py-1.5 rounded hover:bg-rose transition"
            >
              Comprar
            </a>
          )}
        </div>
      </div>
    </article>
  );
}