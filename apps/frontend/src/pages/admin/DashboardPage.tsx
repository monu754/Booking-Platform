const metrics = [
  { label: "Aggregate Revenue", value: "Rs 12.48L", helper: "Synchronized from successful traces.", color: "text-accent-gold" },
  { label: "Active Reservations", value: "1,284", helper: "Total secured seats across inventory.", color: "text-accent-emerald" },
  { label: "Platform Throughput", value: "99.2%", helper: "System stability and request success rate.", color: "text-accent-royal" },
];

export function DashboardPage() {
  return (
    <div className="space-y-16">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.4em] text-brand-500">Operational Intelligence</p>
          <h1 className="font-display text-6xl font-black leading-tight text-white">HQ Overview</h1>
          <p className="mt-4 max-w-xl text-lg font-medium leading-relaxed text-slate-400">
            Real-time performance metrics and system diagnostics. Deep visibility into the platform's commercial health.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <div className="h-2 w-2 rounded-full bg-accent-emerald animate-pulse" />
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-gold" />
            Live Updates Active
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="group rounded-[40px] border border-white/5 bg-white/5 p-10 transition-all duration-500 hover:border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{metric.label}</p>
            <h2 className={`font-display text-5xl font-black tracking-tighter transition-transform duration-500 group-hover:scale-105 ${metric.color}`}>
              {metric.value}
            </h2>
            <p className="mt-4 line-clamp-1 text-xs font-medium text-slate-400">{metric.helper}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="group rounded-[40px] border border-white/5 bg-white/5 p-10 transition-all duration-500 hover:border-white/10">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Commercial Velocity</h3>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase text-accent-emerald">Up 12.4%</span>
          </div>
          <div className="relative flex aspect-[16/7] items-end justify-between overflow-hidden rounded-[32px] border border-white/5 bg-black/20 p-6">
            <div className="absolute inset-0 bg-gradient-to-t from-accent-royal/20 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((height, index) => (
              <div
                key={index}
                className="mx-1 w-full rounded-t-lg bg-accent-royal/40 transition-all duration-1000 group-hover:bg-accent-royal"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        <div className="group rounded-[40px] border border-white/5 bg-white/5 p-10 transition-all duration-500 hover:border-white/10">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Resource Acquisition</h3>
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase text-accent-gold">Optimized</span>
          </div>
          <div className="relative flex aspect-[16/7] items-center justify-center gap-6 overflow-hidden rounded-[32px] border border-white/5 bg-black/20 p-6">
            <div className="absolute inset-0 bg-gradient-to-t from-accent-gold/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-[10px] border-white/5 border-t-accent-gold">
              <span className="text-xl font-black text-white">84%</span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-accent-gold" />
                <span className="text-xs font-bold text-slate-400">Mobile Traffic</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-white/10" />
                <span className="text-xs font-bold text-slate-400">Desktop Growth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
