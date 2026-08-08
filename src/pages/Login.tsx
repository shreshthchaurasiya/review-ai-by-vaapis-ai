import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col items-center justify-center px-4 font-['Poppins',sans-serif]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-[#6D28D9] text-2xl font-bold">ReviewAI</Link>
          <p className="text-[#6B7280] text-sm mt-1">by Adshree</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#ECECF2] shadow-sm p-8">
          <h1 className="text-[#111827] text-xl font-semibold mb-1">Welcome back</h1>
          <p className="text-[#6B7280] text-sm mb-6">Sign in to your merchant account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[#ECECF2] bg-[#FAFAFC] text-[#111827] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition-colors"
                data-testid="input-email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-[#ECECF2] bg-[#FAFAFC] text-[#111827] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition-colors"
                data-testid="input-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60"
              data-testid="button-login"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-[#6B7280] mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#6D28D9] font-medium hover:underline">Create one</Link>
          </p>
        </div>

        <p className="text-center text-xs text-[#9CA3AF] mt-8">Powered by Adshree Inc.</p>
      </div>
    </div>
  );
}
