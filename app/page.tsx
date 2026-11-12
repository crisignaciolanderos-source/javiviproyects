import Link from "next/link";
import Image from "next/image";
import Topbar from "@/components/layout/topbar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/catalog/product-card";
import { getFeatured, getProducts } from "@/lib/products";

export default async function Home() {
  const featured = await getFeatured(4);
  const promo = (await getProducts()).find((p) => p.category === "cosmetica");

  return (
    <>
      <Topbar />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-pink-soft via-white to-pink-bg">
          <div className="container mx-auto max-w-[1440px] px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-rose mb-4">Edición fundadora</p>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] lowercase">
                belleza y estilo,<br />seleccionado para ti
              </h1>
              <p className="mt-5 text-muted max-w-[44ch] text-[1rem]">
                Cosmética consciente y ropa usada en excelente estado. Compra directo por WhatsApp, sin complicaciones.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/cosmetica" className="bg-ink text-white font-bold uppercase text-[0.875rem] tracking-[-0.03em] px-6 py-3.5 rounded-lg hover:bg-rose transition">
                  Ver cosmética
                </Link>
                <Link href="/ropa" className="bg-white text-ink font-bold uppercase text-[0.875rem] tracking-[-0.03em] px-6 py-3.5 rounded-lg border border-line-2 shadow-sm hover:shadow-md transition">
                  Ver ropa
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-line shadow-lg">
              <Image
                src="https://picsum.photos/seed/herojavivi/700/875"
                alt="JAVIVI"
                fill
                priority
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Categorías */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto max-w-[1440px] px-4 md:px-8">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-8 lowercase">explora por categoría</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/cosmetica" className="group relative overflow-hidden rounded-2xl border border-line aspect-[16/9] md:aspect-[4/3]">
                <Image src="https://picsum.photos/seed/catcos/800/600" alt="Cosmética" fill className="object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] mb-1">Cuidado de la piel</p>
                  <h3 className="text-2xl font-extrabold lowercase">cosmética</h3>
                </div>
              </Link>
              <Link href="/ropa" className="group relative overflow-hidden rounded-2xl border border-line aspect-[16/9] md:aspect-[4/3]">
                <Image src="https://picsum.photos/seed/catrop/800/600" alt="Ropa" fill className="object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] mb-1">Prendas únicas</p>
                  <h3 className="text-2xl font-extrabold lowercase">ropa usada</h3>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Destacados */}
        <section className="py-14 md:py-20 bg-gray">
          <div className="container mx-auto max-w-[1440px] px-4 md:px-8">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight lowercase">destacados</h2>
              <Link href="/cosmetica" className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] hover:underline">Ver todo →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>

        {/* Oferta */}
        <section id="oferta" className="py-16 md:py-24">
          <div className="container mx-auto max-w-[760px] px-4 md:px-8 text-center">
            <p className="text-[0.6875rem] font-bold tracking-[0.16em] uppercase text-red mb-3">Edición fundadora</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight lowercase mb-4">solo 300 unidades a −30%</h2>
            <p className="text-muted text-[0.9375rem] max-w-[52ch] mx-auto mb-7">
              Cuando se agoten, el siguiente lote tendrá precio completo. Incluye guía digital de rutina, envío gratis y garantía de 30 días.
            </p>
            <Link href="/cosmetica" className="inline-block bg-ink text-white font-bold uppercase text-[0.9375rem] tracking-[0.04em] px-8 py-4 rounded-lg min-h-[56px] hover:bg-rose transition">
              Añadir a la cesta · $27.990
            </Link>
            <p className="mt-4 text-[0.75rem] text-muted">🔒 Visa · Mastercard · PayPal · transferencia — sin suscripción</p>
          </div>
        </section>

        {/* Trust */}
        <section className="border-y border-line py-10 bg-white">
          <div className="container mx-auto max-w-[1440px] px-4 md:px-8">
            <ul className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                ["🚚", "Envío gratuito a partir de $35.000"],
                ["↩️", "Devoluciones fáciles en 30 días"],
                ["💬", "Asesoría de piel online"],
                ["🎁", "Regalos con Club JAVIVI"],
                ["🔒", "Pagos seguros"],
              ].map(([ico, txt]) => (
                <li key={txt} className="flex flex-col items-center text-center gap-2 text-[0.75rem] font-semibold text-ink-2 leading-snug">
                  <span className="w-10 h-10 rounded-full bg-ink text-white grid place-items-center text-[1rem]">{ico}</span>
                  {txt}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}