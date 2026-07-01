import { Link } from "wouter";
import { QrCode, Sparkles, Star, ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: QrCode,
    title: "Instant QR Codes",
    desc: "Generate a branded QR code in seconds. Print it, display it, and watch the reviews roll in.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Reviews",
    desc: "GPT writes authentic, natural reviews based on customer feedback — no robotic language, ever.",
  },
  {
    icon: Star,
    title: "Smart Rating Filter",
    desc: "Happy customers go to Google. Unhappy ones give you private feedback so you can improve.",
  },
];

const steps = [
  { num: "01", title: "Set up your business", desc: "Add your name, category, and Google Review URL. Takes under 2 minutes." },
  { num: "02", title: "Display your QR code", desc: "Print or display your unique QR code at the counter, table, or receipt." },
  { num: "03", title: "Customer rates their experience", desc: "They scan, tap stars, and optionally add a comment. No app download needed." },
  { num: "04", title: "AI writes a real review", desc: "For 4–5 star ratings, a personalized review draft is created for them to copy and post." },
];

const faqs = [
  {
    q: "Do customers need to create an account?",
    a: "No. Customers simply scan your QR code and go through a beautiful, frictionless flow. No signup, no app, no friction.",
  },
  {
    q: "Will the AI reviews sound fake?",
    a: "No. The AI is trained to write human, varied, and natural-sounding reviews. Customers can also edit them before posting.",
  },
  {
    q: "What happens with negative feedback?",
    a: "Customers who rate 1–3 stars are shown a private feedback form. Their feedback goes only to you — not to Google.",
  },
  {
    q: "How do I get my Google Review link?",
    a: "Search your business on Google, click 'Write a review', and copy the URL from your browser.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#ECECF2] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="text-[#111827] text-sm font-medium">{q}</span>
        <ChevronDown
          size={16}
          className={`text-[#9CA3AF] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <p className="text-[#6B7280] text-sm pb-5 leading-relaxed">{a}</p>}
    </div>
  );
}

export function ReviewaiLanding() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] font-['Poppins',sans-serif]">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#ECECF2]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-[#6D28D9] text-lg font-bold">ReviewAI <span className="text-[#9CA3AF] text-sm font-normal">by Adshree</span></div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#6B7280]">
            <a href="#how-it-works" className="hover:text-[#111827] transition-colors">How it works</a>
            <a href="#features" className="hover:text-[#111827] transition-colors">Features</a>
            <a href="#faq" className="hover:text-[#111827] transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-[#6B7280] hover:text-[#111827] font-medium transition-colors px-3 py-2" data-testid="link-login">
              Sign in
            </Link>
            <Link href="/signup" className="text-sm bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-medium px-4 py-2 rounded-full transition-colors" data-testid="link-signup">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#6D28D9]/6 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#A855F7]/6 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#F5F3FF] text-[#6D28D9] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Sparkles size={12} />
            AI-powered review collection
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#111827] leading-tight tracking-tight mb-5">
            Turn Happy Customers Into<br />
            <span className="text-[#6D28D9]">Google Reviews.</span>
          </h1>
          <p className="text-[#6B7280] text-lg leading-relaxed max-w-xl mx-auto mb-8">
            Generate authentic AI-powered review drafts that customers can edit and post on Google in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup" className="flex items-center gap-2 px-6 py-3 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-semibold rounded-full transition-colors shadow-lg shadow-[#6D28D9]/20" data-testid="link-get-started">
              Get Started Free <ArrowRight size={15} />
            </Link>
            <a href="#how-it-works" className="flex items-center gap-2 px-6 py-3 text-[#6B7280] hover:text-[#111827] text-sm font-medium transition-colors">
              See how it works
            </a>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-[#9CA3AF]">
            {["No credit card required", "Setup in 2 minutes", "Works on any device"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-[#16A34A]" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-3">How it works</h2>
            <p className="text-[#6B7280] text-sm max-w-md mx-auto">From setup to your first Google review in under 5 minutes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="relative">
                <div className="text-4xl font-bold text-[#ECECF2] mb-3">{num}</div>
                <h3 className="text-sm font-semibold text-[#111827] mb-2">{title}</h3>
                <p className="text-[#6B7280] text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-[#FAFAFC]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-3">Everything you need</h2>
            <p className="text-[#6B7280] text-sm max-w-md mx-auto">A complete review collection system built for local businesses.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-[#ECECF2] p-6 shadow-sm">
                <div className="w-10 h-10 bg-[#F5F3FF] rounded-xl flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#6D28D9]" strokeWidth={1.8} />
                </div>
                <h3 className="text-sm font-semibold text-[#111827] mb-2">{title}</h3>
                <p className="text-[#6B7280] text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="py-12 bg-white border-y border-[#ECECF2]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-6">Trusted by local businesses</p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-[#6B7280] font-medium">
            {["Cafes", "Restaurants", "Salons", "Clinics", "Retail Shops", "Gyms"].map(b => (
              <span key={b} className="opacity-50">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-[#FAFAFC]">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-3">Frequently asked</h2>
          </div>
          <div className="bg-white rounded-2xl border border-[#ECECF2] px-6 shadow-sm">
            {faqs.map(faq => <FaqItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#6D28D9]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to get more Google reviews?</h2>
          <p className="text-[#C4B5FD] text-sm mb-8">Set up your account in minutes. No credit card required.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-[#F5F3FF] text-[#6D28D9] text-sm font-bold rounded-full transition-colors shadow-xl">
            Get Started Free <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#ECECF2] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[#6D28D9] font-bold text-sm">ReviewAI <span className="text-[#9CA3AF] font-normal">by Adshree</span></div>
          <p className="text-xs text-[#9CA3AF] tracking-wide uppercase">Powered by Adshree Inc.</p>
          <div className="flex gap-4 text-xs text-[#9CA3AF]">
            <span className="hover:text-[#6B7280] cursor-pointer">Terms</span>
            <span className="hover:text-[#6B7280] cursor-pointer">Privacy</span>
            <span className="hover:text-[#6B7280] cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
