import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-line">
      <div className="container mx-auto max-w-[1440px] px-4 md:px-8 flex items-center justify-between h-16 gap-5">
        <Link href="/" className="text-xl font-extrabold tracking-[0.18em] uppercase whitespace-nowrap">
          JAVIVI<span className="font-normal"></span>
        </Link>
        <nav className="hidden md:flex gap-6.5 list-none">
          <ul className="flex gap-[26px] list-none">
            <li><Link href="/cosmetica" className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] relative py-1 hover:after:w-full after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-ink after:transition-all">Cosmética</Link></li>
            <li><Link href="/ropa" className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] relative py-1 hover:after:w-full after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-ink after:transition-all">Ropa</Link></li>
            <li><Link href="/#oferta" className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-red relative py-1">Promociones</Link></li>
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          {/* Lupa y carrito eliminados por solicitud del cliente */}
        </div>
      </div>
    </header>
  );
}