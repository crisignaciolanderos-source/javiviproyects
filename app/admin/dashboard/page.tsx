"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Topbar from "@/components/layout/topbar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getAdminProducts, getSales } from "@/lib/admin-store";
import { getAdminEmail, logout } from "@/lib/admin-auth";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    setProducts(getAdminProducts());
    setSales(getSales());
  }, []);

  const total = products.length;
  const sold = products.filter((p) => p.sold).length;
  const active = products.filter((p) => p.active && !p.sold).length;
  const lowStock = products.filter((p) => !p.sold && p.stock <= 2).length;

  return (
    <>
      <Topbar />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-[1440px] px-4 md:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight lowercase">panel admin</h1>
              <p className="text-muted text-[0.875rem]">Sesión: {getAdminEmail()}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/productos/nuevo" className="bg-ink text-white font-bold uppercase text-[0.75rem] tracking-[0.12em] px-4 py-2.5 rounded-lg hover:bg-rose transition">
                + Nuevo producto
              </Link>
              <button
                onClick={() => { logout(); router.replace("/admin"); }}
                className="border border-line-2 text-ink font-bold uppercase text-[0.75rem] tracking-[0.12em] px-4 py-2.5 rounded-lg hover:bg-gray transition"
              >
                Salir
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              ["Total productos", total],
              ["Activos", active],
              ["Vendidos", sold],
              ["Stock bajo (≤2)", lowStock],
            ].map(([label, val]) => (
              <div key={label} className="bg-gray border border-line rounded-xl p-5">
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-muted mb-1">{label}</p>
                <p className="text-3xl font-extrabold">{val}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/admin/productos" className="bg-white border border-line-2 text-ink font-bold uppercase text-[0.75rem] tracking-[0.12em] px-4 py-2.5 rounded-lg hover:shadow transition">
              Gestionar productos →
            </Link>
            <Link href="/admin/ventas" className="bg-white border border-line-2 text-ink font-bold uppercase text-[0.75rem] tracking-[0.12em] px-4 py-2.5 rounded-lg hover:shadow transition">
              Registrar venta →
            </Link>
            <Link href="/admin/promociones" className="bg-white border border-line-2 text-ink font-bold uppercase text-[0.75rem] tracking-[0.12em] px-4 py-2.5 rounded-lg hover:shadow transition">
              Gestionar promociones →
            </Link>
          </div>

          <h2 className="text-lg font-bold mb-4">Últimas ventas</h2>
          {sales.length === 0 ? (
            <p className="text-muted text-[0.875rem]">Aún no hay ventas registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[0.8125rem]">
                <thead>
                  <tr className="border-b border-line text-left text-muted uppercase text-[0.6875rem] tracking-[0.12em]">
                    <th className="py-2 pr-4">Fecha</th>
                    <th className="py-2 pr-4">Producto</th>
                    <th className="py-2 pr-4">Comprador</th>
                    <th className="py-2 pr-4">Teléfono</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.slice(0, 10).map((s) => (
                    <tr key={s.id} className="border-b border-line">
                      <td className="py-2 pr-4">{new Date(s.created_at).toLocaleDateString("es-CL")}</td>
                      <td className="py-2 pr-4 font-semibold">{s.product_name}</td>
                      <td className="py-2 pr-4">{s.buyer_name || "—"}</td>
                      <td className="py-2 pr-4">{s.buyer_phone || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}