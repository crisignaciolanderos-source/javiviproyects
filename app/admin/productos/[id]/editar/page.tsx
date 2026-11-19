"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getAdminProduct, updateProduct } from "@/lib/admin-store";
import type { Category, Condition, Product } from "@/types";

export default function EditarProductoPage() {
  const params = useParams();
  const id = String(params?.id);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<Category>("ropa");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState<Condition>("usado");
  const [stock, setStock] = useState("1");
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [originalPrice, setOriginalPrice] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [usageInstructions, setUsageInstructions] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const p = await getAdminProduct(id);
      if (p) {
        setProduct(p);
        setName(p.name);
        setDescription(p.description);
        setPrice(String(p.price));
        setCategory(p.category);
        setSize(p.size || "");
        setCondition(p.condition || "usado");
        setStock(String(p.stock));
        setActive(p.active);
        setFeatured(p.featured);
        setOriginalPrice(p.original_price ? String(p.original_price) : "");
        setWhatsappMessage(p.whatsapp_message || "");
        setUsageInstructions(p.usage_instructions || "");
        setColors(p.colors || []);
        setImages(p.images || []);
      }
    }
    load();
  }, [id]);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("El nombre es obligatorio."); return; }
    const priceNum = parseInt(price, 10);
    if (isNaN(priceNum) || priceNum <= 0) { setError("Precio inválido."); return; }
    const stockNum = parseInt(stock, 10);
    if (isNaN(stockNum) || stockNum < 0) { setError("Stock inválido."); return; }
    await updateProduct(id, {
      name: name.trim(),
      description: description.trim(),
      price: priceNum,
      category,
      size: category === "ropa" ? (size.trim() || undefined) : undefined,
      condition: category === "ropa" ? condition : undefined,
      images: images.length ? images : product?.images,
      stock: stockNum,
      active,
      featured,
      original_price: originalPrice ? parseInt(originalPrice, 10) : undefined,
      colors: colors.length ? colors : undefined,
      whatsapp_message: whatsappMessage.trim() || undefined,
      usage_instructions: usageInstructions.trim() || undefined,
    });
    router.push("/admin/productos");
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <p className="text-muted">Producto no encontrado. <Link href="/admin/productos" className="underline">Volver</Link></p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-[760px] px-4 md:px-8 py-10">
          <Link href="/admin/productos" className="text-[0.75rem] text-muted hover:text-ink">← Volver</Link>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-4 mb-6">Editar producto</h1>
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
                  <input value={size} onChange={(e) => setSize(e.target.value)} className="input" />
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
              <Field label="Activo">
                <select value={active ? "1" : "0"} onChange={(e) => setActive(e.target.value === "1")} className="input">
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </Field>
            </div>
            <Field label="Colores disponibles (opcional)">
              <div className="flex flex-wrap gap-2 mt-1">
                {[
                  { name: "Negro", hex: "#000000" },
                  { name: "Blanco", hex: "#FFFFFF" },
                  { name: "Rojo", hex: "#EF4444" },
                  { name: "Azul", hex: "#3B82F6" },
                  { name: "Verde", hex: "#22C55E" },
                  { name: "Amarillo", hex: "#EAB308" },
                  { name: "Naranja", hex: "#F97316" },
                  { name: "Rosa", hex: "#EC4899" },
                  { name: "Morado", hex: "#8B5CF6" },
                  { name: "Gris", hex: "#6B7280" },
                  { name: "Beige", hex: "#D4B896" },
                  { name: "Marrón", hex: "#78350F" },
                ].map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setColors((prev) =>
                        prev.includes(c.name)
                          ? prev.filter((x) => x !== c.name)
                          : [...prev, c.name]
                      );
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition ${colors.includes(c.name) ? "border-ink scale-110" : "border-line-2"}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
              {colors.length > 0 && (
                <p className="text-[0.75rem] text-muted mt-2">Seleccionados: {colors.join(", ")}</p>
              )}
            </Field>
            <Field label="Precio original (CLP, opcional)">
              <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="input" placeholder="39990" />
            </Field>
            <Field label="Mensaje de WhatsApp (opcional)">
              <textarea value={whatsappMessage} onChange={(e) => setWhatsappMessage(e.target.value)} className="input min-h-[70px]" placeholder="Hola JAVIVI! Me interesa este producto..." />
            </Field>
            <Field label="Modo de empleo (opcional)">
              <textarea value={usageInstructions} onChange={(e) => setUsageInstructions(e.target.value)} className="input min-h-[70px]" placeholder="¿Cómo se usa? Aplicar 3 gotas..." />
            </Field>
            <Field label="Fotos actuales">
              <div className="flex gap-2 mt-2 flex-wrap">
                {images.map((src, i) => (
                  <div key={i} className="relative group">
                    <img src={src} alt="" className="w-20 h-24 object-cover rounded border border-line" />
                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
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
                              reader.onload = () => {
                                if (typeof reader.result === "string") {
                                  const newImages = [...images];
                                  newImages[i] = reader.result as string;
                                  setImages(newImages);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          };
                          input.click();
                        }}
                        className="bg-blue-500 text-white w-6 h-6 rounded flex items-center justify-center hover:bg-blue-600 transition text-[0.6rem]"
                        title="Reemplazar foto"
                      >
                        ↻
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImages(images.filter((_, idx) => idx !== i));
                        }}
                        className="bg-ink text-white w-6 h-6 rounded flex items-center justify-center hover:bg-rose transition text-[0.6rem]"
                        title="Eliminar foto"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <input type="file" accept="image/*" multiple onChange={handleFiles} className="text-[0.8125rem] mt-2" />
              <p className="text-[0.7rem] text-muted mt-1">Pasa el mouse sobre una foto para reemplazarla (↻) o eliminarla (✕)</p>
            </Field>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border border-line-2 text-ink focus:ring-0"
              />
              <label className="text-[0.8125rem] font-semibold text-ink">Producto destacado (mostrar en inicio)</label>
            </div>
            {error && <p className="text-red text-[0.8125rem]">{error}</p>}
            <div className="flex gap-3">
              <button type="submit" className="bg-ink text-white font-bold uppercase text-[0.875rem] tracking-[0.04em] px-6 py-3 rounded-lg hover:bg-rose transition">
                Guardar cambios
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