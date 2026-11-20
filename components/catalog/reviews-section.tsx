"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getReviews, addReview } from "@/lib/admin-store";
import type { Review } from "@/types";

export default function ReviewsSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  async function loadReviews() {
    const r = await getReviews(productId);
    setReviews(r);
  }

  useEffect(() => {
    loadReviews();
  }, [productId]);

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) { setMsg("Escribe tu reseña."); return; }
    setSubmitting(true);
    setMsg("");
    try {
      await addReview({
        product_id: productId,
        author_name: name.trim() || "Anónimo",
        text: text.trim(),
        image_url: image || undefined,
      });
      setName("");
      setText("");
      setImage(null);
      setMsg("✓ Reseña publicada. ¡Gracias!");
      await loadReviews();
    } catch {
      setMsg("No se pudo publicar la reseña.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="resenas" className="mt-12 pt-8 border-t border-line">
      <h2 className="text-2xl font-extrabold tracking-tight lowercase mb-6">reseñas</h2>

      {/* Formulario para escribir reseña */}
      <div className="bg-gray border border-line rounded-xl p-6 mb-8">
        <h3 className="text-[0.875rem] font-bold mb-4">Escribe tu reseña</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">Tu nombre (opcional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anónimo"
              className="mt-1 w-full border border-line-2 rounded-lg px-3 py-2.5 text-[0.9375rem] focus:outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">Tu reseña</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="¿Qué te pareció el producto?"
              className="mt-1 w-full border border-line-2 rounded-lg px-3 py-2.5 text-[0.9375rem] focus:outline-none focus:border-ink min-h-[90px]"
              required
            />
          </div>
          <div>
            <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">Foto del producto (opcional)</label>
            <input type="file" accept="image/*" onChange={handleImage} className="text-[0.8125rem] mt-1" />
            {image && (
              <div className="mt-2 relative inline-block">
                <img src={image} alt="preview" className="w-24 h-24 object-cover rounded border border-line" />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-1 right-1 bg-[#2a2a4a] text-white w-5 h-5 rounded flex items-center justify-center text-[0.6rem] hover:bg-rose"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
          {msg && <p className="text-[0.8125rem] font-semibold text-green">{msg}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#2a2a4a] text-white font-bold uppercase text-[0.875rem] tracking-[0.04em] px-6 py-3 rounded-lg hover:bg-rose transition disabled:opacity-60 w-fit"
          >
            {submitting ? "Publicando..." : "Publicar reseña"}
          </button>
        </form>
      </div>

      {/* Lista de reseñas */}
      {reviews.length === 0 ? (
        <p className="text-muted text-[0.875rem]">Aún no hay reseñas. ¡Sé el primero en opinar!</p>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.map((r) => (
            <div key={r.id} className="border border-line rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#2a2a4a] text-white grid place-items-center text-[0.75rem] font-bold">
                  {r.author_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[0.875rem] font-semibold">{r.author_name}</p>
                  <p className="text-[0.7rem] text-muted">{new Date(r.created_at).toLocaleDateString("es-CL")}</p>
                </div>
              </div>
              <p className="text-[0.9375rem] text-ink-2">{r.text}</p>
              {r.image_url && (
                <div className="mt-3">
                  <img src={r.image_url} alt="Foto de reseña" className="w-32 h-32 object-cover rounded border border-line" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}