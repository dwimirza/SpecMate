'use client';

import { useEffect, useState } from 'react';

type Laptop = {
  id: number;
  brand: string;
  model: string;
  cpuId: number | null;
  gpuId: number | null;
  ramGb: number | null;
  storageGb: number | null;
  batteryWh: number | null;
  batteryHours: number | null;
  priceIdr: number | null;
  // optional display fields if your /api/laptop returns them
  cpu?: { model: string | null } | null;
  gpu?: { model: string | null } | null;
};

type CompareResult = {
  items: (Laptop & { perfScore: number; valueScore: number })[];
  best: Laptop & { perfScore: number; valueScore: number };
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [result, setResult] = useState<CompareResult | null>(null);

  useEffect(() => {
    const fetchLaptops = async () => {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      const res = await fetch('/api/laptop?' + params.toString());
      const data = await res.json();
      setLaptops(data);
    };
    fetchLaptops();
  }, [query]);

  const toggleSelect = (id: number) => {
    setResult(null);
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  };

  const compare = async () => {
    const res = await fetch('/api/laptop/compare', {
      method: 'POST',
      body: JSON.stringify({ ids: selectedIds }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Device Value Comparator (Laptop)
      </h1>

      <div className="mb-4 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari laptop"
          className="px-3 py-2 rounded bg-slate-900 border border-slate-700 w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {laptops.map((l) => {
          const selected = selectedIds.includes(l.id);
          return (
            <button
              key={l.id}
              onClick={() => toggleSelect(l.id)}
              className={`text-left p-3 rounded border ${
                selected
                  ? 'border-emerald-400 bg-slate-900'
                  : 'border-slate-700 bg-slate-900/60'
              }`}
            >
              <div className="font-semibold">
                {l.brand} {l.model}
              </div>
              <div className="text-xs text-slate-400">
                CPU: {l.cpu?.model ?? '-'} | GPU: {l.gpu?.model ?? '-'}
              </div>
              <div className="text-xs text-slate-400">
                RAM: {l.ramGb ?? '-'} GB | Storage: {l.storageGb ?? '-'} GB
              </div>
              <div className="text-xs text-slate-400">
                Baterai: {l.batteryWh ?? '-'} Wh ({l.batteryHours ?? '-'} jam)
              </div>
              <div className="text-xs text-slate-400">
                Harga: Rp{l.priceIdr?.toLocaleString('id-ID') ?? '-'}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <button
          onClick={compare}
          disabled={selectedIds.length < 2}
          className="px-4 py-2 rounded bg-emerald-500 text-slate-900 disabled:bg-slate-700 disabled:text-slate-400"
        >
          Compare ({selectedIds.length}/3)
        </button>
      </div>

      {result && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Result</h2>
          <div className="overflow-x-auto">
            <table className="text-sm min-w-full border border-slate-700">
              <thead className="bg-slate-900">
                <tr>
                  <th className="border border-slate-700 px-2 py-1">Model</th>
                  <th className="border border-slate-700 px-2 py-1">CPU</th>
                  <th className="border border-slate-700 px-2 py-1">GPU</th>
                  <th className="border border-slate-700 px-2 py-1">RAM</th>
                  <th className="border border-slate-700 px-2 py-1">Storage</th>
                  <th className="border border-slate-700 px-2 py-1">Harga</th>
                  <th className="border border-slate-700 px-2 py-1">Perf Score</th>
                  <th className="border border-slate-700 px-2 py-1">Value Score</th>
                  <th className="border border-slate-700 px-2 py-1">Note</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((l) => {
                  const isBest = l.id === result.best.id;
                  return (
                    <tr key={l.id} className={isBest ? 'bg-emerald-900/40' : ''}>
                      <td className="border border-slate-700 px-2 py-1">
                        {l.brand} {l.model}
                      </td>
                      <td className="border border-slate-700 px-2 py-1">
                        {l.cpu?.model ?? '-'}
                      </td>
                      <td className="border border-slate-700 px-2 py-1">
                        {l.gpu?.model ?? '-'}
                      </td>
                      <td className="border border-slate-700 px-2 py-1">
                        {l.ramGb ?? '-'} GB
                      </td>
                      <td className="border border-slate-700 px-2 py-1">
                        {l.storageGb ?? '-'} GB
                      </td>
                      <td className="border border-slate-700 px-2 py-1">
                        Rp{l.priceIdr?.toLocaleString('id-ID') ?? '-'}
                      </td>
                      <td className="border border-slate-700 px-2 py-1">
                        {l.perfScore.toFixed(3)}
                      </td>
                      <td className="border border-slate-700 px-2 py-1">
                        {l.valueScore.toFixed(1)}
                      </td>
                      <td className="border border-slate-700 px-2 py-1">
                        {isBest ? 'Paling worth it (value score tertinggi)' : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}