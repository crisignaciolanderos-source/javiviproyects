"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { formatCLP } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

export default function FeaturedCard({ product }: { product: Product }) {
  return (
    <div className="featured-wrapper">
      <svg style={{ width: 0, height: 0, position: "absolute" }} aria-hidden="true">
        <filter id="noise">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.9"
            numOctaves="2"
            seed="1"
            stitchTiles="stitch"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="30"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <Link href={`/producto/${product.id}`} className="block">
        <div className="featured-card">
          <div className="featured-image">
            <Image
              src={product.images?.[0] || "https://picsum.photos/600/750"}
              alt={product.name}
              fill
              sizes="(max-width:768px) 100vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="featured-title">{product.name}</div>
          <div className="featured-desc">
            {formatCLP(product.price)}
            <br />
            {product.category === "ropa" ? "Ropa Usada" : "Cosmetic"}
          </div>
        </div>
      </Link>
      <a
        href={whatsappLink(product)}
        target="_blank"
        rel="noopener noreferrer"
        className="featured-buy"
      >
        Comprar
      </a>
    </div>
  );
}