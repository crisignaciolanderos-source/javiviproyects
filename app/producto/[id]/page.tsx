import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getProduct } from "@/lib/products";
import { formatCLP } from "@/lib/utils";
import { notFound } from "next/navigation";
import ReviewsSection from "@/components/catalog/reviews-section";
import ColorBuySection from "@/components/catalog/color-buy-section";
import ProductGallery from "@/components/catalog/product-gallery";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  const sold = product.sold || product.stock <= 0;

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-[1440px] px-4 md:px-8 py-8 md:py-12">
          <nav className="crumbs flex items-center gap-2.5 text-[0.75rem] text-muted mb-6 flex-wrap">
            <Link href="/" className="hover:text-ink">Inicio</Link>
            <span>›</span>
            <Link href={product.category === "cosmetica" ? "/cosmetica" : "/ropa"} className="hover:text-ink">
              {product.category === "cosmetica" ? "Cosmética" : "Ropa"}
            </Link>
            <span>›</span>
            <span className="text-ink font-medium">{product.name}</span>
          </nav>

          <div className="grid md:grid-cols-[1.35fr_1fr] gap-8 md:gap-14 items-start">
            {/* Galería */}
            <div className="md:sticky md:top-24">
              <ProductGallery images={product.images || []} alt={product.name} />
            </div>

            {/* Caja de compra */}
            <div>
              <div className="flex items-center gap-2 mb-3.5 text-[0.8125rem]">
                <span className="text-amber-500">★★★</span>
                <span className="text-line-2">★★</span>
                <Link href="#resenas" className="text-ink underline underline-offset-3 font-medium">Ver reseñas</Link>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2.5">{product.name}</h1>
              <p className="text-ink-2 max-w-[44ch] mb-6">{product.description}</p>

              <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
                {product.original_price && product.original_price > product.price && (
                  <span className="text-xl text-muted line-through">{formatCLP(product.original_price)}</span>
                )}
                <span className={`text-3xl font-extrabold tracking-tight ${product.original_price && product.original_price > product.price ? "text-red" : ""}`}>
                  {formatCLP(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="bg-red text-white text-[0.6875rem] font-bold px-2 py-0.5 rounded">
                    -{Math.round((1 - product.price / product.original_price) * 100)}%
                  </span>
                )}
              </div>
              <p className="text-[0.75rem] text-muted mb-5">IVA incluido · Precio de lanzamiento</p>

              <ColorBuySection product={product} />

              {product.category === "ropa" && (
                <div className="mt-5 pt-5 border-t border-line">
                  <p className="text-[0.8125rem]"><b>Talla/Tamaño:</b> {product.size}</p>
                  {product.condition && <p className="text-[0.8125rem] mt-1"><b>Estado:</b> {product.condition === "usado" ? "Usado (excelente estado)" : "Nuevo"}</p>}
                </div>
              )}

              <div className="flex flex-wrap gap-3.5 mt-5 text-[0.75rem] text-muted">
                <span>✓ Pago seguro</span>
                <span>✓ Pago contra entrega presencial en San Fernando</span>
              </div>

              <div className="mt-8 border-t border-line">
                <details className="border-b border-line" open>
                  <summary className="cursor-pointer py-5 font-bold flex justify-between items-center">
                    Descripción <span>+</span>
                  </summary>
                  <div className="pb-6 text-[0.9375rem] text-ink-2 max-w-[75ch]">
                    <p>{product.description}</p>
                  </div>
                </details>
                <details className="border-b border-line">
                  <summary className="cursor-pointer py-5 font-bold flex justify-between items-center">
                    Modo de empleo <span>+</span>
                  </summary>
                  <div className="pb-6 text-[0.9375rem] text-ink-2 max-w-[75ch]">
                    <p>{product.usage_instructions || "Aplicar según indicaciones del envase. Consulta por WhatsApp si tienes dudas."}</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="container mx-auto max-w-[1440px] px-4 md:px-8 pb-12">
        <ReviewsSection productId={product.id} />
      </div>
      <Footer />

      {/* Sticky mobile */}
      {!sold && (
        <div className="md:hidden fixed left-0 right-0 bottom-0 bg-[var(--white)] border-t border-line px-4 py-2.5 flex items-center gap-3.5 z-[60] shadow-[0_-4px_20px_rgba(0,0,0,.08)]">
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-[1rem]">{formatCLP(product.price)}</span>
          </div>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "56XXXXXXXXX"}?text=${encodeURIComponent("Hola JAVIVI! Me interesa este producto: " + product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-ink text-white font-bold uppercase text-[0.875rem] py-3 rounded-lg text-center min-h-[46px] flex items-center justify-center"
          >
            Comprar
          </a>
        </div>
      )}
    </>
  );
}