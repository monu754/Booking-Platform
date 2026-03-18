import { StatsCard } from "../../components/StatsCard";

const metrics = [
  { label: "Aggregate Revenue", value: "₹ 12.48L", helper: "Synchronized from successful traces.", color: "text-accent-gold" },
  { label: "Active Reservations", value: "1,284", helper: "Total secured seats across inventory.", color: "text-accent-emerald" },
  { label: "Platform Throughput", value: "99.2%", helper: "System stability and request success rate.", color: "text-accent-royal" },
];

export function DashboardPage() {
  return (
    <div className="space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-500 mb-2">Operational Intelligence</p>
          <h1 className="font-display text-6xl font-black text-white leading-tight">HQ Overview</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-400 leading-relaxed font-medium">
            Real-time performance metrics and system diagnostics. Deep visibility into the platform's commercial health.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-accent-emerald animate-pulse" />
          </div>
          <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white flex items-center gap-3">
             <span className="h-1.5 w-1.5 rounded-full bg-accent-gold" />
             Live Updates Active
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="group rounded-[40px] border border-white/5 bg-white/5 p-10 hover:border-white/10 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{metric.label}</p>
            <h2 className={`font-display text-5xl font-black tracking-tighter ${metric.color} group-hover:scale-105 transition-transform duration-500`}>
              {metric.value}
            </h2>
            <p className="mt-4 text-xs font-medium text-slate-400 line-clamp-1">{metric.helper}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
         <div className="rounded-[40px] border border-white/5 bg-white/5 p-10 hover:border-white/10 transition-all duration-500 group">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 text-shadow-sm">Commercial Velocity</h3>
              <span className="text-[10px] font-black text-accent-emerald bg-emerald-500/10 px-3 py-1 rounded-full uppercase">Up 12.4%</span>
            </div>
            <div className="aspect-[16/7] rounded-[32px] bg-black/20 border border-white/5 flex items-end justify-between p-6 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-accent-royal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((h, i) => (
                 <div 
                   key={i} 
                   className="w-full mx-1 bg-accent-royal/40 rounded-t-lg transition-all duration-1000 group-hover:bg-accent-royal" 
                   style={{ height: `${h}%` }} 
                 />
               ))}
            </div>
         </div>
         <div className="rounded-[40px] border border-white/5 bg-white/5 p-10 hover:border-white/10 transition-all duration-500 group">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Resource Acquisition</h3>
              <span className="text-[10px] font-black text-accent-gold bg-amber-500/10 px-3 py-1 rounded-full uppercase">Optimized</span>
            </div>
            <div className="aspect-[16/7] rounded-[32px] bg-black/20 border border-white/5 flex items-center justify-center gap-6 p-6 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-accent-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <div className="h-32 w-32 rounded-full border-[10px] border-white/5 border-t-accent-gold group-hover:rotate-180 transition-transform duration-1000 flex items-center justify-center">
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

