export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col py-8 px-4 bg-background h-screen w-64 border-r-0 z-50">
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-bold tracking-tighter text-[#00E5FF] font-headline">Specmate</h1>
        <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant mt-1">Synthetic Architect</p>
      </div>
      <nav className="flex-1 space-y-2">
        <a className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-primary font-bold border-r-2 border-primary bg-gradient-to-r from-primary/10 to-transparent" href="#">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label text-sm">Dashboard</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-on-surface-variant font-medium hover:bg-surface-container" href="#">
          <span className="material-symbols-outlined">memory</span>
          <span className="font-label text-sm">Builds</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-on-surface-variant font-medium hover:bg-surface-container" href="#">
          <span className="material-symbols-outlined">developer_board</span>
          <span className="font-label text-sm">Hardware</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-on-surface-variant font-medium hover:bg-surface-container" href="#">
          <span className="material-symbols-outlined">speed</span>
          <span className="font-label text-sm">Benchmark</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-on-surface-variant font-medium hover:bg-surface-container" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-label text-sm">Settings</span>
        </a>
      </nav>
      <div className="mt-auto px-4">
        <button className="w-full py-3 bg-gradient-to-br from-primary to-secondary text-on-primary-fixed font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          New Build
        </button>
      </div>
    </aside>
  );
}