import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/catalog/product-card";
import { getProducts } from "@/lib/products";

export const metadata = {
  title: "Cosmética — JAVIVI",
  description: "Cosmética consciente: sérums, cremas y protectores.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CosmeticaPage() {
  const products = await getProducts("cosmetica");
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-[1440px] px-4 md:px-8 py-10 md:py-14">
          <nav className="text-[0.75rem] text-muted mb-6">
            <Link href="/" className="hover:text-ink">Inicio</Link> <span className="mx-1">/</span> <span className="text-ink font-medium">Cosmética</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Cosmética</h1>
          <p className="text-muted mb-8 max-w-[60ch]">Activos a dosis eficaces. Formulado y envasado en Chile.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {products.length === 0 && (
            <p className="text-muted text-center py-20">Pronto nuevos productos.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}