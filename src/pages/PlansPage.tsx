import { useState } from "react";
import MerchantLayout from "@/components/MerchantLayout";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useQueryClient } from "@/hooks/use-firestore";
import type { Business } from "@/lib/types";
import { LogOut, Check, Sparkles, Zap, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PlansPage() {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [isYearly, setIsYearly] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);
  
  const qc = useQueryClient();
  const { data: business } = useQuery<Business>({ queryKey: ["/api/business"] });
  
  const currentPlan = business?.plan || "free";
  
  // Calculate days left in trial if on free plan
  let daysLeft = 3;
  if (currentPlan === "free" && business?.planStartDate) {
    const startDate = new Date(business.planStartDate);
    const diffTime = Math.abs(new Date().getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    daysLeft = Math.max(0, 3 - diffDays);
  }

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };
  
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgradeClick = async () => {
    if (!business?.id) return;
    setIsProcessing(true);

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast({ variant: "destructive", title: "Error", description: "Failed to load Razorpay checkout" });
        return;
      }

      // Step 1: Create Order
      const orderRes = await fetch("/.netlify/functions/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isYearly, businessId: business.id, couponCode }),
      });

      if (!orderRes.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await orderRes.json();

      // Step 2: Open Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ReviewAI",
        description: `Upgrade to Pro (${isYearly ? 'Yearly' : 'Monthly'})`,
        order_id: orderData.id,
        handler: async function (response: any) {
          // Step 3: Verify Payment
          toast({ title: "Processing payment...", description: "Please wait." });
          
          const verifyRes = await fetch("/.netlify/functions/verifyPayment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              businessId: business.id,
              isYearly
            }),
          });

          if (verifyRes.ok) {
            toast({ title: "Success!", description: "Your plan has been upgraded to Pro." });
            qc.invalidateQueries({ queryKey: ["/api/business"] });
          } else {
            toast({ variant: "destructive", title: "Verification Failed", description: "Please contact support." });
          }
        },
        prefill: {
          name: business.name || "",
        },
        theme: {
          color: "#6D28D9",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        toast({ variant: "destructive", title: "Payment Failed", description: response.error.description });
      });
      paymentObject.open();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Something went wrong" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MerchantLayout>
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-[#ECECF2] px-4 md:px-8 h-14 md:h-16 flex items-center justify-between">
        <h1 className="text-sm font-semibold text-[#111827]">Subscription Plans</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-[#EF4444] hover:bg-red-50 p-2 rounded-lg transition-colors">
          <LogOut size={18} strokeWidth={1.8} />
          <span className="text-xs font-medium hidden md:inline">Logout</span>
        </button>
      </div>
      
      <main className="flex-1 px-4 md:px-8 py-8 md:py-12 flex flex-col items-center">
        
        <div className="text-center max-w-2xl mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4 tracking-tight">
            Plans that scale with your business
          </h2>
          <p className="text-base md:text-lg text-[#6B7280]">
            Get more Google reviews, generate AI responses, and manage your online reputation effortlessly.
          </p>
        </div>

        {/* Toggle Monthly/Yearly */}
        <div className="bg-[#F3F4F6] p-1 rounded-xl inline-flex mb-10 relative">
          <button 
            onClick={() => setIsYearly(false)}
            className={`relative z-10 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${!isYearly ? 'text-[#111827] shadow-sm bg-white' : 'text-[#6B7280] hover:text-[#111827]'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setIsYearly(true)}
            className={`relative z-10 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${isYearly ? 'text-[#111827] shadow-sm bg-white' : 'text-[#6B7280] hover:text-[#111827]'}`}
          >
            Yearly
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl items-start">
          
          {/* Free Plan */}
          <div className={`bg-white rounded-3xl border-2 p-6 md:p-8 flex flex-col h-full relative transition-all duration-300 ${currentPlan === "free" ? 'border-[#6D28D9] shadow-[0_8px_30px_rgb(0,0,0,0.08)]' : 'border-[#ECECF2]'}`}>
            {currentPlan === "free" && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#6D28D9] text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide uppercase">
                Active Plan
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#111827] mb-2 flex items-center gap-2">
                Free Trial
                <Sparkles size={18} className="text-amber-500" />
              </h3>
              <p className="text-[#6B7280] text-sm">Perfect for trying out ReviewAI.</p>
            </div>
            
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black text-[#111827]">₹0</span>
              <span className="text-[#6B7280] font-medium">/ forever</span>
            </div>
            
            {currentPlan === "free" && (
              <div className="mb-8 bg-amber-50 border border-amber-100 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-sm font-semibold text-amber-900">Your trial ends in {daysLeft} days</p>
                    <p className="text-xs text-amber-700 mt-1">Upgrade to Pro to keep generating AI reviews without interruption.</p>
                  </div>
                </div>
              </div>
            )}

            <button 
              disabled={currentPlan === "free"}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all mb-8 ${
                currentPlan === "free" 
                ? 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed' 
                : 'bg-white border-2 border-[#ECECF2] text-[#111827] hover:border-[#6D28D9] hover:text-[#6D28D9]'
              }`}
            >
              {currentPlan === "free" ? 'Currently Active' : 'Downgrade to Free'}
            </button>

            <div className="flex-1">
              <p className="text-sm font-semibold text-[#111827] mb-4 uppercase tracking-wider">Features included:</p>
              <ul className="space-y-4">
                {[
                  "3-day trial period",
                  "10 AI review drafts per day",
                  "Basic review tracking dashboard",
                  "Custom QR code generator",
                  "Standard Google review linking"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#4B5563]">
                    <Check size={18} className="text-[#16A34A] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pro Plan */}
          <div className={`bg-white rounded-3xl border-2 p-6 md:p-8 flex flex-col h-full relative transition-all duration-300 ${currentPlan === "pro" ? 'border-[#6D28D9] shadow-[0_8px_30px_rgb(0,0,0,0.08)]' : 'border-[#ECECF2] hover:border-[#D1D5DB]'}`}>
            {currentPlan === "pro" && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#6D28D9] text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide uppercase">
                Active Plan
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#111827] mb-2 flex items-center gap-2">
                Pro Merchant
                <Zap size={18} className="text-[#6D28D9]" />
              </h3>
              <p className="text-[#6B7280] text-sm">For growing businesses needing scale.</p>
            </div>
            
            <div className="mb-6 flex flex-col items-start gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-black text-[#111827]">
                  ₹{isYearly ? "1,499" : "149"}
                </span>
                <span className="text-[#6B7280] font-medium">/ {isYearly ? "year" : "month"}</span>
              </div>
              {isYearly && (
                <div className="bg-[#DCFCE7] border border-[#BBF7D0] text-[#16A34A] text-xs font-bold px-3 py-1 mt-1 rounded-lg">
                  Save ₹301 on yearly plan
                </div>
              )}
            </div>
            
            {!showCoupon ? (
              <button 
                onClick={() => setShowCoupon(true)} 
                className="text-xs font-medium text-[#6B7280] hover:text-[#6D28D9] mb-4 text-center w-full transition-colors"
                disabled={currentPlan === "pro"}
              >
                Have a promo code?
              </button>
            ) : (
              <div className="mb-4 flex justify-center">
                <input 
                  type="text" 
                  placeholder="Enter promo code" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={currentPlan === "pro" || isProcessing}
                  className="w-1/2 min-w-[150px] px-3 py-2 text-xs font-medium bg-gray-50 border border-[#E5E7EB] rounded-lg focus:outline-none focus:bg-white focus:border-[#6D28D9] uppercase transition-all placeholder:normal-case text-center tracking-widest"
                />
              </div>
            )}

            <button 
              onClick={handleUpgradeClick}
              disabled={currentPlan === "pro" || isProcessing}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all mb-8 shadow-sm flex items-center justify-center gap-2 ${
                currentPlan === "pro" 
                ? 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed border-0' 
                : 'bg-[#6D28D9] text-white hover:bg-[#5B21B6] hover:shadow-md'
              }`}
            >
              {isProcessing && <Loader2 size={16} className="animate-spin" />}
              {currentPlan === "pro" ? 'Currently Active' : isProcessing ? 'Processing...' : 'Upgrade to Pro'}
            </button>

            <div className="flex-1">
              <p className="text-sm font-semibold text-[#111827] mb-4 uppercase tracking-wider">Everything in Free, plus:</p>
              <ul className="space-y-4">
                {[
                  "100 AI review drafts per month",
                  "Unlimited trial duration",
                  "Advanced analytics dashboard",
                  "Priority customer support",
                  "Custom branding options"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#4B5563]">
                    <Check size={18} className="text-[#6D28D9] shrink-0 mt-0.5" />
                    <span className={i === 0 || i === 1 ? 'font-semibold text-[#111827]' : ''}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </main>
    </MerchantLayout>
  );
}
