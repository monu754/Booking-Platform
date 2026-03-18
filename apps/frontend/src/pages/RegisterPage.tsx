import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { useSessionStore } from "../store/sessionStore";

export function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useSessionStore((state) => state.setSession);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = await register({ name, email, password });
      setSession({
        token: payload.token,
        roles: payload.roles,
        userName: payload.name,
        email: payload.email,
      });
      navigate("/", { replace: true });
    } catch {
      setError("Registration failed. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="overflow-hidden rounded-[40px] border border-surface-200 bg-white shadow-premium">
        <div className="bg-premium p-12 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-400">Join the Elite</p>
          <h1 className="mt-4 font-display text-4xl font-black">Create Identity</h1>
        </div>
        <div className="p-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
             <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                required
                placeholder="John Doe"
                className="w-full rounded-2xl border border-surface-200 bg-surface-50 px-6 py-4 text-premium outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 placeholder:text-slate-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-surface-200 bg-surface-50 px-6 py-4 text-premium outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 placeholder:text-slate-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                minLength={6}
                required
                placeholder="Choose a strong password"
                className="w-full rounded-2xl border border-surface-200 bg-surface-50 px-6 py-4 text-premium outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 placeholder:text-slate-300"
              />
            </div>
            {error ? (
              <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 animate-shake">
                {error}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full mt-4 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Initialize Account"}
            </button>
          </form>
          <div className="mt-10 border-t border-surface-100 pt-8 text-center">
            <p className="text-sm font-medium text-slate-400">
              Already have an account? <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

