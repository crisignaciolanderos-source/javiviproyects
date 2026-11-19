"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getAdminProducts, registerSale, getSales } from "@/lib/admin-store";
import type { Product } from "@/types";
import { formatCLP } from "@/lib/utils";

export default function VentasPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState("");

  function refresh() {
    setProducts([...getAdminProducts()]);
    setSales([...getSales()]);
  }
  useEffect(() => { refresh(); }, []);

  const available = products.filter((p) => !p.sold && p.active);

  function handleSale(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    if (!selectedId) { setMsg("Selecciona un producto."); return; }
    const sale = registerSale({ product_id: selectedId, buyer_name: buyerName, buyer_phone: buyerPhone, notes });
    if (sale) {
      setMsg("✓ Venta registrada. Stock actualizado.");
      setSelectedId("");
      setBuyerName("");
      setBuyerPhone("");
      setNotes("");
      refresh();
    } else {
      setMsg("No se pudo registrar la venta.");
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-[1440px] px-4 md:px-8 py-10">
          <Link href="/admin/dashboard" className="text-[0.75rem] text-muted hover:text-ink">← Dashboard</Link>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-4 mb-6">Registrar venta</h1>

          <div className="grid md:grid-cols-2 gap-8">
            <form onSubmit={handleSale} className="bg-gray border border-line rounded-xl p-6 flex flex-col gap-4">
              <div>
                <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">Producto disponible</label>
                <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="input mt-1">
                  <option value="">Selecciona...</option>
                  {available.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatCLP(p.price)} (stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">Nombre comprador</label>
                <input value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="input mt-1" />
              </div>
              <div>
                <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">Teléfono</label>
                <input value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} className="input mt-1" />
              </div>
              <div>
                <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">Notas</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="input mt-1 min-h-[70px]" />
              </div>
              {msg && <p className="text-[0.8125rem] font-semibold text-green">{msg}</p>}
              <button type="submit" className="bg-ink text-white font-bold uppercase text-[0.875rem] tracking-[0.04em] px-6 py-3 rounded-lg hover:bg-rose transition">
                Registrar venta
              </button>
              <p className="text-[0.7rem] text-muted">Al registrar, el stock se resta automáticamente. Ropa se marca como vendida.</p>
            </form>

            <div>
              <h2 className="text-lg font-bold mb-4">Historial de ventas</h2>
              {sales.length === 0 ? (
                <p className="text-muted text-[0.875rem]">Sin ventas aún.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-[0.8125rem]">
                    <thead>
                      <tr className="border-b border-line text-left text-muted uppercase text-[0.6875rem] tracking-[0.12em]">
                        <th className="py-2 pr-3">Fecha</th>
                        <th className="py-2 pr-3">Producto</th>
                        <th className="py-2 pr-3">Comprador</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.map((s) => (
                        <tr key={s.id} className="border-b border-line">
                          <td className="py-2 pr-3">{new Date(s.created_at).toLocaleDateString("es-CL")}</td>
                          <td className="py-2 pr-3 font-semibold">{s.product_name}</td>
                          <td className="py-2 pr-3">{s.buyer_name || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <style jsx>{`
        .input {
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