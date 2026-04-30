'use client';
import { motion } from 'motion/react';
import { LaptopItem } from '@/lib/types'; // nanti buat tipe
import { formatPrice, computeOverallScore } from '@/lib/scoring';

interface ProductCardProps {
  laptop: LaptopItem;
  isSelected: boolean;
  onToggleCompare: (id: number) => void;
  onDetail: (id: number) => void;
  compareDisabled: boolean;
}

export default function ProductCard({ laptop, isSelected, onToggleCompare, onDetail, compareDisabled }: ProductCardProps) {
  const overallScore = computeOverallScore({
    processing: laptop.specValues.processing.score,
    memory: laptop.specValues.memory.score,
    display: laptop.specValues.disp.score,
    battery: laptop.specValues.batt.score,
  });
  const tier = overallScore >= 80 ? 'High-End' : overallScore >= 65 ? 'Mid-Range' : 'Entry-Level';
  const tierClass = overallScore >= 80 ? 'bg-primary/10 text-primary border-primary/20' : overallScore >= 65 ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-surface-container-highest text-on-surface-variant border-outline-variant/30';

  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
      className={`bg-surface-container rounded-2xl border flex flex-col overflow-hidden transition-all duration-200 hover:bg-surface-container-high hover:-translate-y-0.5 ${isSelected ? 'border-primary/50 ring-1 ring-primary/20' : 'border-outline-variant/30'}`}>
      <div className="relative p-3 pb-0">
        <div className="w-full h-40 bg-surface-container-highest flex items-center justify-center overflow-hidden rounded-xl">
          {laptop.imageUrl ? (
            <img src={laptop.imageUrl} alt={laptop.name} className="object-contain w-full h-full p-3" />
          ) : (
            <div className="w-full h-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl">laptop</span>
            </div>
          )}
        </div>
        <span className={`absolute top-5 right-5 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide font-label ${tierClass}`}>{tier}</span>
      </div>
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.15em] mb-0.5 font-label">{laptop.brand}</p>
          <h3 className="font-bold text-on-surface text-sm leading-snug line-clamp-2 min-h-[36px] font-headline">{laptop.name}</h3>
        </div>
        <p className="text-xl font-black text-on-surface font-headline">{laptop.priceStr}</p>
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-on-surface-variant font-label">Overall Score</span>
            <span className="text-xs font-bold text-primary">{overallScore}/100</span>
          </div>
          <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${overallScore}%` }} transition={{ duration: 0.5 }} className="h-full rounded-full bg-primary" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {[
            { label: 'Processing', score: laptop.specValues.processing.score },
            { label: 'Memory', score: laptop.specValues.memory.score },
            { label: 'Display', score: laptop.specValues.disp.score },
            { label: 'Battery', score: laptop.specValues.batt.score },
          ].map(s => (
            <div key={s.label}>
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-on-surface-variant font-label">{s.label}</span>
                <span className="text-[10px] font-bold text-on-surface-variant">{s.score}</span>
              </div>
              <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${s.score}%` }} transition={{ duration: 0.4 }} className="h-full bg-primary/40 rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <div className="flex items-center gap-1 bg-surface-container-highest border border-outline-variant/20 rounded-lg px-2 py-1">
            <span className="material-symbols-outlined text-on-surface-variant text-xs">memory</span>
            <span className="text-[11px] truncate max-w-[110px]">{laptop.specValues.processing.detail.split('+')[0]}</span>
          </div>
          <div className="flex items-center gap-1 bg-surface-container-highest border border-outline-variant/20 rounded-lg px-2 py-1">
            <span className="material-symbols-outlined text-on-surface-variant text-xs">hard_drive</span>
            <span className="text-[11px]">{laptop.specValues.memory.value}</span>
          </div>
          {laptop.specValues.disp.value !== 'Unknown' && (
            <div className="flex items-center gap-1 bg-surface-container-highest border border-outline-variant/20 rounded-lg px-2 py-1">
              <span className="material-symbols-outlined text-on-surface-variant text-xs">monitor</span>
              <span className="text-[11px]">{laptop.specValues.disp.value.split('×')[0]}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-auto pt-1">
          <button onClick={() => onDetail(laptop.id)} className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-on-primary text-xs font-bold py-2.5 px-3 rounded-xl transition-all active:scale-95 hover:opacity-90">
            Detail
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
          <button onClick={() => onToggleCompare(laptop.id)} disabled={compareDisabled && !isSelected}
            className={`flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-3 rounded-xl border transition-all active:scale-95 ${isSelected ? 'bg-primary/10 text-primary border-primary/30' : compareDisabled ? 'bg-surface-container-highest text-on-surface-variant/30 border-outline-variant/20 cursor-not-allowed' : 'bg-surface-container-highest text-on-surface-variant border-outline-variant/30 hover:border-primary/30 hover:text-primary'}`}>
            <span className="material-symbols-outlined text-sm">{isSelected ? 'check_circle' : 'compare'}</span>
            {isSelected ? 'Added' : 'Compare'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}