import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "Password too short", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await signup(email, password);
      navigate("/business");
    } catch (err: any) {
      toast({ title: "Signup failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      navigate("/dashboard"); // Business profile checks handle routing if empty
    } catch (err: any) {
      toast({ title: "Google Signup failed", description: err.message, variant: "destructive" });
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
          <h1 className="text-[#111827] text-xl font-semibold mb-1">Create your account</h1>
          <p className="text-[#6B7280] text-sm mb-6">Start collecting Google reviews in minutes</p>

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
                placeholder="Min. 8 characters"
                className="w-full px-4 py-2.5 rounded-xl border border-[#ECECF2] bg-[#FAFAFC] text-[#111827] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition-colors"
                data-testid="input-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60"
              data-testid="button-signup"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div className="mt-4 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-xs text-gray-500 bg-white uppercase">Or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mt-4 py-2.5 px-4 bg-white border border-[#ECECF2] hover:bg-gray-50 text-[#111827] text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-[#6B7280] mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#6D28D9] font-medium hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-[#9CA3AF] mt-8">Powered by Adshree Inc.</p>
      </div>
    </div>
  );
}
