'use client';

import { useEffect, useState } from 'react';

type Phone = {
  id: number;
  brand: string;
  model: string;
  soc: string | null;
  ramGb: number | null;
  storageGb: number | null;
  batteryMah: number | null;
  benchmark: number | null;
  priceIdr: number | null;
};

type CompareResult = {
  items: (Phone & { valueScore: number })[];
  best: Phone & { valueScore: number };
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [phones, setPhones] = useState<Phone[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [result, setResult] = useState<CompareResult | null>(null);

  useEffect(() => {
    const fetchPhones = async () => {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      const res = await fetch('/api/phones?' + params.toString());
      const data = await res.json();
      setPhones(data);
    };
    fetchPhones();
  }, [query]);

  const toggleSelect = (id: number) => {
    setResult(null);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const compare = async () => {
    const res = await fetch('/api/phones/compare', {
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
        Device Value Comparator (Phones first)
      </h1>

      <div className="mb-4 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari HP (misal: Samsung, Redmi)..."
          className="px-3 py-2 rounded bg-slate-900 border border-slate-700 w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {phones.map((p) => {
          const selected = selectedIds.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggleSelect(p.id)}
              className={`text-left p-3 rounded border ${
                selected ? 'border-emerald-400 bg-slate-900' : 'border-slate-700 bg-slate-900/60'
              }`}
            >
              <div className="font-semibold">
                {p.brand} {p.model}
              </div>
              <div className="text-xs text-slate-400">
                SoC: {p.soc || '-'} | RAM: {p.ramGb ?? '-'} GB | Battery: {p.batteryMah ?? '-'} mAh
              </div>
              <div className="text-xs text-slate-400">
                Benchmark: {p.benchmark ?? '-'} | Harga: Rp{p.priceIdr?.toLocaleString('id-ID') ?? '-'}
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
                  <th className="border border-slate-700 px-2 py-1">Benchmark</th>
                  <th className="border border-slate-700 px-2 py-1">RAM</th>
                  <th className="border border-slate-700 px-2 py-1">Harga</th>
                  <th className="border border-slate-700 px-2 py-1">Value Score</th>
                  <th className="border border-slate-700 px-2 py-1">Note</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((p) => {
                  const isBest = p.id === result.best.id;
                  return (
                    <tr key={p.id} className={isBest ? 'bg-emerald-900/40' : ''}>
                      <td className="border border-slate-700 px-2 py-1">
                        {p.brand} {p.model}
                      </td>
                      <td className="border border-slate-700 px-2 py-1">{p.benchmark ?? '-'}</td>
                      <td className="border border-slate-700 px-2 py-1">{p.ramGb ?? '-'}</td>
                      <td className="border border-slate-700 px-2 py-1">
                        Rp{p.priceIdr?.toLocaleString('id-ID') ?? '-'}
                      </td>
                      <td className="border border-slate-700 px-2 py-1">
                        {p.valueScore.toFixed(6)}
                      </td>
                      <td className="border border-slate-700 px-2 py-1">
                        {isBest ? 'Paling worth it (menurut value score)' : ''}
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
