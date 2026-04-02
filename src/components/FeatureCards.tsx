export default function FeatureCards() {
  const features = [
    {
      icon: "search_insights",
      title: "Browse Parts",
      description: "Access our massive database with advanced filtering for compatibility, thermal performance, and wattage requirements.",
      link: "#",
      linkText: "Explore Catalog",
      color: "text-primary",
      bgColor: "bg-primary/10",
      gradient: false,
    },
    {
      icon: "settings_input_component",
      title: "PC Builder",
      description: "The industry's most advanced compatibility engine. Build with confidence knowing every part works perfectly together.",
      link: "#",
      linkText: "Launch Builder",
      color: "text-primary",
      bgColor: "bg-primary",
      gradient: true,
    },
    {
      icon: "compare_arrows",
      title: "Compare",
      description: "Side-by-side performance metrics, pricing history, and every part works perfectly together.",
      link: "#",
      linkText: "Run Comparison",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      gradient: false,
    },
  ];

  return (
    <section className="px-12 py-24">
      <div className="mb-16">
        <h2 className="text-5xl font-headline font-bold tracking-tight mb-4">Everything You Need</h2>
        <p className="text-on-surface-variant font-body max-w-2xl">
          The most comprehensive suite of tools for hardware enthusiasts, system integrators, and first-time builders.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={`group ${feature.gradient ? "bg-gradient-to-br from-primary/20 to-secondary/20" : "bg-surface-container"} p-1 rounded-3xl transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]`}
          >
            <div className={`${feature.gradient ? "bg-surface-container-lowest" : "bg-surface-container-low"} rounded-[1.4rem] p-10 h-full relative overflow-hidden`}>
              <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <span className={`material-symbols-outlined ${feature.color} text-3xl`}>{feature.icon}</span>
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4">{feature.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8">{feature.description}</p>
              <a className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest font-label" href={feature.link}>
                {feature.linkText}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}