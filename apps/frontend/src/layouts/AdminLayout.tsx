import { NavLink, Outlet } from "react-router-dom";
import { useSessionStore } from "../store/sessionStore";

export function AdminLayout() {
  const sessionRoles = useSessionStore((state) => state.roles);
  const isAdmin = sessionRoles.includes("ADMIN");
  const adminLinks = [
    { to: "/admin", label: "Dashboard", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { to: "/admin/shows", label: "Shows", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
    ...(isAdmin
      ? [{ to: "/admin/venues", label: "Venues", icon: "M8 6.75V4.5m8 2.25V4.5M3.75 9.75h16.5M5.25 6h13.5A1.5 1.5 0 0120.25 7.5v11.25A1.5 1.5 0 0118.75 20.25H5.25a1.5 1.5 0 01-1.5-1.5V7.5A1.5 1.5 0 015.25 6zm3 7.5h7.5" }]
      : []),
    ...(isAdmin
      ? [{ to: "/admin/users", label: "Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-premium selection:bg-brand-500/30">
      <div className="flex min-h-screen">
        <aside className="fixed inset-y-0 left-0 w-80 flex flex-col border-r border-white/5 bg-premium shadow-2xl z-30">
          <div className="p-10 border-b border-white/5">
             <div className="flex items-center gap-4 group">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-all duration-300">
                   <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                   </svg>
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-500">Master Control</p>
                   <p className="font-display font-black text-2xl text-white">StagePass <span className="text-slate-500">HQ</span></p>
                </div>
             </div>
          </div>

          <nav className="flex-1 px-6 py-10 space-y-2 overflow-y-auto">
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-2xl px-6 py-4 transition-all duration-300 group ${
                    isActive 
                      ? "bg-white/5 text-white shadow-inner border border-white/10" 
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <svg className={`h-5 w-5 transition-colors duration-300 ${isActive ? 'text-brand-500' : 'text-slate-600 group-hover:text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                    </svg>
                    <span className="text-sm font-bold uppercase tracking-widest">{link.label}</span>
                    {isActive && (
                       <div className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500 shadow-[0_0_10px_#7c3aed]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="px-6 py-6 border-t border-white/5 space-y-4">
              <NavLink
                to="/"
                className="flex items-center gap-4 rounded-2xl px-6 py-4 text-slate-500 hover:text-white hover:bg-white/5 transition-all duration-300 group"
              >
                <svg className="h-5 w-5 text-slate-600 group-hover:text-brand-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm font-bold uppercase tracking-widest">Return to Site</span>
              </NavLink>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Integrity</p>
                 <div className="mt-2 flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-300">Operational</span>
                 </div>
              </div>
          </div>
        </aside>

        <main className="ml-80 flex-1 p-12 bg-surface-950">
           <div className="max-w-6xl mx-auto">
              <Outlet />
           </div>
        </main>
      </div>
    </div>
  );
}
