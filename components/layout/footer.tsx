import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--white)] pt-14 text-[0.8125rem]">
      <div className="container mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 md:gap-12 pb-10">
          <div>
            <Link href="/" className="text-[1.05rem] font-extrabold tracking-[0.18em] uppercase inline-block mb-3.5">JAVIVI</Link>
            <p className="text-muted max-w-[34ch] leading-relaxed">
              Cosmética consciente y ropa seleccionada. Formulado y gestionado desde Chile.
            </p>
            <div className="flex gap-3 mt-2">
              {["ig", "tt", "fb", "yt"].map((s) => (
                <Link key={s} href="#" aria-label={s} className="w-8.5 h-8.5 w-[34px] h-[34px] border border-line-2 rounded-full grid place-items-center text-ink hover:bg-ink hover:text-white hover:border-ink transition text-[0.8rem]">
                  {s}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[0.6875rem] uppercase tracking-[0.16em] mb-4 font-bold">Tienda</h4>
            <ul className="grid gap-2.5">
              <li><Link href="/cosmetica" className="text-muted-2 hover:text-ink transition">Cosmética</Link></li>
              <li><Link href="/ropa" className="text-muted-2 hover:text-ink transition">Ropa</Link></li>
              <li><Link href="/#oferta" className="text-muted-2 hover:text-ink transition">Promociones</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[0.6875rem] uppercase tracking-[0.16em] mb-4 font-bold">Ayuda</h4>
            <ul className="grid gap-2.5">
              <li><Link href="#" className="text-muted-2 hover:text-ink transition">Ayuda &amp; FAQ</Link></li>
              <li><Link href="#" className="text-muted-2 hover:text-ink transition">Seguir el pedido</Link></li>
              <li><Link href="#" className="text-muted-2 hover:text-ink transition">Devoluciones</Link></li>
              <li><Link href="#" className="text-muted-2 hover:text-ink transition">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[0.6875rem] uppercase tracking-[0.16em] mb-4 font-bold">Legal</h4>
            <ul className="grid gap-2.5">
              <li><Link href="#" className="text-muted-2 hover:text-ink transition">Privacidad</Link></li>
              <li><Link href="#" className="text-muted-2 hover:text-ink transition">Términos</Link></li>
              <li><Link href="#" className="text-muted-2 hover:text-ink transition">Cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-line py-5 flex justify-between gap-3 flex-wrap text-[0.75rem] text-muted">
          <span>© 2026 JAVIVI. Todos los derechos reservados.</span>
          <span>País: <b className="text-ink">CL</b> · Idioma: <b className="text-ink">es</b></span>
        </div>
        <div className="pb-6 text-center">
          <Link href="/admin" className="text-[0.7rem] text-muted-2 hover:text-ink transition underline underline-offset-2">
            Ingresa si eres trabajador
          </Link>
        </div>
      </div>
    </footer>
  );
}