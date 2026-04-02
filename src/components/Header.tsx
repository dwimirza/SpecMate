export default function Header() {
  return (
    <header className="flex justify-between items-center w-full px-8 h-16 ml-64 max-w-[calc(100%-16rem)] fixed top-0 bg-background/80 backdrop-blur-xl z-40 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-8">
        <nav className="flex items-center gap-6 font-headline text-xs uppercase tracking-widest">
          <a className="text-on-surface-variant hover:text-white transition-opacity" href="#">Docs</a>
          <a className="text-on-surface-variant hover:text-white transition-opacity" href="#">Support</a>
          <a className="text-on-surface-variant hover:text-white transition-opacity" href="#">Community</a>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input
            className="bg-surface-container-high border-none rounded-full py-1.5 pl-10 pr-4 text-[10px] tracking-widest font-label w-64 focus:ring-1 focus:ring-primary focus:bg-surface-bright transition-all"
            placeholder="SEARCH HARDWARE..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-4 text-on-surface-variant">
          <button className="material-symbols-outlined hover:text-white transition-colors">notifications</button>
          <button className="material-symbols-outlined hover:text-white transition-colors">account_circle</button>
        </div>
      </div>
    </header>
  );
}