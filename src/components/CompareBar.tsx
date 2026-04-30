'use client';
import { AnimatePresence, motion } from 'motion/react';
import { LaptopItem } from '@/lib/types';

export default function CompareBar({ compareIds, laptops, onRemove, onGo }: { compareIds: number[]; laptops: LaptopItem[]; onRemove: (id: number) => void; onGo: () => void }) {
  const selected = compareIds.map(id => laptops.find(l => l.id === id)).filter(Boolean) as LaptopItem[];
  if (compareIds.length === 0) return null;
  return (
    <AnimatePresence>
      {compareIds.length > 0 && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-on-surface text-background rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-4 min-w-[340px]">
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-widest text-background/50 whitespace-nowrap">Compare:</span>
            {selected.map(l => (
              <div key={l.id} className="flex items-center gap-1.5 bg-background/10 rounded-lg px-2.5 py-1">
                <span className="text-xs font-semibold text-background truncate max-w-[100px]">{l.brand} {l.name.split(' ')[1]}</span>
                <button onClick={() => onRemove(l.id)} className="text-background/50 hover:text-background">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ))}
            {compareIds.length < 2 && <span className="text-xs text-background/40 italic">+ pilih 1 lagi</span>}
          </div>
          <button onClick={onGo} disabled={compareIds.length < 2}
            className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${compareIds.length >= 2 ? 'bg-primary text-on-primary hover:opacity-90 active:scale-95' : 'bg-background/10 text-background/30 cursor-not-allowed'}`}>
            <span className="material-symbols-outlined text-sm">compare</span>
            Bandingkan
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}