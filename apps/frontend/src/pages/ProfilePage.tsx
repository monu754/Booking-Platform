import { useSessionStore } from "../store/sessionStore";
import { SectionHeader } from "../components/SectionHeader";

export function ProfilePage() {
  const { userName, email, roles } = useSessionStore();

  return (
    <div className="space-y-16">
      <SectionHeader
        eyebrow="Identity Control"
        title="Your StagePass Profile."
        description="Manage your credentials and access levels within the platform."
      />

      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-[40px] border border-surface-200 bg-white shadow-premium">
          <div className="relative h-40 bg-premium">
             <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-transparent" />
             <div className="absolute -bottom-16 left-12 h-32 w-32 rounded-3xl bg-white p-2 shadow-xl">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-surface-50 text-4xl font-black text-brand-600">
                   {userName?.charAt(0) ?? 'U'}
                </div>
             </div>
          </div>
          
          <div className="pt-24 pb-12 px-12">
            <div className="flex flex-wrap items-end justify-between gap-8">
               <div>
                  <h1 className="font-display text-4xl font-black text-premium">{userName}</h1>
                  <p className="mt-1 text-lg font-medium text-slate-400">{email}</p>
               </div>
               <div className="flex flex-wrap gap-2">
                  {roles.map(role => (
                    <span key={role} className="rounded-full bg-brand-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-600 border border-brand-100">
                       {role}
                    </span>
                  ))}
               </div>
            </div>

            <div className="mt-16 grid gap-8 border-t border-surface-100 pt-12 md:grid-cols-2">
               <div className="group rounded-3xl border border-surface-100 p-8 transition-colors hover:border-brand-100 hover:bg-surface-50/50">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Account Security</p>
                  <h3 className="text-lg font-black text-premium mb-2">Privacy & Authentication</h3>
                  <p className="text-sm text-slate-400 mb-6">Your data is secured with AES-256 equivalent synchronization protocols.</p>
                  <button className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors">Modify Credentials →</button>
               </div>
               <div className="group rounded-3xl border border-surface-100 p-8 transition-colors hover:border-brand-100 hover:bg-surface-50/50">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Loyalty Tier</p>
                  <h3 className="text-lg font-black text-premium mb-2">Exclusive Benefits</h3>
                  <p className="text-sm text-slate-400 mb-6">You are currently accessing the platform with {roles.includes('ADMIN') ? 'Full Administrative' : 'Standard Member'} permissions.</p>
                  <button className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors">View Tier Perks →</button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

