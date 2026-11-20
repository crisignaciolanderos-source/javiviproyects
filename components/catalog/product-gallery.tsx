"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-line bg-gradient-to-br from-pink-soft to-pink-bg">
        <Image src="https://picsum.photos/600/750" alt={alt} fill priority sizes="(max-width:768px) 100vw, 55vw" className="object-cover" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-line bg-gradient-to-br from-pink-soft to-pink-bg">
        <Image
          src={images[current]}
          alt={alt}
          fill
          priority
          sizes="(max-width:768px) 100vw, 55vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2.5 justify-center mt-3.5 flex-wrap">
          {images.map((_, k) => (
            <button
              key={k}
              onClick={() => setCurrent(k)}
              className={`w-2.5 h-2.5 rounded-full transition ${k === current ? "bg-ink scale-125" : "bg-line-2 hover:bg-muted"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}