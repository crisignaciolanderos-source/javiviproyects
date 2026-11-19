"use client";

import Link from "next/link";

const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "56XXXXXXXXX";
const WHATSAPP_URL = `https://wa.me/${NUMBER}?text=${encodeURIComponent("Hola JAVIVI! Me gustaría hacer una consulta sobre sus productos.")}`;

export default function WhatsAppFloat() {
  return (
    <Link
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[30px] right-[30px] z-[100] bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,.25)] hover:bg-green-700 transition-all hover:scale-105"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M17 1c-4.97 0-9 4.03-9 9 0 3.24 1.78 6.04 4.46 7.54-2.37-.25-4.4-2.05-4.4-4.24 0-.46.03-.89.08-1.32-.1-.27-.15-.55-.15-.83 0-.28.11-.54.26.72.42 1.37 1.29 3.05 2.62 4.05.33-.15.7-.22 1.07-.23 0-.04.01-.07.01-.11.02-.15.05-.31.05-.47 0-.5-.09-.99-.27-1.47.63 1.2 1.84 2.22 3.22 2.53-.19.2-.39.39-.59.6-.12.08-.27.14-.41.2-.57.23-1.01.44-1.48.64 0 0-.42-1.29-1.4 3.82-1.32.47-2.73.73-4.14.75-.35-.22-.69-.42-1.03-.63-1.37.79-2.34 2.43-2.34 4.05 0 .33.04.65.07.98-.15.49-.23.98-.23 1.48 0 2.8 1.47 5.09 3.55 5.6.27.13.55.2.82.2 1.37 0 2.47-1.07 2.8-2.54-.11-.96-.22-1.93-.22-2.92 0-3.27 2.23-5.92 5-5.92.34 0 .68.02 1 .05 1.84-.52 3.25-2.33 3.25-4.7 0-3.27-2.34-5.93-5.31-5.93z" />
      </svg>
    </Link>
  );
}