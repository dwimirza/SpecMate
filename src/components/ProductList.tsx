'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from './ProductCard';
import CompareBar from './CompareBar'; // akan kita buat
import DetailModal from './DetailModal'; // modal detail
import { LaptopRaw } from './ComparisonTable';
import { computeProcessingScore, computeMemoryScore, computeDisplayScore, computeBatteryScore, formatPrice } from '@/lib/scoring';
import { LaptopItem } from '@/lib/types';

function convertToLaptopItem(raw: LaptopRaw): LaptopItem {
  const cpuName = raw.cpu ? `${raw.cpu.brand} ${raw.cpu.model}` : 'Unknown CPU';
  const gpuName = raw.gpu ? `${raw.gpu.brand} ${raw.gpu.model}` : 'Integrated';
  const procScore = computeProcessingScore(cpuName, gpuName);
  const memScore = computeMemoryScore(raw.ramGb, raw.storageGb);
  const dispScore = computeDisplayScore(raw.screenResolutionX, raw.screenResolutionY, raw.screenRefreshRateHz, raw.screenPanelType);
  const battScore = computeBatteryScore(raw.batteryWh, raw.batteryHours);
  return {
    id: raw.id,
    brand: raw.brand,
    name: raw.model.split(' (')[0],
    price: raw.priceIdr ?? 0,
    priceStr: formatPrice(raw.priceIdr),
    imageUrl: raw.imageUrl,
    specValues: {
      processing: { value: procScore > 80 ? 'High-End' : procScore > 65 ? 'Mid-Range' : 'Entry-Level', detail: `${cpuName} + ${gpuName}`, score: procScore },
      memory: { value: `${raw.ramGb ?? 0}GB / ${raw.storageGb ?? 0}GB`, detail: `${raw.ramGb ?? 0}GB RAM, ${raw.storageGb ?? 0}GB SSD`, score: memScore },
      disp: { value: `${raw.screenResolutionX ?? '?'}×${raw.screenResolutionY ?? '?'}`, detail: `${raw.screenSizeInch ?? '?'}" · ${raw.screenResolutionX ?? '?'}×${raw.screenResolutionY ?? '?'}`, score: dispScore },
      batt: { value: raw.batteryWh ? `${raw.batteryWh}Wh` : 'N/A', detail: raw.batteryWh ? `${raw.batteryWh}Wh` : 'Battery info not available', score: battScore },
    },
  };
}

type SortBy = 'price_asc' | 'price_desc' | 'score';
type Category = 'laptop' | 'phone' | 'pc';

