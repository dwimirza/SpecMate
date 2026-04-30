"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Info, ChevronDown, DollarSign, Calculator } from "lucide-react";
import { 
  computeProcessingScore, 
  computeMemoryScore, 
  computeDisplayScore, 
  computeBatteryScore, 
  formatPrice 
} from "@/lib/scoring";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface SpecDef {
    id: string;
    label: string;
    desc: string;
    weight: number;
}

export interface SpecValue {
    value: string;
    detail: string;
    score: number;
}

export interface LaptopItem {
    id: number;
    brand: string;
    name: string;
    price: number;
    priceStr: string;
    imageUrl?: string | null;
    specValues: Record<string, SpecValue>;
}

export interface LaptopRaw {
    id: number;
    brand: string;
    model: string;
    priceIdr: number | null;
    ramGb: number | null;
    storageGb: number | null;
    batteryWh: number | null;
    batteryHours: number | null;
    screenSizeInch: number | null;
    screenResolutionX: number | null;
    screenResolutionY: number | null;
    screenPanelType: string | null;
    screenRefreshRateHz: number | null;
    imageUrl?: string | null;
    cpu: { brand: string; model: string } | null;
    gpu: { brand: string; model: string } | null;
}

// ─── SPECS DEFINITION ─────────────────────────────────────────────────────────

const LAPTOP_SPECS: SpecDef[] = [
    {
        id: "processing",
        label: "Processing & Graphics",
        desc: "Skor gabungan dari tier CPU dan kemampuan GPU.",
        weight: 1.5,
    },
    {
        id: "memory",
        label: "Memory & Storage",
        desc: "RAM untuk multitasking dan kapasitas SSD.",
        weight: 1.2,
    },
    {
        id: "disp",
        label: "Display Quality",
        desc: "Ukuran layar, resolusi, refresh rate, dan tipe panel.",
        weight: 1.0,
    },
    {
        id: "batt",
        label: "Battery Life",
        desc: "Kapasitas baterai dalam Wh atau estimasi jam pemakaian.",
        weight: 1.0,
    },
];

// ─── CONVERT RAW TO LAPTOP ITEM ───────────────────────────────────────────────

function convertToLaptopItem(raw: LaptopRaw): LaptopItem {
    const cpuName = raw.cpu ? `${raw.cpu.brand} ${raw.cpu.model}` : "Unknown CPU";
    const gpuName = raw.gpu ? `${raw.gpu.brand} ${raw.gpu.model}` : "Integrated";

    const procScore = computeProcessingScore(cpuName, gpuName);
    const memScore = computeMemoryScore(raw.ramGb, raw.storageGb);
    const dispScore = computeDisplayScore(
        raw.screenResolutionX,
        raw.screenResolutionY,
        raw.screenRefreshRateHz,
        raw.screenPanelType
    );
    const battScore = computeBatteryScore(raw.batteryWh, raw.batteryHours);

    const priceStr = formatPrice(raw.priceIdr);

    const procValue = procScore > 80 ? "High-End" : procScore > 65 ? "Mid-Range" : "Entry-Level";
    const memValue = `${raw.ramGb ?? 0}GB / ${raw.storageGb ?? 0}GB`;
    let dispValue = "Unknown";
    let dispDetail = "Info layar tidak tersedia";
    if (raw.screenResolutionX && raw.screenResolutionY) {
        dispValue = `${raw.screenResolutionX}×${raw.screenResolutionY}`;
        dispDetail = `${raw.screenSizeInch ?? "?"}" · ${raw.screenResolutionX}×${raw.screenResolutionY}`;
        if (raw.screenRefreshRateHz) dispDetail += ` @ ${raw.screenRefreshRateHz}Hz`;
        if (raw.screenPanelType) dispDetail += ` (${raw.screenPanelType})`;
    }
    let battValue = "N/A";
    let battDetail = "Battery info not available";
    if (raw.batteryWh) {
        battValue = `${raw.batteryWh}Wh`;
        battDetail = `${raw.batteryWh}Wh`;
    }
    if (raw.batteryHours) {
        battValue = raw.batteryWh ? `${raw.batteryWh}Wh` : `${raw.batteryHours}h`;
        battDetail = `${raw.batteryWh ? `${raw.batteryWh}Wh ` : ""}(~${raw.batteryHours} jam)`;
    }

    return {
        id: raw.id,
        brand: raw.brand,
        name: raw.model.split(" (")[0],
        price: raw.priceIdr ?? 0,
        priceStr,
        imageUrl: raw.imageUrl,
        specValues: {
            processing: { value: procValue, detail: `${cpuName} + ${gpuName}`, score: procScore },
            memory: { value: memValue, detail: `${raw.ramGb ?? 0}GB RAM, ${raw.storageGb ?? 0}GB SSD`, score: memScore },
            disp: { value: dispValue, detail: dispDetail, score: dispScore },
            batt: { value: battValue, detail: battDetail, score: battScore },
        },
    };
}

