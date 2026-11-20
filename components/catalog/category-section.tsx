"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategoryImages } from "@/lib/admin-store";

const DEFAULT_COS = "https://picsum.photos/seed/catcos/800/600";
const DEFAULT_ROP = "https://picsum.photos/seed/catrop/800/600";

export default function CategorySection() {
  const [cosImg, setCosImg] = useState(DEFAULT_COS);
  const [ropImg, setRopImg] = useState(DEFAULT_ROP);

  useEffect(() => {
    async function load() {
      const imgs = await getCategoryImages();
      const cos = imgs.find((i) => i.category === "cosmetica");
      const rop = imgs.find((i) => i.category === "ropa");
      if (cos) setCosImg(cos.imageUrl);
      if (rop) setRopImg(rop.imageUrl);
    }
    load();
  }, []);

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto max-w-[1440px] px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6 lowercase">explora por categoría</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/cosmetica" className="group relative overflow-hidden rounded-2xl border border-line aspect-[16/9] md:aspect-[4/3]">
            <Image src={cosImg} alt="Cosmética" fill className="object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] mb-1">Cuidado de la piel</p>
              <h3 className="text-2xl font-extrabold uppercase">Cosmetic</h3>
            </div>
          </Link>
          <Link href="/ropa" className="group relative overflow-hidden rounded-2xl border border-line aspect-[16/9] md:aspect-[4/3]">
            <Image src={ropImg} alt="Ropa" fill className="object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] mb-1">Prendas únicas</p>
              <h3 className="text-2xl font-extrabold uppercase">Ropa Usada</h3>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}