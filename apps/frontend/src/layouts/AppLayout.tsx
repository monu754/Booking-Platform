import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useSessionStore } from "../store/sessionStore";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/shows", label: "Shows" },
  { to: "/bookings", label: "My Bookings" },
  { to: "/profile", label: "Profile" },
  { to: "/admin", label: "Admin" },
];

export function AppLayout() {
  const location = useLocation();
  const { token, userName, roles, clearSession } = useSessionStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHomePage = location.pathname === "/";

  const filteredNavItems = navItems.filter(item => {
    if (item.to.startsWith("/admin")) {
      return roles.includes("ADMIN") || roles.includes("ORGANIZER");
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-surface-50 text-premium selection:bg-brand-100 selection:text-brand-900">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex flex-col">
            <span className="font-display text-2xl font-extrabold tracking-tight text-premium">
              Stage<span className="text-brand-600">Pass</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Premium Experience</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                    isActive 
                      ? "bg-premium text-white shadow-md shadow-premium/20" 
                      : "text-slate-600 hover:text-premium hover:bg-surface-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            {token ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-premium leading-none">{userName}</p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{roles[0]}</p>
                </div>
                <button
                  type="button"
                  onClick={clearSession}
                  className="btn-secondary !px-5 !py-2 text-xs"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-premium transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="btn-premium !px-6 !py-2.5 text-xs">
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-slate-600 hover:text-premium transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out bg-white ${isMenuOpen ? "max-h-screen opacity-100 py-6" : "max-h-0 opacity-0 overflow-hidden"}`}>
          <div className="px-6 space-y-4">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block py-3 text-lg font-semibold transition-colors ${
                    isActive ? "text-brand-600" : "text-slate-600"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            {/* Removed hr */}
            {token ? (
              <button
                type="button"
                onClick={() => {
                  clearSession();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left py-3 text-lg font-semibold text-red-500"
              >
                Sign Out
              </button>
            ) : (
              <div className="grid gap-2 pt-2">
                <Link to="/login" className="btn-secondary text-center" onClick={() => setIsMenuOpen(false)}>Log in</Link>
                <Link to="/register" className="btn-premium text-center" onClick={() => setIsMenuOpen(false)}>Join Now</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className={isHomePage ? "w-full py-0" : "mx-auto max-w-7xl px-6 py-12 lg:py-16"}>
        <Outlet />
      </main>

      <footer className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <span className="font-display text-xl font-bold text-premium">StagePass</span>
              <p className="mt-2 text-sm text-slate-500 max-w-xs">Connecting you to the finest live experiences with zero friction.</p>
            </div>
            <div className="flex gap-8 text-sm font-medium text-slate-400">
              <a href="#" className="hover:text-premium transition-colors">Privacy</a>
              <a href="#" className="hover:text-premium transition-colors">Terms</a>
              <a href="#" className="hover:text-premium transition-colors">Support</a>
            </div>
            <p className="text-sm text-slate-400">© 2026 StagePass. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
