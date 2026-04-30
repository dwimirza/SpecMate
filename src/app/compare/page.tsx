'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ComparisonTable from '@/components/ComparisonTable';
import PriceHistory from '@/components/PriceHistory';
import AddPartModal from '@/components/AddPartModal';
import { LaptopRaw } from '@/components/ComparisonTable';

export default function ComparePage() {
  const searchParams = useSearchParams();
  const [laptops, setLaptops] = useState<LaptopRaw[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [preselectedIds, setPreselectedIds] = useState<number[]>([]);

  const fetchLaptops = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/laptops');
      const data = await res.json();
      const list = data.laptops ?? [];
      setLaptops(list);
      // Extract preselected IDs from URL
      const idsParam = searchParams.get('ids');
      if (idsParam) {
        const ids = idsParam.split(',').map(Number).filter(n => !isNaN(n));
        setPreselectedIds(ids);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchLaptops();
  }, [fetchLaptops]);

  const handleImported = () => {
    setModalOpen(false);
    fetchLaptops();
  };

  return (
    <>
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16 flex-1 p-8 bg-background min-h-screen">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-headline font-bold tracking-tight text-on-surface mb-2">Compare Parts</h1>
            <p className="text-on-surface-variant font-body">Cross-reference technical performance data and market pricing.</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="bg-surface-container-highest border border-outline-variant/30 px-6 py-3 rounded-xl font-label text-sm font-bold flex items-center gap-3 hover:bg-surface-bright transition-all">
            <span className="material-symbols-outlined text-primary">add_circle</span>
            Add another part...
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-32 text-on-surface-variant">Loading laptops...</div>
        ) : (
          <ComparisonTable laptops={laptops} preselectedIds={preselectedIds} />
        )}
        <PriceHistory />
      </main>
      <AddPartModal open={modalOpen} onClose={() => setModalOpen(false)} onImported={handleImported} />
    </>
  );
}