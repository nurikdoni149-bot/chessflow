export default function AnalysisPage() {
    return (
      <div className="min-h-screen bg-[#060608] p-8 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold">
            Game Analysis
          </h1>
  
          <p className="mt-2 text-zinc-400">
            Review your performance with AI.
          </p>
  
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm uppercase tracking-wider text-violet-400">
                Accuracy
              </p>
  
              <h2 className="mt-2 text-5xl font-bold">
                84%
              </h2>
            </div>
  
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm uppercase tracking-wider text-red-400">
                Blunders
              </p>
  
              <h2 className="mt-2 text-5xl font-bold">
                2
              </h2>
            </div>
  
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm uppercase tracking-wider text-emerald-400">
                Best Moves
              </p>
  
              <h2 className="mt-2 text-5xl font-bold">
                14
              </h2>
            </div>
  
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm uppercase tracking-wider text-yellow-400">
                Mistakes
              </p>
  
              <h2 className="mt-2 text-5xl font-bold">
                5
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }