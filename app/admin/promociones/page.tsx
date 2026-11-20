"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getPromotions, addPromotion, deletePromotion } from "@/lib/admin-store";
import { getAdminProducts } from "@/lib/admin-store";
import type { Product } from "@/types";

export default function PromocionesPage() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [newImage, setNewImage] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const p = await getPromotions();
      const pr = await getAdminProducts();
      setPromotions([...p]);
      setProducts([...pr]);
    }
    load();
  }, []);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const previews: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") previews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
    setPreviewImages(previews);
  }

  async function addNewPromo() {
    if (!newImage.trim()) { setError("Ingresa una URL de imagen o sube archivos."); return; }
    await addPromotion(newImage.trim(), selectedProductId);
    setNewImage("");
    setSelectedProductId(null);
    setPreviewImages([]);
    const p = await getPromotions();
    setPromotions([...p]);
    setError("");
  }

  async function removePromo(index: number) {
    await deletePromotion(index);
    const p = await getPromotions();
    setPromotions([...p]);
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-[1440px] px-4 md:px-8 py-10">
          <Link href="/admin/dashboard" className="text-[0.75rem] text-muted hover:text-ink">← Dashboard</Link>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-4 mb-6">Promociones (carrusel)</h1>
          <p className="text-muted text-[0.875rem] mb-6">
            Sube las imágenes del carrusel. Puedes vincular cada imagen a un producto: al hacer clic, el cliente irá directo a ese producto.
          </p>

          <div className="bg-[var(--gray)] border border-line rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="flex-1">
                <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted block mb-1">URL de imagen</label>
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://ejemplo.com/foto.jpg"
                  className="input w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted block mb-1">Vincular a producto (opcional)</label>
                <select
                  value={selectedProductId || ""}
                  onChange={(e) => setSelectedProductId(e.target.value || null)}
                  className="input w-full"
                >
                  <option value="">Ninguna (solo imagen)</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category === "ropa" ? "Ropa" : "Cosmetic"}) - ${p.price.toLocaleString("es-CL")}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={addNewPromo}
                className="bg-[#2a2a4a] text-white font-bold uppercase text-[0.75rem] tracking-[0.12em] px-4 py-2.5 rounded-lg hover:bg-rose transition"
              >
                Agregar imagen
              </button>
            </div>
            <div className="mt-4">
              <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted block mb-2">O subir archivos</label>
              <input type="file" accept="image/*" multiple onChange={handleFiles} className="text-[0.8125rem]" />
              {previewImages.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {previewImages.map((src, i) => (
                    <img key={i} src={src} alt="" className="w-24 h-24 object-cover rounded border border-line" />
                  ))}
                </div>
              )}
            </div>
            {error && <p className="text-red text-[0.8125rem] mt-2">{error}</p>}
          </div>

          <h2 className="text-lg font-bold mb-4">Imágenes actuales del carrusel</h2>
          {promotions.length === 0 ? (
            <p className="text-muted text-[0.875rem]">Aún no hay imágenes de promoción.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {promotions.map((promo, i) => (
                <div key={i} className="relative group">
                  <img src={promo.imageUrl} alt="" className="w-full h-48 object-cover rounded border border-line" />
                  {promo.productId && (
                    <span className="absolute top-1 left-1 bg-[#2a2a4a] text-white text-[0.6rem] font-bold px-2 py-0.5 rounded">Producto</span>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = async () => {
                              if (typeof reader.result === "string") {
                                const newPromos = [...promotions];
                                newPromos[i] = { ...newPromos[i], imageUrl: reader.result as string };
                                await deletePromotion(i);
                                await addPromotion(reader.result as string, newPromos[i].productId);
                                const p = await getPromotions();
                                setPromotions([...p]);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      className="bg-blue-500 text-white w-8 h-8 rounded flex items-center justify-center hover:bg-blue-600 transition text-[0.6rem]"
                      title="Reemplazar foto"
                    >
                      ↻
                    </button>
                    <button
                      onClick={() => removePromo(i)}
                      className="bg-[#2a2a4a] text-white w-8 h-8 rounded flex items-center justify-center hover:bg-rose transition text-[0.6rem]"
                      title="Eliminar foto"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <style jsx>{`
        .input {
          margin-top: 0.25rem;
          width: 100%;
          border: 1px solid var(--line-2, #d8d8d8);
          border-radius: 8px;
          padding: 0.625rem 0.75rem;
          font-size: 0.9375rem;
          outline: none;
        }
        .input:focus { border-color: var(--ink, #252b2e); }
      `}</style>
    </>
  );
}