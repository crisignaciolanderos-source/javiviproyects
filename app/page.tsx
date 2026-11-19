import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/catalog/product-card";
import FeaturedCard from "@/components/catalog/featured-card";
import PromoCarousel from "@/components/catalog/promo-carousel";
import CircularCarousel from "@/components/catalog/circular-carousel";
import { getFeatured, getProducts } from "@/lib/products";
import { whatsappLink } from "@/lib/whatsapp";

export default async function Home() {
  const featured = await getFeatured(4);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Carrusel de promociones */}
        <section className="py-6 md:py-8">
          <PromoCarousel />
        </section>

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-pink-soft via-white to-pink-bg">
          <div className="container mx-auto max-w-[1440px] px-4 md:px-8 py-10 md:py-14 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
                Belleza y estilo,<br />seleccionado para ti
              </h1>
              <p className="mt-5 text-muted max-w-[44ch] text-[1rem]">
                Cosmetic consciente y Ropa Usada en excelente estado. Compra directo por WhatsApp, sin complicaciones.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/cosmetica" className="bg-ink text-white font-bold uppercase text-[0.875rem] tracking-[-0.03em] px-6 py-3.5 rounded-lg hover:bg-rose transition">
                  Ver cosméticos
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
        <section className="py-10 md:py-14">
          <div className="container mx-auto max-w-[1440px] px-4 md:px-8">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6">Explora por categoría</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/cosmetica" className="group relative overflow-hidden rounded-2xl border border-line aspect-[16/9] md:aspect-[4/3]">
                <Image src="https://picsum.photos/seed/catcos/800/600" alt="Cosmética" fill className="object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] mb-1">Cuidado de la piel</p>
                  <h3 className="text-2xl font-extrabold uppercase">Cosmetic</h3>
                </div>
              </Link>
              <Link href="/ropa" className="group relative overflow-hidden rounded-2xl border border-line aspect-[16/9] md:aspect-[4/3]">
                <Image src="https://picsum.photos/seed/catrop/800/600" alt="Ropa" fill className="object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] mb-1">Prendas únicas</p>
                  <h3 className="text-2xl font-extrabold uppercase">Ropa Usada</h3>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Destacados */}
        <section className="py-10 md:py-14 bg-gray">
          <div className="container mx-auto max-w-[1440px] px-4 md:px-8">
            <div className="flex items-end justify-between mb-5">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Destacados</h2>
              <Link href="/cosmetica" className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] hover:underline">Ver todo →</Link>
            </div>
            <div style={{ width: "100%", height: "560px", position: "relative" }}>
              <CircularCarousel
                items={featured}
                cardWidth={220}
                aspectRatio={1}
                speed={14}
                gap={25}
                tilt={-5}
                curve={1}
                perspective={2500}
                autoplay="drift"
                interval={3}
                direction="left"
                momentum={0.6}
                snap
                pauseOnHover
                focusOnClick
                draggable
                parallax={0.3}
                stretch={0.5}
                fadeColor="#000000"
                depthFade={0.55}
                innerShade={0.6}
                cornerRadius={12}
              />
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}