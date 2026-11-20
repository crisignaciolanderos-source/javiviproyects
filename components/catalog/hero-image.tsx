"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getHeroImage } from "@/lib/admin-store";

const DEFAULT_HERO = "https://picsum.photos/seed/herojavivi/700/875";

export default function HeroImage() {
  const [src, setSrc] = useState(DEFAULT_HERO);

  useEffect(() => {
    async function load() {
      const img = await getHeroImage();
      if (img) setSrc(img);
    }
    load();
  }, []);

  return (
    <Image
      src={src}
      alt="JAVIVI"
      fill
      priority
      sizes="(max-width:768px) 100vw, 50vw"
      className="object-cover"
    />
  );
}