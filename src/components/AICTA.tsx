import Image from "next/image";

export default function AICTA() {
  return (
    <section className="px-12 pb-24">
      <div className="relative bg-surface-container-low rounded-[2rem] overflow-hidden border border-outline-variant/10">
        <div className="absolute inset-0 opacity-10">
          <Image
            alt="Abstract AI Visualization"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBgsFXIP8klaPsN2RJNNOdKGi51n8hta3VUXxVZ1VpcUcI4dI5Wa03qzzVj2RbUSZGNluanCQ-7aAd6gCH8LEIkBGz8n9u46rZZJBiOar9ew0ACKhVzPdJL-Q9aI3c8s-G7ZxxEOk3hG7ATS3WfNfQvUDG2mGy2oFnCdOY4_bZjEcgVLXzYFmspQoveDv_6VTqzkP-l1qJXVMyVWJUIKMoyyQhmKcCfbE-mBkZjjBO4Ghem11ykMP0k5jC3jz8Ch0Cw4A5UWHM2w"
            width={1200}
            height={600}
          />
        </div>
        <div className="relative z-10 px-12 py-20 flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
          <h2 className="text-5xl font-headline font-bold mb-6 tracking-tight">AI-Powered Recommendations</h2>
          <p className="text-on-surface-variant text-lg font-body mb-10 leading-relaxed">
            Input your budget and primary use case, and let our Synthetic Architect neural model curate the most optimized configuration based on real-world telemetry and price-to-performance algorithms.
          </p>
          <button className="px-12 py-5 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-bold rounded-xl text-lg hover:scale-105 transition-transform">
            Try AI Recommender
          </button>
        </div>
      </div>
    </section>
  );
}