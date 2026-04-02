import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative px-12 pt-24 pb-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -mr-96 -mt-96 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] -ml-48 -mb-48 pointer-events-none"></div>
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <h2 className="text-8xl font-black font-headline tracking-tighter leading-[0.9] mb-8 bg-gradient-to-br from-white via-primary to-secondary bg-clip-text text-transparent">
            Specmate
          </h2>
          <p className="text-xl text-on-surface-variant leading-relaxed max-w-xl mb-12 font-body font-light">
            Build, compare, and optimize your dream PC with real-time IDR pricing, AI recommendations, and performance analysis.
          </p>
          <div className="flex flex-wrap gap-6">
            <button className="px-10 py-4 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-bold rounded-xl text-lg hover:shadow-[0_0_30px_rgba(129,236,255,0.4)] transition-all">
              Start Building
            </button>
            <button className="px-10 py-4 border border-outline-variant text-primary font-bold rounded-xl text-lg hover:bg-primary/10 transition-all">
              Browse Parts
            </button>
          </div>
        </div>
        <div className="lg:col-span-5 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative aspect-square glass-panel rounded-[2rem] overflow-hidden neon-border-active">
            <Image
              alt="Futuristic PC Build"
              className="w-full h-full object-cover mix-blend-overlay opacity-60"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2rlScmkm3rw_zNHw52Y1KYoVx3MDpoc3KT-OA7CZbAwcRqb635AgzbArXg5I9YYXuNyAtBKX1B6z1h0HlbO7aFyzECwJNgrIMo85X-mGaLVCZ5uxMosju3e-6RiooARAU0TKmCO_3-mnz96MCMN19pK04LGS3ZSdN6eIjLwrYrwkmRWM-EHPjF2Va-m7TJ93V9HxF7NjsIJI4teZgeASaJTydNpKns4MnnCfiy2bT4rSe4ZangSwbtOYyIxWReOjYocbQxGsOjQ"
              width={800}
              height={800}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-background to-transparent">
              <span className="text-[10px] font-label text-primary tracking-[0.3em] uppercase mb-2">Live Benchmark</span>
              <h3 className="text-3xl font-headline font-bold text-white mb-1">RTX 4090 TI System</h3>
              <p className="text-on-surface-variant font-label text-sm">Synthetic Score: 24,942</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}