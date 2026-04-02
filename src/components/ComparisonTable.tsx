export default function ComparisonTable() {
  return (
    <section className="grid grid-cols-[200px_1fr_1fr_1fr] bg-surface-container rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Header Column (Labels) */}
      <div className="bg-surface-container-low border-r border-outline-variant/10">
        <div className="h-64 flex items-end p-6 pb-8">
          <span className="text-xs font-label font-black text-neutral-600 uppercase tracking-widest">Part Identification</span>
        </div>
        <div className="p-6 space-y-8 font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          <div className="h-6 flex items-center">Feature</div>
          <div className="h-6 flex items-center">Price (IDR)</div>
          <div className="h-6 flex items-center">Price (USD)</div>
          <div className="h-6 flex items-center">Category</div>
          <div className="h-6 flex items-center">Tier</div>
          <div className="h-6 flex items-center">Benchmark</div>
          <div className="h-6 flex items-center">Cores/Threads</div>
          <div className="h-6 flex items-center">Clock Speeds</div>
          <div className="h-6 flex items-center">TDP</div>
          <div className="h-6 flex items-center">Socket</div>
          <div className="h-6 flex items-center">Cache</div>
          <div className="h-6 flex items-center">Stock status</div>
        </div>
      </div>

      {/* Product 1: Intel */}
      <div className="group relative">
        <div className="h-64 p-8 flex flex-col justify-center items-center text-center bg-gradient-to-b from-primary/5 to-transparent">
          <div className="space-y-2">
            <span className="block text-primary text-xs font-label font-black uppercase tracking-[0.3em] mb-3">INTEL</span>
            <h3 className="font-headline font-bold text-2xl lg:text-3xl leading-tight text-white tracking-tighter">Core i7-14700K</h3>
            <div className="h-1 w-12 bg-primary/30 mx-auto mt-4 rounded-full"></div>
          </div>
        </div>
        <div className="p-6 space-y-8 font-body text-sm font-medium">
          <div className="h-6 flex items-center text-on-surface">Flagship</div>
          <div className="h-6 flex items-center text-on-surface font-headline font-bold text-base">Rp 6.850.000</div>
          <div className="h-6 flex items-center text-on-surface-variant">$409.00</div>
          <div className="h-6 flex items-center"><span className="bg-surface-container-highest px-2 py-0.5 rounded text-[10px] font-label font-bold uppercase">CPU</span></div>
          <div className="h-6 flex items-center"><span className="bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-full text-[10px] font-label font-bold uppercase">Enthusiast</span></div>
          <div className="h-6 flex items-center text-primary-dim font-headline font-bold">53,421 pts</div>
          <div className="h-6 flex items-center text-on-surface">20C / 28T</div>
          <div className="h-6 flex items-center text-on-surface">3.4 GHz - 5.6 GHz</div>
          <div className="h-6 flex items-center text-on-surface">125W (253W Max)</div>
          <div className="h-6 flex items-center text-on-surface">LGA 1700</div>
          <div className="h-6 flex items-center text-on-surface">33MB L3</div>
          <div className="h-6 flex items-center text-emerald-400 flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> In Stock</div>
        </div>
      </div>

      {/* Product 2: AMD */}
      <div className="group border-l border-outline-variant/10">
        <div className="h-64 p-8 flex flex-col justify-center items-center text-center bg-gradient-to-b from-secondary/5 to-transparent">
          <div className="space-y-2">
            <span className="block text-secondary text-xs font-label font-black uppercase tracking-[0.3em] mb-3">AMD</span>
            <h3 className="font-headline font-bold text-2xl lg:text-3xl leading-tight text-white tracking-tighter">Ryzen 5 7600X</h3>
            <div className="h-1 w-12 bg-secondary/30 mx-auto mt-4 rounded-full"></div>
          </div>
        </div>
        <div className="p-6 space-y-8 font-body text-sm font-medium">
          <div className="h-6 flex items-center text-on-surface">Performance</div>
          <div className="h-6 flex items-center text-on-surface font-headline font-bold text-base">Rp 3.750.000</div>
          <div className="h-6 flex items-center text-on-surface-variant">$229.00</div>
          <div className="h-6 flex items-center"><span className="bg-surface-container-highest px-2 py-0.5 rounded text-[10px] font-label font-bold uppercase">CPU</span></div>
          <div className="h-6 flex items-center"><span className="bg-surface-container-highest text-on-surface px-2 py-0.5 rounded-full text-[10px] font-label font-bold uppercase">Mid-Range</span></div>
          <div className="h-6 flex items-center text-primary-dim font-headline font-bold">28,541 pts</div>
          <div className="h-6 flex items-center text-on-surface">6C / 12T</div>
          <div className="h-6 flex items-center text-on-surface">4.7 GHz - 5.3 GHz</div>
          <div className="h-6 flex items-center text-on-surface">105W</div>
          <div className="h-6 flex items-center text-on-surface">AM5</div>
          <div className="h-6 flex items-center text-on-surface">32MB L3</div>
          <div className="h-6 flex items-center text-emerald-400 flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> In Stock</div>
        </div>
      </div>

      {/* Product 3: Case */}
      <div className="group border-l border-outline-variant/10">
        <div className="h-64 p-8 flex flex-col justify-center items-center text-center bg-gradient-to-b from-tertiary/5 to-transparent">
          <div className="space-y-2">
            <span className="block text-tertiary text-xs font-label font-black uppercase tracking-[0.3em] mb-3">THERMALTAKE</span>
            <h3 className="font-headline font-bold text-2xl lg:text-3xl leading-tight text-white tracking-tighter">Versa H18 mATX</h3>
            <div className="h-1 w-12 bg-tertiary/30 mx-auto mt-4 rounded-full"></div>
          </div>
        </div>
        <div className="p-6 space-y-8 font-body text-sm font-medium">
          <div className="h-6 flex items-center text-on-surface">Budget-Friendly</div>
          <div className="h-6 flex items-center text-on-surface font-headline font-bold text-base">Rp 650.000</div>
          <div className="h-6 flex items-center text-on-surface-variant">$45.00</div>
          <div className="h-6 flex items-center"><span className="bg-surface-container-highest px-2 py-0.5 rounded text-[10px] font-label font-bold uppercase">Case</span></div>
          <div className="h-6 flex items-center"><span className="bg-surface-container-highest text-on-surface px-2 py-0.5 rounded-full text-[10px] font-label font-bold uppercase">Budget</span></div>
          <div className="h-6 flex items-center text-on-surface-variant italic">N/A</div>
          <div className="h-6 flex items-center text-on-surface-variant italic">N/A</div>
          <div className="h-6 flex items-center text-on-surface-variant italic">N/A</div>
          <div className="h-6 flex items-center text-on-surface-variant italic">N/A</div>
          <div className="h-6 flex items-center text-on-surface">Micro-ATX</div>
          <div className="h-6 flex items-center text-on-surface-variant italic">N/A</div>
          <div className="h-6 flex items-center text-error-container flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-error-container"></span> Low Stock</div>
        </div>
      </div>
    </section>
  );
}