// ─── VALUE RATING ─────────────────────────────────────────────────────────────

function calculateValueRating(item: LaptopItem): { totalPoints: number; valueScore: number } {
    let totalPoints = 0;
    LAPTOP_SPECS.forEach((spec) => {
        totalPoints += (item.specValues[spec.id]?.score ?? 0) * spec.weight;
    });
    const multiplier = item.price > 1_000_000 ? 1_000_000 : 10;
    const valueScore = Math.min((totalPoints / (item.price || 1)) * multiplier, 100);
    return { totalPoints, valueScore };
}

// ─── SUB COMPONENTS ───────────────────────────────────────────────────────────

function ProgressBar({
    score,
    isWinner,
    isTie,
    delay,
}: {
    score: number;
    isWinner: boolean;
    isTie: boolean;
    delay: number;
}) {
    const color = isWinner ? "bg-primary" : isTie ? "bg-on-surface-variant/40" : "bg-on-surface-variant/20";
    return (
        <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden mt-2.5">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.6, delay, ease: "easeOut" }}
                className={`h-full ${color} rounded-full`}
            />
        </div>
    );
}

function ValueCard({ item, isWinner }: { item: LaptopItem; isWinner: boolean }) {
    const { totalPoints, valueScore } = calculateValueRating(item);
    return (
        <div
            className={`p-6 rounded-2xl border-2 transition-colors ${
                isWinner
                    ? "border-primary bg-primary/5"
                    : "border-outline-variant/30 bg-surface-container"
            }`}
        >
            <div className="flex justify-between items-start mb-5 gap-3">
                <div className="flex gap-3 min-w-0">
                    {item.imageUrl && (
                        <div className="w-14 h-14 bg-surface rounded-lg border border-outline-variant/30 overflow-hidden flex-none">
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">
                            {item.brand}
                        </p>
                        <p className="font-headline font-bold text-on-surface text-base leading-snug line-clamp-2">
                            {item.name}
                        </p>
                    </div>
                </div>
                <p className="text-xl font-black text-on-surface whitespace-nowrap shrink-0">{item.priceStr}</p>
            </div>

            <div className="space-y-3 mb-5 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant">Total Performance Points</span>
                    <span className="font-bold text-on-surface">{Math.round(totalPoints)} pts</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-dashed border-outline-variant/30">
                    <span className="text-on-surface-variant">Cost per Point</span>
                    <span className="font-bold text-on-surface">
                        Rp {Math.round(item.price / totalPoints).toLocaleString("id-ID")}
                    </span>
                </div>
            </div>

            <div className="text-center">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Value Score</p>
                <p className={`text-5xl font-headline font-black mb-2 ${isWinner ? "text-primary" : "text-on-surface-variant"}`}>
                    {valueScore.toFixed(1)}
                </p>
                {isWinner && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        <DollarSign size={12} strokeWidth={3} />
                        Best Bang for Buck
                    </span>
                )}
            </div>
        </div>
    );
}

function WinnerSummary({ itemA, itemB }: { itemA: LaptopItem; itemB: LaptopItem }) {
    let aWins = 0;
    let bWins = 0;
    const aStrengths: string[] = [];
    const bStrengths: string[] = [];

    LAPTOP_SPECS.forEach((s) => {
        const sA = itemA.specValues[s.id]?.score ?? 0;
        const sB = itemB.specValues[s.id]?.score ?? 0;
        if (sA > sB + 5) { aWins++; aStrengths.push(s.label.toLowerCase()); }
        else if (sB > sA + 5) { bWins++; bStrengths.push(s.label.toLowerCase()); }
    });

    const valA = calculateValueRating(itemA).valueScore;
    const valB = calculateValueRating(itemB).valueScore;
    const betterValue = valA >= valB ? itemA : itemB;
    const betterPerf = aWins > bWins ? itemA : bWins > aWins ? itemB : null;
    const shortName = (l: LaptopItem) => l.name.split(" ").slice(0, 4).join(" ");

    return (
        <>
            <span className="text-white font-bold block mb-2 text-xl">The Bottom Line:</span>
            {betterPerf && betterValue.id === betterPerf.id ? (
                <span>
                    The <strong>{shortName(betterPerf)}</strong> is a rare win-win — it dominates in performance
                    while offering the best value for your money.
                </span>
            ) : betterPerf ? (
                <span>
                    The <strong>{shortName(betterPerf)}</strong> is the superior performer, winning in{" "}
                    {(betterPerf.id === itemA.id ? aStrengths : bStrengths).join(" and ")}. But the{" "}
                    <strong>{shortName(betterValue)}</strong> gives far better bang for buck if raw power isn't
                    your priority.
                </span>
            ) : (
                <span>
                    These two are neck-and-neck in performance. Go with the{" "}
                    <strong>{shortName(betterValue)}</strong> — it offers significantly better value for your
                    money.
                </span>
            )}
        </>
    );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

interface ComparisonTableProps {
  laptops: LaptopRaw[];
  preselectedIds?: number[];
}

export default function ComparisonTable({ laptops, preselectedIds = [] }: ComparisonTableProps) {
  const items = laptops.map(convertToLaptopItem);
  const [selectedIdA, setSelectedIdA] = useState<number>(() => {
    if (preselectedIds[0] && items.find(i => i.id === preselectedIds[0])) return preselectedIds[0];
    return items[0]?.id ?? 0;
  });
  const [selectedIdB, setSelectedIdB] = useState<number>(() => {
    if (preselectedIds[1] && items.find(i => i.id === preselectedIds[1])) return preselectedIds[1];
    return items[1]?.id ?? 0;
  });

    const itemA = items.find((l) => l.id === selectedIdA);
    const itemB = items.find((l) => l.id === selectedIdB);

    const valA = itemA ? calculateValueRating(itemA).valueScore : 0;
    const valB = itemB ? calculateValueRating(itemB).valueScore : 0;

    if (items.length < 2) {
        return (
            <div className="text-center py-24 text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl mb-4 block">laptop_mac</span>
                <p className="font-headline text-xl font-bold text-on-surface mb-2">Data laptop tidak cukup</p>
                <p className="text-sm">Minimal 2 laptop dibutuhkan untuk perbandingan.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* FORMULA EXPLANATION */}
            <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                    <Calculator size={18} className="text-primary mt-0.5 shrink-0" />
                    <div>
                        <p className="font-bold text-on-surface mb-1 text-sm">Cara kerja Value Score</p>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                            Setiap spec dinormalisasi ke skor 0–100, lalu dikalikan dengan bobot relevansinya
                            (misalnya CPU lebih berbobot dari portabilitas). Total poin tersebut dibagi harga
                            untuk mendapatkan <strong className="text-on-surface">Value Index</strong> — semakin
                            tinggi, semakin worth it.
                        </p>
                    </div>
                </div>
            </div>

            {/* SELECTORS */}
            <div className="bg-surface-container border border-outline-variant/30 rounded-2xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Device A */}
                    <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-outline-variant/20">
                        <label className="block text-xs font-bold tracking-widest text-on-surface-variant uppercase mb-2">
                            Device 1
                        </label>
                        <div className="relative">
                            <select
                                className="w-full appearance-none bg-surface-container-highest border border-outline-variant/30 text-on-surface font-semibold text-lg rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                                value={selectedIdA}
                                onChange={(e) => setSelectedIdA(Number(e.target.value))}
                            >
                                {items.map((l) => (
                                    <option key={l.id} value={l.id} disabled={l.id === selectedIdB}>
                                        {l.brand} {l.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
                        </div>
                    </div>

                    {/* VS Badge */}
                    <div className="hidden md:flex w-16 items-center justify-center">
                        <div className="w-10 h-10 bg-surface-container-highest border border-outline-variant/30 rounded-full flex items-center justify-center font-bold text-on-surface-variant text-sm">
                            VS
                        </div>
                    </div>

                    {/* Device B */}
                    <div className="flex-1 p-6">
                        <label className="block text-xs font-bold tracking-widest text-on-surface-variant uppercase mb-2">
                            Device 2
                        </label>
                        <div className="relative">
                            <select
                                className="w-full appearance-none bg-surface-container-highest border border-outline-variant/30 text-on-surface font-semibold text-lg rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                                value={selectedIdB}
                                onChange={(e) => setSelectedIdB(Number(e.target.value))}
                            >
                                {items.map((l) => (
                                    <option key={l.id} value={l.id} disabled={l.id === selectedIdA}>
                                        {l.brand} {l.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
                        </div>
                    </div>
                </div>
            </div>

            {/* HEAD-TO-HEAD SPECS */}
            {itemA && itemB && (
                <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-6 md:p-8">
                    <p className="text-xs font-bold tracking-widest text-on-surface-variant uppercase mb-8 text-center">
                        Head-to-Head Details
                    </p>
                    <div className="space-y-10">
                        {LAPTOP_SPECS.map((spec, index) => {
                            const dA = itemA.specValues[spec.id];
                            const dB = itemB.specValues[spec.id];
                            const sA = dA?.score ?? 0;
                            const sB = dB?.score ?? 0;
                            const isWinnerA = sA > sB;
                            const isWinnerB = sB > sA;
                            const isTie = sA === sB;

                            return (
                                <div key={spec.id} className="relative">
                                    {/* Desktop centered label */}
                                    <div className="hidden md:flex flex-col items-center justify-center absolute left-1/2 -translate-x-1/2 top-0 w-52 z-10 py-1 bg-surface-container">
                                        <div className="inline-flex items-center gap-1.5">
                                            <span className="text-sm font-bold text-on-surface">{spec.label}</span>
                                            <div className="group/tip relative">
                                                <Info size={13} className="text-on-surface-variant/50 cursor-help hover:text-primary" />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-on-surface text-background text-xs rounded-xl p-3 opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-50 text-center leading-relaxed shadow-xl">
                                                    {spec.desc}
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-on-surface" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile label */}
                                    <div className="md:hidden flex items-center justify-center mb-4">
                                        <span className="text-sm font-bold text-on-surface bg-surface-container-highest border border-outline-variant/30 px-3 py-1 rounded-lg">
                                            {spec.label}
                                        </span>
                                    </div>

                                    <div className="flex flex-col md:flex-row w-full gap-8 md:gap-16 pt-2">
                                        {/* A */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className={`font-bold text-lg ${isWinnerA ? "text-primary" : "text-on-surface"}`}>
                                                    {dA?.value ?? "N/A"}
                                                </span>
                                                <span className="text-xs font-bold text-on-surface-variant">{sA}/100</span>
                                            </div>
                                            <p className="text-sm text-on-surface-variant mt-1 min-h-[40px] leading-relaxed">
                                                {dA?.detail}
                                            </p>
                                            <ProgressBar score={sA} isWinner={isWinnerA} isTie={isTie} delay={index * 0.1} />
                                        </div>

                                        {/* B */}
                                        <div className="flex-1">
                                            <div className="flex flex-row-reverse justify-between items-baseline mb-1">
                                                <span className={`font-bold text-lg ${isWinnerB ? "text-primary" : "text-on-surface"}`}>
                                                    {dB?.value ?? "N/A"}
                                                </span>
                                                <span className="text-xs font-bold text-on-surface-variant">{sB}/100</span>
                                            </div>
                                            <p className="text-sm text-on-surface-variant mt-1 min-h-[40px] text-right leading-relaxed">
                                                {dB?.detail}
                                            </p>
                                            <div className="[transform:scaleX(-1)]">
                                                <ProgressBar score={sB} isWinner={isWinnerB} isTie={isTie} delay={index * 0.1} />
                                            </div>
                                        </div>
                                    </div>

                                    {index < LAPTOP_SPECS.length - 1 && (
                                        <hr className="mt-8 border-outline-variant/20" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* VALUE FORMULA */}
            {itemA && itemB && (
                <div className="border border-outline-variant/30 bg-surface-container rounded-2xl p-6 md:p-8">
                    <div className="flex items-center gap-2 justify-center mb-2">
                        <Calculator size={20} className="text-primary" />
                        <h3 className="text-xl font-headline font-bold text-on-surface">The "Worth It" Formula</h3>
                    </div>
                    <p className="text-center text-on-surface-variant text-sm mb-6">
                        Skor performa total dibagi harga. Makin tinggi, makin worth it.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ValueCard item={itemA} isWinner={valA > valB} />
                        <ValueCard item={itemB} isWinner={valB > valA} />
                    </div>
                </div>
            )}

            {/* VERDICT */}
            {itemA && itemB && (
                <div className="bg-on-surface rounded-2xl p-6 md:p-8 text-background">
                    <p className="text-xs font-bold tracking-widest text-background/50 uppercase mb-4 text-center">
                        Final Verdict
                    </p>
                    <div className="max-w-2xl mx-auto text-base leading-relaxed text-background/80 text-center font-medium">
                        <WinnerSummary itemA={itemA} itemB={itemB} />
                    </div>
                </div>
            )}
        </div>
    );
}