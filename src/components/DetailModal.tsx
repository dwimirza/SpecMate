'use client';
import { LaptopItem } from '@/lib/types';
import { computeOverallScore } from '@/lib/scoring';

export default function DetailModal({ product, onClose, onCompare }: { product: LaptopItem | null; onClose: () => void; onCompare: (id: number) => void }) {
  if (!product) return null;
  const overall = computeOverallScore({
    processing: product.specValues.processing.score,
    memory: product.specValues.memory.score,
    display: product.specValues.disp.score,
    battery: product.specValues.batt.score,
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-container border border-outline-variant/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-surface-container border-b border-outline-variant/30 p-4 flex justify-between items-center">
          <h3 className="text-xl font-headline font-bold text-on-surface">Detail Produk</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex gap-4 items-start">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-32 h-32 object-contain bg-surface-container-highest rounded-xl p-2" />
            ) : (
              <div className="w-32 h-32 bg-surface-container-highest rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant">laptop</span>
              </div>
            )}
            <div className="flex-1">
              <p className="text-primary text-xs font-bold uppercase tracking-wider">{product.brand}</p>
              <h4 className="text-xl font-bold text-on-surface">{product.name}</h4>
              <p className="text-2xl font-black text-on-surface mt-1">{product.priceStr}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${overall}%` }} />
                </div>
                <span className="text-sm font-bold text-primary">{overall}/100</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-highest rounded-xl p-3">
              <p className="text-xs font-bold text-primary uppercase">Processor & GPU</p>
              <p className="text-sm mt-1">{product.specValues.processing.detail}</p>
              <p className="text-xs text-on-surface-variant mt-1">Score: {product.specValues.processing.score}/100</p>
            </div>
            <div className="bg-surface-container-highest rounded-xl p-3">
              <p className="text-xs font-bold text-primary uppercase">Memory & Storage</p>
              <p className="text-sm mt-1">{product.specValues.memory.detail}</p>
              <p className="text-xs text-on-surface-variant mt-1">Score: {product.specValues.memory.score}/100</p>
            </div>
            <div className="bg-surface-container-highest rounded-xl p-3">
              <p className="text-xs font-bold text-primary uppercase">Display</p>
              <p className="text-sm mt-1">{product.specValues.disp.detail}</p>
              <p className="text-xs text-on-surface-variant mt-1">Score: {product.specValues.disp.score}/100</p>
            </div>
            <div className="bg-surface-container-highest rounded-xl p-3">
              <p className="text-xs font-bold text-primary uppercase">Battery</p>
              <p className="text-sm mt-1">{product.specValues.batt.detail}</p>
              <p className="text-xs text-on-surface-variant mt-1">Score: {product.specValues.batt.score}/100</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => onCompare(product.id)} className="px-5 py-2 rounded-xl border border-primary text-primary font-bold hover:bg-primary/10 transition">
              Compare
            </button>
            <button onClick={onClose} className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 transition">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}