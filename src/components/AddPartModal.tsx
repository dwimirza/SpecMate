"use client";

// components/AddPartModal.tsx
import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Search, Download, Check, Loader2 } from "lucide-react";

interface CsvLaptop {
    name: string;
    brand: string;
    price: number;
    cpu: string;
    ram: string;
    storage: string;
    gpu: string;
    imageUrl?: string;
}

interface AddPartModalProps {
    open: boolean;
    onClose: () => void;
    onImported: () => void; // called after successful import so page can refresh
}

export default function AddPartModal({ open, onClose, onImported }: AddPartModalProps) {
    const [laptops, setLaptops] = useState<CsvLaptop[]>([]);
    const [filtered, setFiltered] = useState<CsvLaptop[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [importing, startImport] = useTransition();
    const [importStatus, setImportStatus] = useState<{ imported: number; skipped: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Load CSV preview when modal opens
    useEffect(() => {
        if (!open) return;
        setLoading(true);
        setImportStatus(null);
        setError(null);
        fetch("/api/laptops/import")
            .then((r) => r.json())
            .then((data) => {
                if (data.error) { setError(data.error); return; }
                setLaptops(data.laptops ?? []);
                setFiltered(data.laptops ?? []);
            })
            .catch(() => setError("Gagal membaca CSV"))
            .finally(() => setLoading(false));
    }, [open]);

    // Filter by search
    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(
            q
                ? laptops.filter(
                    (l) =>
                        l.name.toLowerCase().includes(q) ||
                        l.brand.toLowerCase().includes(q) ||
                        l.cpu?.toLowerCase().includes(q) ||
                        l.gpu?.toLowerCase().includes(q)
                )
                : laptops
        );
    }, [search, laptops]);

    function handleImportAll() {
        startImport(async () => {
            setError(null);
            const res = await fetch("/api/laptops/import", { method: "POST" });
            const data = await res.json();
            if (data.error) { setError(data.error); return; }
            setImportStatus({ imported: data.imported, skipped: data.skipped });
            onImported();
        });
    }

    const rpFormatter = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.97 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-surface border border-outline-variant/30 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col pointer-events-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
                                <div>
                                    <h2 className="font-headline font-bold text-xl text-on-surface">Add Parts from CSV</h2>
                                    <p className="text-sm text-on-surface-variant mt-0.5">
                                        {laptops.length} laptop ditemukan di <code className="text-xs bg-surface-container px-1.5 py-0.5 rounded">data/laptops.csv</code>
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors"
                                >
                                    <X size={18} className="text-on-surface-variant" />
                                </button>
                            </div>

                            {/* Search */}
                            <div className="p-4 border-b border-outline-variant/20">
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                                    <input
                                        type="text"
                                        placeholder="Cari laptop, CPU, GPU..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full bg-surface-container border border-outline-variant/30 rounded-xl pl-9 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/40"
                                    />
                                </div>
                            </div>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {loading && (
                                    <div className="flex items-center justify-center py-16 text-on-surface-variant">
                                        <Loader2 size={24} className="animate-spin mr-2" />
                                        <span className="text-sm">Membaca CSV...</span>
                                    </div>
                                )}

                                {error && (
                                    <div className="bg-error/10 border border-error/30 rounded-xl p-4 text-sm text-error">
                                        {error}
                                    </div>
                                )}

                                {!loading && !error && filtered.length === 0 && (
                                    <div className="text-center py-12 text-on-surface-variant text-sm">
                                        Tidak ada laptop yang cocok
                                    </div>
                                )}

                                {!loading && filtered.map((laptop, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-surface-container border border-outline-variant/20 hover:border-outline-variant/50 transition-colors"
                                    >
                                        {laptop.imageUrl && (
                                            <img
                                                src={laptop.imageUrl}
                                                alt={laptop.name}
                                                className="w-12 h-12 object-contain rounded-lg bg-white flex-none"
                                                referrerPolicy="no-referrer"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-on-surface text-sm truncate">{laptop.name}</p>
                                            <p className="text-xs text-on-surface-variant truncate">
                                                {laptop.cpu} · {laptop.gpu}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-bold text-on-surface">
                                                {!laptop.price
                                                    ? "N/A"
                                                    : laptop.price > 1000
                                                        ? rpFormatter.format(laptop.price)
                                                        : `$${laptop.price.toLocaleString()}`}
                                            </p>
                                            <p className="text-xs text-on-surface-variant">{laptop.ram} · {laptop.storage}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-outline-variant/20">
                                {importStatus ? (
                                    <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 text-sm text-primary font-medium">
                                        <Check size={16} />
                                        {importStatus.imported} laptop berhasil diimport
                                        {importStatus.skipped > 0 && `, ${importStatus.skipped} dilewati`}.
                                        Refresh halaman untuk melihat perubahan.
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleImportAll}
                                        disabled={importing || loading || laptops.length === 0}
                                        className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-bold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {importing ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                Mengimport...
                                            </>
                                        ) : (
                                            <>
                                                <Download size={16} />
                                                Import semua {laptops.length} laptop ke database
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}