export default function ProductList() {
  const [laptops, setLaptops] = useState<LaptopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('score');
  const [compareList, setCompareList] = useState<number[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [category, setCategory] = useState<Category>('laptop');

  const fetchLaptops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/laptops');
      const data = await res.json();
      const rawList: LaptopRaw[] = data.laptops ?? [];
      setLaptops(rawList.map(convertToLaptopItem));
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data laptop');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLaptops();
  }, [fetchLaptops]);

  const filteredSorted = useMemo(() => {
    let list = [...laptops];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(l => l.name.toLowerCase().includes(q) || l.brand.toLowerCase().includes(q));
    }
    if (sortBy === 'price_asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'score') {
      const getOverall = (l: LaptopItem) =>
        (l.specValues.processing.score * 1.5 + l.specValues.memory.score * 1.2 + l.specValues.disp.score + l.specValues.batt.score) / (1.5 + 1.2 + 1 + 1);
      list.sort((a, b) => getOverall(b) - getOverall(a));
    }
    return list;
  }, [laptops, search, sortBy]);

  const toggleCompare = (id: number) => {
    setCompareList(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 2 ? [...prev, id] : prev);
  };

  const goCompare = () => {
    if (compareList.length === 2) {
      window.location.href = `/compare?ids=${compareList.join(',')}`;
    }
  };

  const selectedProduct = laptops.find(p => p.id === selectedProductId) || null;

  return (
    <div className="min-h-screen bg-background text-on-surface pb-32">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header, filter, search, sort (sama seperti di ProductList sebelumnya) */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface font-headline mb-1">Hardware</h2>
          <p className="text-sm text-on-surface-variant font-label">Temukan dan bandingkan spesifikasi. Pilih 2 produk untuk membandingkan langsung.</p>
        </div>

        {/* Category tabs (laptop, phone, pc) */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {[
            { id: 'laptop', icon: 'laptop_mac', label: 'Laptop', soon: false },
            { id: 'phone', icon: 'smartphone', label: 'Smartphone', soon: true },
            { id: 'pc', icon: 'developer_board', label: 'PC Parts', soon: true },
          ].map(cat => (
            <button key={cat.id} onClick={() => !cat.soon && setCategory(cat.id as Category)} disabled={cat.soon}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-label font-semibold text-sm whitespace-nowrap transition-all ${cat.soon ? 'bg-surface-container text-on-surface-variant/40 cursor-not-allowed border border-outline-variant/20' : category === cat.id ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container text-on-surface-variant border border-outline-variant/30 hover:border-primary/30 hover:text-primary'}`}>
              <span className="material-symbols-outlined text-base">{cat.icon}</span>
              {cat.label}
              {cat.soon && <span className="text-[10px] bg-surface-container-highest text-on-surface-variant/50 px-1.5 py-0.5 rounded-md">Soon</span>}
            </button>
          ))}
        </div>

        {/* Search & sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input type="text" placeholder="Cari laptop..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/50" />
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">sort</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortBy)}
              className="appearance-none pl-10 pr-9 py-2.5 bg-surface-container border border-outline-variant/30 rounded-xl text-sm font-medium cursor-pointer">
              <option value="score">Skor Tertinggi</option>
              <option value="price_asc">Harga Termurah</option>
              <option value="price_desc">Harga Termahal</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">expand_more</span>
          </div>
          <button onClick={fetchLaptops} disabled={loading} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-container border border-outline-variant/30 rounded-xl text-sm hover:text-primary transition-all">
            <span className={`material-symbols-outlined text-sm ${loading ? 'animate-spin' : ''}`}>refresh</span>
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-on-surface-variant">
            {loading ? 'Memuat data...' : `Menampilkan ${filteredSorted.length} produk`}
          </p>
          {compareList.length > 0 && (
            <span className="text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">{compareList.length}/2 dipilih</span>
          )}
        </div>

        {/* Error & Coming Soon handling */}
        {category !== 'laptop' ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 bg-surface-container border border-outline-variant/30 rounded-2xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-on-surface-variant/40 text-3xl">{category === 'phone' ? 'smartphone' : 'developer_board'}</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2">Coming Soon</h3>
            <p className="text-on-surface-variant text-sm">Kami sedang menyiapkan database {category === 'phone' ? 'smartphone' : 'PC parts'} terlengkap.</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-surface-container border border-outline-variant/30 rounded-2xl overflow-hidden animate-pulse h-96" />)}
          </div>
        ) : error ? (
          <div className="text-center py-10 text-error">{error}</div>
        ) : filteredSorted.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-16 h-16 bg-surface-container border border-outline-variant/30 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <span className="material-symbols-outlined text-on-surface-variant/40 text-3xl">inventory_2</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2">Produk tidak ditemukan</h3>
            <p className="text-on-surface-variant text-sm">Coba kata kunci yang berbeda.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredSorted.map(laptop => (
                <ProductCard
                  key={laptop.id}
                  laptop={laptop}
                  isSelected={compareList.includes(laptop.id)}
                  onToggleCompare={toggleCompare}
                  onDetail={id => setSelectedProductId(id)}
                  compareDisabled={compareList.length >= 2 && !compareList.includes(laptop.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Compare Bar */}
      <CompareBar compareIds={compareList} laptops={laptops} onRemove={(id) => setCompareList(prev => prev.filter(x => x !== id))} onGo={goCompare} />

      {/* Detail Modal */}
      <DetailModal product={selectedProduct} onClose={() => setSelectedProductId(null)} onCompare={(id) => { toggleCompare(id); setSelectedProductId(null); }} />
    </div>
  );
}