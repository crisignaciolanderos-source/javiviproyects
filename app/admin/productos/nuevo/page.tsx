"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Topbar from "@/components/layout/topbar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { createProduct } from "@/lib/admin-store";
import type { Category, Condition } from "@/types";

export default function NuevoProductoPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<Category>("ropa");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState<Condition>("usado");
  const [stock, setStock] = useState("1");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("El nombre es obligatorio."); return; }
    const priceNum = parseInt(price, 10);
    if (isNaN(priceNum) || priceNum <= 0) { setError("Precio inválido."); return; }
    const stockNum = parseInt(stock, 10);
    if (isNaN(stockNum) || stockNum < 0) { setError("Stock inválido."); return; }
    createProduct({
      name: name.trim(),
      description: description.trim(),
      price: priceNum,
      category,
      size: category === "ropa" ? (size.trim() || undefined) : undefined,
      condition: category === "ropa" ? condition : undefined,
      images: images.length ? images : ["https://picsum.photos/seed/" + Date.now() + "/600/750"],
      stock: stockNum,
      sold: false,
      active: true,
    });
    router.push("/admin/productos");
  }

  return (
    <>
      <Topbar />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-[760px] px-4 md:px-8 py-10">
          <Link href="/admin/productos" className="text-[0.75rem] text-muted hover:text-ink">← Volver</Link>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight lowercase mt-4 mb-6">nuevo producto</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Field label="Nombre">
              <input value={name} onChange={(e) => setName(e.target.value)} className="input" required />
            </Field>
            <Field label="Descripción">
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input min-h-[90px]" />
            </Field>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Precio (CLP)">
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input" required />
              </Field>
              <Field label="Categoría">
                <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="input">
                  <option value="ropa">Ropa</option>
                  <option value="cosmetica">Cosmética</option>
                </select>
              </Field>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {category === "ropa" && (
                <Field label="Talla / Tamaño">
                  <input value={size} onChange={(e) => setSize(e.target.value)} className="input" placeholder="M, 30 ml..." />
                </Field>
              )}
              {category === "ropa" && (
                <Field label="Estado">
                  <select value={condition} onChange={(e) => setCondition(e.target.value as Condition)} className="input">
                    <option value="usado">Usado</option>
                    <option value="nuevo">Nuevo</option>
                  </select>
                </Field>
              )}
              <Field label="Stock">
                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="input" min="0" />
              </Field>
            </div>
            <Field label="Fotos">
              <input type="file" accept="image/*" multiple onChange={handleFiles} className="text-[0.8125rem]" />
              {images.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {images.map((src, i) => (
                    <img key={i} src={src} alt="" className="w-20 h-24 object-cover rounded border border-line" />
                  ))}
                </div>
              )}
            </Field>
            {error && <p className="text-red text-[0.8125rem]">{error}</p>}
            <div className="flex gap-3">
              <button type="submit" className="bg-ink text-white font-bold uppercase text-[0.875rem] tracking-[0.04em] px-6 py-3 rounded-lg hover:bg-rose transition">
                Guardar
              </button>
              <Link href="/admin/productos" className="border border-line-2 text-ink font-bold uppercase text-[0.875rem] tracking-[0.04em] px-6 py-3 rounded-lg hover:bg-gray transition">
                Cancelar
              </Link>
            </div>
          </form>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">{label}</label>
      {children}
    </div>
  );
}