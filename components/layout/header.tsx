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
          <button aria-label="Buscar" className="bg-none border-none cursor-pointer text-ink p-1 flex">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          </button>
          <Link href="#oferta" aria-label="Cesta" className="relative text-ink p-1 flex">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 7h12l1.2 13H4.8L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>
            <span className="absolute -top-1 -right-1.5 bg-rose text-white text-[0.6rem] font-bold w-4 h-4 rounded-full grid place-items-center">0</span>
          </Link>
        </div>
      </div>
    </header>
  );
}