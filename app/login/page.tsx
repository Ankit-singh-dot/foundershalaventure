"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/team/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed.");
      }

      // Store basic session in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("foundershala_user", JSON.stringify(data.user));
      }

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <ShieldCheck className="h-4 w-4" /> FOUNDERSHALA IB TEAM PORTAL
          </div>
          <h1 className="text-2xl font-extrabold text-white">Investment Banking CRM Login</h1>
          <p className="text-xs text-slate-400">
            Sign in with your email & admin-assigned credentials to access deal allocations and post work updates.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-xl space-y-5">
          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-950/30 p-3.5 text-xs text-red-300 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@foundershalaventures.com"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Authenticating Credentials...
                </>
              ) : (
                <>
                  Log In to CRM Dashboard <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Help */}
          <div className="border-t border-slate-800 pt-4 space-y-2 text-[11px] text-slate-400">
            <span className="font-bold text-slate-300 block uppercase text-[10px]">
              Default Demo Accounts:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <div className="text-white font-bold">CA Varun (Admin)</div>
                <div className="text-emerald-400">varun@foundershalaventures.com</div>
                <div>pass: varun123#password</div>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <div className="text-white font-bold">Devansh (Analyst)</div>
                <div className="text-emerald-400">devansh@foundershalaventures.com</div>
                <div>pass: devansh123#password</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
