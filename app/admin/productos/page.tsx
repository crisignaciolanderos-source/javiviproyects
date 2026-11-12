"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Topbar from "@/components/layout/topbar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getAdminProducts, deleteProduct, updateProduct } from "@/lib/admin-store";
import type { Product } from "@/types";
import { formatCLP } from "@/lib/utils";

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);

  function refresh() {
    setProducts([...getAdminProducts()]);
  }
  useEffect(() => { refresh(); }, []);

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    deleteProduct(id);
    refresh();
  }

  function toggleActive(p: Product) {
    updateProduct(p.id, { active: !p.active });
    refresh();
  }

  return (
    <>
      <Topbar />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-[1440px] px-4 md:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight lowercase">productos</h1>
            <Link href="/admin/productos/nuevo" className="bg-ink text-white font-bold uppercase text-[0.75rem] tracking-[0.12em] px-4 py-2.5 rounded-lg hover:bg-rose transition w-fit">
              + Nuevo producto
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[0.8125rem]">
              <thead>
                <tr className="border-b border-line text-left text-muted uppercase text-[0.6875rem] tracking-[0.12em]">
                  <th className="py-2 pr-3">Nombre</th>
                  <th className="py-2 pr-3">Categoría</th>
                  <th className="py-2 pr-3">Precio</th>
                  <th className="py-2 pr-3">Stock</th>
                  <th className="py-2 pr-3">Estado</th>
                  <th className="py-2 pr-3">Activo</th>
                  <th className="py-2 pr-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-line">
                    <td className="py-3 pr-3 font-semibold">{p.name}</td>
                    <td className="py-3 pr-3 capitalize">{p.category}</td>
                    <td className="py-3 pr-3">{formatCLP(p.price)}</td>
                    <td className="py-3 pr-3">{p.stock}</td>
                    <td className="py-3 pr-3">
                      {p.sold ? <span className="text-red font-bold">Vendido</span> : "Disponible"}
                    </td>
                    <td className="py-3 pr-3">
                      <button
                        onClick={() => toggleActive(p)}
                        className={`text-[0.6875rem] font-bold uppercase px-2 py-1 rounded ${p.active ? "bg-green/10 text-green" : "bg-gray text-muted"}`}
                      >
                        {p.active ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td className="py-3 pr-3 flex gap-2">
                      <Link href={`/admin/productos/${p.id}/editar`} className="text-ink hover:underline font-semibold">Editar</Link>
                      <button onClick={() => handleDelete(p.id)} className="text-red hover:underline font-semibold">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && <p className="text-muted py-10 text-center">No hay productos.</p>}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}