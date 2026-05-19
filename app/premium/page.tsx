const premiumFeatures = [
    "Unlimited AI Coach",
    "Advanced Analysis",
    "Premium Themes",
    "Opening Explorer",
    "Cloud Save",
  ];
  
  export default function PremiumPage() {
    return (
      <div className="min-h-screen bg-[#060608] p-8 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/20 to-fuchsia-500/10 p-10">
            <p className="text-sm uppercase tracking-widest text-violet-300">
              Premium
            </p>
  
            <h1 className="mt-4 text-5xl font-bold">
              Upgrade your chess experience
            </h1>
  
            <p className="mt-4 max-w-2xl text-zinc-300">
              Unlock advanced tools, deeper analysis,
              and premium customization features.
            </p>
  
            <div className="mt-8 space-y-4">
              {premiumFeatures.map((feature) => (
                <div
                  key={feature}
                  className="rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  {feature}
                </div>
              ))}
            </div>
  
            <button className="mt-8 rounded-2xl bg-violet-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-violet-500">
              Upgrade Now — $4.99/mo
            </button>
          </div>
        </div>
      </div>
    );
  }