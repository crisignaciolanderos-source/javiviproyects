import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/catalog/product-card";
import { getProducts } from "@/lib/products";

export const metadata = {
  title: "Ropa — JAVIVI",
  description: "Ropa usada seleccionada en excelente estado.",
};

export default async function RopaPage() {
  const products = await getProducts("ropa");
  const sizes = Array.from(new Set(products.map((p) => p.size).filter(Boolean)));
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-[1440px] px-4 md:px-8 py-10 md:py-14">
          <nav className="text-[0.75rem] text-muted mb-6">
            <Link href="/" className="hover:text-ink">Inicio</Link> <span className="mx-1">/</span> <span className="text-ink font-medium">Ropa</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight lowercase mb-2">ropa usada</h1>
              <p className="text-muted max-w-[60ch]">Prendas únicas en excelente estado. Cada una es irrepetible.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-muted self-center">Tallas:</span>
              {sizes.map((s) => (
                <span key={s} className="text-[0.75rem] border border-line-2 rounded-full px-3 py-1">{s}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {products.length === 0 && (
            <p className="text-muted text-center py-20">Pronto nuevas prendas.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}