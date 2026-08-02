import { Link } from "wouter";
import { QrCode, Sparkles, Star, ArrowRight, CheckCircle2, ChevronDown, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="border-b border-[#ECECF2] last:border-0 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left gap-4 outline-none group"
      >
        <span className="text-[#111827] text-base font-semibold group-hover:text-[#6D28D9] transition-colors">{q}</span>
        <ChevronDown
          size={18}
          className={`text-[#9CA3AF] shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <p className="text-[#6B7280] text-sm pb-6 leading-relaxed pr-8">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HeroMockup() {
  const [mockStep, setMockStep] = useState<"rating" | "loading" | "options" | "success">("rating");
  const [mockRating, setMockRating] = useState(0);
  const [selectedReview, setSelectedReview] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    let ratingInterval: NodeJS.Timeout;

    const startLoop = () => {
      if (!isMounted) return;
      setMockStep("rating");
      setMockRating(0);
      setSelectedReview(null);

      let currentRating = 0;
      ratingInterval = setInterval(() => {
        if (!isMounted) return;
        currentRating += 1;
        setMockRating(currentRating);
        if (currentRating === 5) {
          clearInterval(ratingInterval);
          timeoutId = setTimeout(() => {
            if (!isMounted) return;
            setMockStep("loading");
            timeoutId = setTimeout(() => {
              if (!isMounted) return;
              setMockStep("options");
              timeoutId = setTimeout(() => {
                if (!isMounted) return;
                setSelectedReview(1);
                timeoutId = setTimeout(() => {
                  if (!isMounted) return;
                  setMockStep("success");
                  timeoutId = setTimeout(() => {
                    startLoop();
                  }, 3000);
                }, 1000);
              }, 1200);
            }, 1500);
          }, 800);
        }
      }, 200);
    };

    startLoop();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      clearInterval(ratingInterval);
    };
  }, []);

  return (
    <div className="relative mx-auto w-[280px] h-[520px] bg-[#111827] rounded-[40px] p-3 shadow-2xl border-4 border-[#374151] overflow-hidden flex flex-col justify-between">
      {/* Camera Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#111827] rounded-b-2xl z-20 flex items-center justify-center">
        <div className="w-10 h-1 bg-[#374151] rounded-full" />
      </div>

      {/* Screen Container */}
      <div className="w-full h-full bg-[#FAFAFC] rounded-[30px] overflow-hidden pt-8 px-4 pb-4 flex flex-col justify-between relative text-left">
        {/* Header */}
        <div className="flex flex-col items-center mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] flex items-center justify-center text-lg font-bold text-[#6D28D9] shadow-sm mb-1">
            H
          </div>
          <p className="text-[#A855F7] text-[9px] font-bold tracking-widest uppercase">REVIEWAI</p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#ECECF2] flex-1 flex flex-col justify-center min-h-[300px]">
          <AnimatePresence mode="wait">
            {mockStep === "rating" && (
              <motion.div
                key="rating"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-4 text-center"
              >
                <p className="text-xs font-bold text-[#111827]">How was your experience at Hotel Golden?</p>
                <div className="flex gap-1 text-xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`transition-all duration-100 ${
                        star <= mockRating ? "scale-110 grayscale-0" : "grayscale opacity-25"
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <div className="w-full py-2 bg-[#6D28D9] text-white text-[10px] font-semibold rounded-lg opacity-40 text-center">
                  Continue
                </div>
              </motion.div>
            )}

            {mockStep === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-3 text-center py-4 w-full"
              >
                <div className="w-8 h-8 rounded-full border-4 border-[#F5F3FF] border-t-[#6D28D9] animate-spin" />
                <p className="text-[10px] text-[#6B7280]">AI is writing 3 custom suggestions...</p>
              </motion.div>
            )}

            {mockStep === "options" && (
              <motion.div
                key="options"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-2 w-full"
              >
                <p className="text-[10px] font-bold text-[#111827] text-center">Select your favorite option:</p>
                <div className="flex flex-col gap-1.5">
                  {[
                    "Excellent service! The staff was super friendly.",
                    "Cozy atmosphere, and the coffee was delicious.",
                    "Loved everything! Highly recommend visiting this place."
                  ].map((review, idx) => (
                    <motion.div
                      key={idx}
                      className={`p-2 rounded-lg border text-[9px] leading-relaxed relative ${
                        selectedReview === idx
                          ? "border-[#6D28D9] bg-[#F5F3FF]/50"
                          : "border-[#ECECF2] bg-[#FAFAFC]"
                      }`}
                      animate={selectedReview === idx ? { scale: 1.02 } : { scale: 1 }}
                    >
                      {selectedReview === idx && (
                        <div className="absolute top-1.5 right-1.5 text-[#6D28D9]">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                      <p className={selectedReview === idx ? "text-[#111827] font-medium pr-3" : "text-[#6B7280]"}>
                        {review}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div
                  className={`w-full py-2 text-white text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
                    selectedReview !== null ? "bg-[#6D28D9] shadow-md shadow-[#6D28D9]/20" : "bg-[#ECECF2] text-[#9CA3AF]"
                  }`}
                >
                  Post Review on Google
                </div>
              </motion.div>
            )}

            {mockStep === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-3 text-center py-6"
              >
                <div className="w-10 h-10 bg-[#D1FAE5] text-[#10B981] rounded-full flex items-center justify-center text-lg">
                  ✅
                </div>
                <h4 className="text-xs font-bold text-[#111827]">Review Copied!</h4>
                <p className="text-[9px] text-[#6B7280] leading-relaxed">
                  Google Page Opened.<br />Paste review & submit.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="text-center opacity-40 text-[8px] mt-2">
          🔒 Verified & Secure Feedback
        </div>
      </div>
    </div>
  );
}

export function ReviewaiLanding() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] font-['Poppins',sans-serif] relative overflow-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#ECECF2]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-[#6D28D9] text-xl font-bold tracking-tight">ReviewAI <span className="text-[#9CA3AF] text-sm font-medium ml-1">by Adshree</span></div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6B7280]">
            <a href="#how-it-works" className="hover:text-[#111827] transition-colors">How it works</a>
            <a href="#features" className="hover:text-[#111827] transition-colors">Features</a>
            <a href="#faq" className="hover:text-[#111827] transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-[#6B7280] hover:text-[#111827] font-medium transition-colors px-3 py-2" data-testid="link-login">
              Sign in
            </Link>
            <Link href="/signup" className="text-sm bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-medium px-5 py-2.5 rounded-full transition-colors shadow-sm" data-testid="link-signup">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden z-10">
        {/* Background Grid & Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Dot Grid */}
          <div className="absolute inset-0 opacity-[0.3]" style={{
            backgroundImage: 'radial-gradient(#6D28D9 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
          
          {/* Moving Gradient Blobs */}
          <motion.div
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -40, 30, 0],
              scale: [1, 1.15, 0.9, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-tr from-[#6D28D9]/8 to-[#A855F7]/8 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{
              x: [0, -40, 40, 0],
              y: [0, 30, -30, 0],
              scale: [1, 0.9, 1.1, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-[#A855F7]/8 to-[#EC4899]/8 rounded-full blur-[80px]"
          />
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 text-[#6D28D9]/20 hidden lg:block z-0"
        >
          <Sparkles size={40} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 left-1/4 text-[#A855F7]/25 hidden lg:block z-0"
        >
          <Star size={32} fill="currentColor" />
        </motion.div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-[#F5F3FF] text-[#6D28D9] text-sm font-semibold px-4 py-2 rounded-full mb-6 shadow-sm border border-[#6D28D9]/10"
              >
                <Sparkles size={14} className="text-[#A855F7]" />
                AI-Powered Google Reviews Generator
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold text-[#111827] leading-[1.1] tracking-tight mb-6"
              >
                Turn Happy Customers Into <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D28D9] to-[#A855F7] pb-2 inline-block">Google Reviews.</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-[#6B7280] text-lg md:text-xl leading-relaxed max-w-xl mb-10"
              >
                Let AI generate human-like review drafts automatically. Frictionless, fast, and optimized for your business rating.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
              >
                <Link href="/signup" className="flex items-center justify-center gap-2 px-8 py-4 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-base font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:shadow-[#6D28D9]/25 hover:-translate-y-0.5 w-full sm:w-auto" data-testid="link-get-started">
                  Get Started Free <ArrowRight size={18} />
                </Link>
                <a href="#how-it-works" className="flex items-center justify-center gap-2 px-8 py-4 text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] text-base font-semibold rounded-full transition-colors w-full sm:w-auto">
                  See how it works
                </a>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-5 mt-12 text-sm text-[#6B7280] font-medium"
              >
                {["No card required", "2 min setup", "Any device"].map(t => (
                  <span key={t} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#10B981]" /> {t}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right Mockup Column */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              {/* Blur accent behind mockup */}
              <div className="absolute w-72 h-72 bg-[#6D28D9]/10 rounded-full blur-3xl -z-10" />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full max-w-[320px]"
              >
                <HeroMockup />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">How it works</h2>
            <p className="text-[#6B7280] text-lg max-w-md mx-auto">From setup to your first Google review in under 5 minutes.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ num, title, desc }, idx) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.1 }}
                className="relative p-6 rounded-3xl hover:bg-[#FAFAFC] transition-colors border border-transparent hover:border-[#ECECF2]"
              >
                <div className="text-6xl font-extrabold text-[#F3F4F6] mb-6 tracking-tighter">{num}</div>
                <h3 className="text-lg font-bold text-[#111827] mb-3">{title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-[#FAFAFC]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">Everything you need</h2>
            <p className="text-[#6B7280] text-lg max-w-md mx-auto">A complete review collection system built for local businesses.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl border border-[#ECECF2] p-8 shadow-sm hover:shadow-lg hover:shadow-[#6D28D9]/5 transition-all"
              >
                <div className="w-14 h-14 bg-[#F5F3FF] rounded-2xl flex items-center justify-center mb-6">
                  <Icon size={28} className="text-[#6D28D9]" strokeWidth={1.8} />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">{title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="py-16 bg-white border-y border-[#ECECF2]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-[#9CA3AF] uppercase tracking-widest mb-8 font-semibold">Trusted by local businesses</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-lg text-[#6B7280] font-medium">
            {["Cafes", "Restaurants", "Salons", "Clinics", "Retail Shops", "Gyms"].map(b => (
              <span key={b} className="opacity-50 hover:opacity-100 transition-opacity cursor-default">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-[#FAFAFC]">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">Frequently asked</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-white rounded-3xl border border-[#ECECF2] px-8 shadow-sm"
          >
            {faqs.map(faq => <FaqItem key={faq.q} {...faq} />)}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#6D28D9] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-black/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            Ready to get more Google reviews?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#C4B5FD] text-lg md:text-xl mb-10"
          >
            Set up your account in minutes. No credit card required.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/signup" className="inline-flex items-center gap-2 px-10 py-4 bg-white hover:bg-[#F5F3FF] text-[#6D28D9] text-lg font-bold rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
              Get Started Free <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#ECECF2] py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[#6D28D9] font-bold text-lg tracking-tight">ReviewAI <span className="text-[#9CA3AF] font-medium text-sm ml-1">by Adshree</span></div>
          <p className="text-sm text-[#9CA3AF] tracking-wide font-medium">Powered by Adshree Inc.</p>
          <div className="flex gap-6 text-sm font-medium text-[#9CA3AF]">
            <span className="hover:text-[#6B7280] cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-[#6B7280] cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-[#6B7280] cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
