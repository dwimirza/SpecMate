"use client";

// src/app/compare/page.tsx
// Client component karena butuh state untuk modal dan refresh data

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ComparisonTable from "@/components/ComparisonTable";
import PriceHistory from "@/components/PriceHistory";
import AddPartModal from "@/components/AddPartModal";
import { LaptopRaw } from "@/components/ComparisonTable";

export default function ComparePage() {
    const [laptops, setLaptops] = useState<LaptopRaw[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchLaptops = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/laptops");
            const data = await res.json();
            setLaptops(data.laptops ?? []);
        } catch (e) {
            console.error("Failed to fetch laptops", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLaptops();
    }, [fetchLaptops]);

    function handleImported() {
        setModalOpen(false);
        fetchLaptops(); // refresh list after import
    }

    return (
        <>
            <Sidebar />
            <Header />
            <main className="ml-64 pt-16 flex-1 p-8 bg-background min-h-screen">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-5xl font-headline font-bold tracking-tight text-on-surface mb-2">
                            Compare Parts
                        </h1>
                        <p className="text-on-surface-variant font-body">
                            Cross-reference technical performance data and market pricing.
                        </p>
                    </div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-surface-container-highest border border-outline-variant/30 px-6 py-3 rounded-xl font-label text-sm font-bold flex items-center gap-3 hover:bg-surface-bright transition-all"
                    >
                        <span className="material-symbols-outlined text-primary">add_circle</span>
                        Add another part...
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-32 text-on-surface-variant">
                        <span className="material-symbols-outlined animate-spin text-4xl mr-3">progress_activity</span>
                        <span className="text-lg">Loading laptops...</span>
                    </div>
                ) : (
                    <ComparisonTable laptops={laptops} />
                )}

                <PriceHistory />
            </main>

            <AddPartModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onImported={handleImported}
            />
        </>
    );
}