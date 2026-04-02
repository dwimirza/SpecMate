export default function PriceHistory() {
  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-headline font-bold">Price History (6 Months)</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant">
            <span className="w-3 h-3 rounded-full bg-primary"></span> Intel i7-14700K
          </div>
          <div className="flex items-center gap-2 text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant">
            <span className="w-3 h-3 rounded-full bg-secondary"></span> AMD Ryzen 5
          </div>
          <div className="flex items-center gap-2 text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant">
            <span className="w-3 h-3 rounded-full bg-tertiary"></span> TT Versa H18
          </div>
        </div>
      </div>
      <div className="bg-surface-container p-8 rounded-2xl h-80 relative flex items-end justify-between overflow-hidden">
        {/* Faux Line Chart Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
            <path d="M0,250 Q100,220 200,240 T400,180 T600,150 T800,100 T1000,50" fill="none" stroke="#81ecff" strokeWidth="4"></path>
            <path d="M0,280 Q150,270 300,285 T500,250 T750,260 T1000,230" fill="none" stroke="#bc87fe" strokeWidth="4"></path>
            <path d="M0,295 Q200,295 400,290 T700,295 T1000,295" fill="none" stroke="#7c98ff" strokeWidth="4"></path>
          </svg>
        </div>
        {/* Vertical Grid Lines */}
        <div className="absolute inset-0 flex justify-between px-8 pointer-events-none">
          <div className="h-full w-px bg-white/5"></div>
          <div className="h-full w-px bg-white/5"></div>
          <div className="h-full w-px bg-white/5"></div>
          <div className="h-full w-px bg-white/5"></div>
          <div className="h-full w-px bg-white/5"></div>
          <div className="h-full w-px bg-white/5"></div>
        </div>
        {/* Month Labels */}
        <div className="w-full flex justify-between text-[10px] font-label font-bold text-neutral-600 uppercase tracking-widest z-10">
          <span>January</span>
          <span>February</span>
          <span>March</span>
          <span>April</span>
          <span>May</span>
          <span>June</span>
        </div>
        {/* Data Tooltip Faux Overlay */}
        <div className="absolute top-1/4 right-1/4 bg-surface-bright/90 backdrop-blur-md p-4 rounded-xl border border-primary/20 shadow-2xl z-20">
          <p className="text-[10px] font-label font-bold text-neutral-400 mb-2">MAY 24</p>
          <div className="space-y-1">
            <div className="flex justify-between gap-8">
              <span className="text-xs text-on-surface">i7-14700K</span>
              <span className="text-xs font-bold text-primary">Rp 6.8M</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="text-xs text-on-surface">R5 7600X</span>
              <span className="text-xs font-bold text-secondary">Rp 3.7M</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}