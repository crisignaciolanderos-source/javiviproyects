"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getCategoryImages, setCategoryImage, getHeroImage, setHeroImage } from "@/lib/admin-store";

export default function CategoriasPage() {
  const [cosmeticaImg, setCosmeticaImg] = useState("");
  const [ropaImg, setRopaImg] = useState("");
  const [previewCos, setPreviewCos] = useState("");
  const [previewRopa, setPreviewRopa] = useState("");
  const [heroImg, setHeroImg] = useState("");
  const [previewHero, setPreviewHero] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function load() {
      const imgs = await getCategoryImages();
      const cos = imgs.find((i) => i.category === "cosmetica");
      const rop = imgs.find((i) => i.category === "ropa");
      if (cos) { setCosmeticaImg(cos.imageUrl); setPreviewCos(cos.imageUrl); }
      if (rop) { setRopaImg(rop.imageUrl); setPreviewRopa(rop.imageUrl); }
      const hero = await getHeroImage();
      if (hero) { setHeroImg(hero); setPreviewHero(hero); }
    }
    load();
  }, []);

  function handleFile(category: "cosmetica" | "ropa", e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        if (category === "cosmetica") { setCosmeticaImg(reader.result); setPreviewCos(reader.result); }
        else { setRopaImg(reader.result); setPreviewRopa(reader.result); }
      }
    };
    reader.readAsDataURL(file);
  }

  async function saveImage(category: "cosmetica" | "ropa") {
    const url = category === "cosmetica" ? cosmeticaImg : ropaImg;
    if (!url.trim()) { setMsg("Ingresa una URL o sube una imagen."); return; }
    await setCategoryImage(category, url.trim());
    setMsg("✓ Imagen guardada.");
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-[1440px] px-4 md:px-8 py-10">
          <Link href="/admin/dashboard" className="text-[0.75rem] text-muted hover:text-ink">← Dashboard</Link>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-4 mb-6">Imágenes de categorías</h1>
          <p className="text-muted text-[0.875rem] mb-8">
            Cambia las fotos que aparecen en las tarjetas de categoría de la página principal.
          </p>

          {/* Imagen del Hero */}
          <div className="bg-gray border border-line rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">Imagen principal (Hero)</h2>
            {previewHero && (
              <img src={previewHero} alt="Hero" className="w-full h-48 object-cover rounded border border-line mb-4" />
            )}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted block mb-1">URL de imagen</label>
                <input
                  type="text"
                  value={heroImg}
                  onChange={(e) => { setHeroImg(e.target.value); setPreviewHero(e.target.value); }}
                  placeholder="https://ejemplo.com/foto.jpg"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted block mb-1">O subir archivo</label>
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === "string") { setHeroImg(reader.result); setPreviewHero(reader.result); }
                  };
                  reader.readAsDataURL(file);
                }} className="text-[0.8125rem]" />
              </div>
              <button
                onClick={async () => {
                  if (!heroImg.trim()) { setMsg("Ingresa una URL o sube una imagen."); return; }
                  await setHeroImage(heroImg.trim());
                  setMsg("✓ Imagen del hero guardada.");
                }}
                className="bg-ink text-white font-bold uppercase text-[0.75rem] tracking-[0.12em] px-4 py-2.5 rounded-lg hover:bg-rose transition w-fit"
              >
                Guardar imagen del hero
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Cosmética */}
            <div className="bg-gray border border-line rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4">Cosmética</h2>
              {previewCos && (
                <img src={previewCos} alt="Cosmética" className="w-full h-48 object-cover rounded border border-line mb-4" />
              )}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted block mb-1">URL de imagen</label>
                  <input
                    type="text"
                    value={cosmeticaImg}
                    onChange={(e) => { setCosmeticaImg(e.target.value); setPreviewCos(e.target.value); }}
                    placeholder="https://ejemplo.com/foto.jpg"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted block mb-1">O subir archivo</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFile("cosmetica", e)} className="text-[0.8125rem]" />
                </div>
                <button
                  onClick={() => saveImage("cosmetica")}
                  className="bg-ink text-white font-bold uppercase text-[0.75rem] tracking-[0.12em] px-4 py-2.5 rounded-lg hover:bg-rose transition w-fit"
                >
                  Guardar imagen
                </button>
              </div>
            </div>

            {/* Ropa */}
            <div className="bg-gray border border-line rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4">Ropa Usada</h2>
              {previewRopa && (
                <img src={previewRopa} alt="Ropa" className="w-full h-48 object-cover rounded border border-line mb-4" />
              )}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted block mb-1">URL de imagen</label>
                  <input
                    type="text"
                    value={ropaImg}
                    onChange={(e) => { setRopaImg(e.target.value); setPreviewRopa(e.target.value); }}
                    placeholder="https://ejemplo.com/foto.jpg"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted block mb-1">O subir archivo</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFile("ropa", e)} className="text-[0.8125rem]" />
                </div>
                <button
                  onClick={() => saveImage("ropa")}
                  className="bg-ink text-white font-bold uppercase text-[0.75rem] tracking-[0.12em] px-4 py-2.5 rounded-lg hover:bg-rose transition w-fit"
                >
                  Guardar imagen
                </button>
              </div>
            </div>
          </div>
          {msg && <p className="text-[0.8125rem] font-semibold text-green mt-4">{msg}</p>}
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