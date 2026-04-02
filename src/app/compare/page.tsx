import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ComparisonTable from "@/components/ComparisonTable";
import PriceHistory from "@/components/PriceHistory";

export default function ComparePage() {
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
                    <button className="bg-surface-container-highest border border-outline-variant/30 px-6 py-3 rounded-xl font-label text-sm font-bold flex items-center gap-3 hover:bg-surface-bright transition-all">
                        <span className="material-symbols-outlined text-primary">add_circle</span>
                        Add another part...
                    </button>
                </div>
                <ComparisonTable />
                <PriceHistory />
            </main>
        </>
    );
}