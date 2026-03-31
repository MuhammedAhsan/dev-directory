import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900 transition-colors hover:text-sky-700">
          One Dev Directory
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-slate-600 md:flex">
          <a href="#companies" className="transition-colors hover:text-sky-700">Companies</a>
          <a href="#details" className="transition-colors hover:text-sky-700">Insights</a>
          <a href="#footer" className="transition-colors hover:text-sky-700">Contact</a>
        </nav>
      </div>
    </header>
  );
}
