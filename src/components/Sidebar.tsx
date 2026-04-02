"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: "dashboard" },
    { name: "Builds", href: "/builds", icon: "memory" },
    { name: "Hardware", href: "/hardware", icon: "developer_board" },
    { name: "Benchmark", href: "/benchmark", icon: "speed" },
    { name: "Compare", href: "/compare", icon: "compare" },
    { name: "Settings", href: "/settings", icon: "settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col py-8 px-4 bg-background h-screen w-64 border-r-0 z-50">
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-bold tracking-tighter text-[#00E5FF] font-headline">Specmate</h1>
        <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant mt-1">Synthetic Architect</p>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-label text-sm ${
                isActive
                  ? "text-primary font-bold border-r-2 border-primary bg-gradient-to-r from-primary/10 to-transparent"
                  : "text-on-surface-variant font-medium hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-4">
        <button className="w-full py-3 bg-gradient-to-br from-primary to-secondary text-on-primary-fixed font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          New Build
        </button>
      </div>
    </aside>
  );
}