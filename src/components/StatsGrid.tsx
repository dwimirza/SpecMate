export default function StatsGrid() {
  const stats = [
    { icon: "category", value: "50k+", label: "PC Parts Cached", color: "text-primary" },
    { icon: "layers", value: "8", label: "Main Categories", color: "text-secondary" },
    { icon: "payments", value: "LIVE", label: "Real-time Pricing", color: "text-primary" },
    { icon: "auto_awesome", value: "AI", label: "Logic Powered", color: "text-tertiary" },
  ];

  return (
    <section className="px-12 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-48 hover:bg-surface-container transition-colors border border-outline-variant/10"
          >
            <span className={`material-symbols-outlined ${stat.color} mb-4`} style={{ fontSize: 32 }}>
              {stat.icon}
            </span>
            <div>
              <h4 className="text-4xl font-headline font-bold mb-1">{stat.value}</h4>
              <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}