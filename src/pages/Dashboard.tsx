import { useState, useEffect } from "react";
import { useQuery } from "@/hooks/use-firestore";
import { Users, Star, Sparkles, MessageSquare, LogOut } from "lucide-react";
import MerchantLayout from "@/components/MerchantLayout";
import { useAuth } from "@/hooks/use-auth";
import type { Feedback, Business } from "@/lib/types";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "wouter";

function StatCard({
  label, value, icon: Icon, iconBg,
}: {
  label: string; value: string | number; icon: any; iconBg: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#ECECF2] p-4 md:p-6 shadow-sm">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className={`${iconBg} p-2.5 rounded-xl`}>
          <Icon size={18} strokeWidth={1.8} className="text-inherit" />
        </div>
      </div>
      <div className="text-2xl font-bold text-[#111827] leading-tight">{value}</div>
      <div className="text-[10px] md:text-xs text-[#6B7280] mt-1 font-medium tracking-wide uppercase">{label}</div>
    </div>
  );
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#6B7280] w-8 text-right font-medium">{stars}★</span>
      <div className="flex-1 bg-[#F3F4F6] h-2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-[#6D28D9]"
          style={{ width: `${pct}%`, opacity: 0.3 + (stars / 5) * 0.7 }}
        />
      </div>
      <span className="text-xs text-[#6B7280] w-8 font-medium">{pct}%</span>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const { data: stats } = useQuery<{ totalRatings: number; avgRating: number; aiReviewsGenerated: number; privateFeedback: number }>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: feedbackList = [] } = useQuery<Feedback[]>({
    queryKey: ["/api/feedback"],
  });

  const { data: business } = useQuery<Business>({
    queryKey: ["/api/business"],
  });

  const [planData, setPlanData] = useState<{ limit: number; limitType: 'daily' | 'monthly'; trialDays: number } | null>(null);

  useEffect(() => {
    if (business?.plan) {
      getDoc(doc(db, 'subscription_plans', business.plan)).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPlanData({
            limit: data.aiRequestLimit || (business.plan === "pro" ? 100 : 10),
            limitType: data.limitType || (business.plan === "pro" ? 'monthly' : 'daily'),
            trialDays: data.trialDays || (business.plan === "free" ? 3 : 0)
          });
        }
      });
    } else {
      setPlanData({ limit: 10, limitType: 'daily', trialDays: 3 }); // Default for free plan if not loaded
    }
  }, [business?.plan]);

  const ratingDist = [5, 4, 3, 2, 1].map(s => ({
    stars: s,
    count: feedbackList.filter(f => f.rating === s).length,
  }));

  const recentFeedback = feedbackList.slice(0, 5);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <MerchantLayout>
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-[#ECECF2] px-4 md:px-8 h-14 md:h-16 flex items-center justify-between">
        <h1 className="text-sm font-semibold text-[#111827]">Dashboard</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-[#EF4444] hover:bg-red-50 p-2 rounded-lg transition-colors">
          <LogOut size={18} strokeWidth={1.8} />
          <span className="text-xs font-medium hidden md:inline">Logout</span>
        </button>
      </div>

      <main className="flex-1 px-4 md:px-8 py-5 md:py-8 space-y-5 md:space-y-8">
        {/* Welcome */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#111827]">
            {getGreeting()},{" "}
            <span className="text-[#6D28D9]">{business?.name || user?.email?.split("@")[0] || "there"}</span>
          </h2>
          <p className="text-[#6B7280] text-sm mt-1">Here's what's happening with your reviews today.</p>
        </div>

        {/* Limit Tracker */}
        <div className="bg-white rounded-2xl border border-[#ECECF2] p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#111827]">
              {planData?.limitType === 'monthly' ? "Monthly AI Reviews Limit" : "Daily AI Reviews Limit"}
            </h3>
            <div className="flex items-center gap-2">
              {planData?.trialDays ? (() => {
                const start = business?.planStartDate ? new Date(business.planStartDate) : new Date();
                const days = Math.floor((new Date().getTime() - start.getTime()) / (1000 * 3600 * 24));
                const left = Math.max(0, planData.trialDays - days);
                return (
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${left === 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
                      {left > 0 ? `${left} DAYS LEFT` : 'TRIAL EXPIRED'}
                    </span>
                    {left === 0 && (
                      <Link to="/plans" className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6D28D9] text-white hover:bg-[#5B21B6] transition-colors">
                        UPGRADE PLAN
                      </Link>
                    )}
                  </div>
                );
              })() : null}
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#F5F3FF] text-[#6D28D9] uppercase tracking-wider">
                {business?.plan === "pro" ? "Pro Plan" : "Free Plan"}
              </span>
            </div>
          </div>
          
          {(() => {
            const today = new Date().toISOString().split('T')[0];
            const thisMonth = today.substring(0, 7);
            
            let used = 0;
            if (planData?.limitType === 'monthly') {
              const lastMonth = business?.lastAiGenMonth || "";
              used = lastMonth === thisMonth ? (business?.monthlyAiCount || 0) : 0;
            } else {
              used = business?.lastAiGenDate === today ? (business?.dailyAiCount || 0) : 0;
            }
            
            const limit = planData?.limit || 10;
            const left = Math.max(0, limit - used);
            const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
            
            return (
              <>
                <div className="flex items-end justify-between mb-2">
                  <div className="text-2xl font-bold text-[#111827]">
                    {used} <span className="text-sm font-medium text-[#6B7280]">/ {limit} used</span>
                  </div>
                  <div className="text-sm font-medium text-[#16A34A]">
                    {left} left {planData?.limitType === 'monthly' ? "this month" : "today"}
                  </div>
                </div>
                <div className="w-full bg-[#F3F4F6] h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${pct >= 90 ? 'bg-[#EF4444]' : pct >= 75 ? 'bg-amber-500' : 'bg-[#6D28D9]'}`} 
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {pct >= 100 && (
                  <p className="text-xs text-[#EF4444] mt-2 font-medium">You have reached your {planData?.limitType} limit. Upgrade your plan for more.</p>
                )}
              </>
            );
          })()}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <StatCard
            label="Customers Rated"
            value={stats?.totalRatings ?? 0}
            icon={Users}
            iconBg="bg-[#F5F3FF] text-[#6D28D9]"
          />
          <StatCard
            label="Average Rating"
            value={stats?.avgRating ? `${stats.avgRating} ★` : "—"}
            icon={Star}
            iconBg="bg-amber-50 text-amber-500"
          />
          <StatCard
            label="AI Reviews"
            value={stats?.aiReviewsGenerated ?? 0}
            icon={Sparkles}
            iconBg="bg-[#F0FDF4] text-[#16A34A]"
          />
          <StatCard
            label="Private Feedback"
            value={stats?.privateFeedback ?? 0}
            icon={MessageSquare}
            iconBg="bg-orange-50 text-orange-500"
          />
        </div>

        {/* Recent Feedback + Rating Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Recent Feedback */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#ECECF2] shadow-sm">
            <div className="px-4 md:px-6 py-4 border-b border-[#ECECF2]">
              <h3 className="text-sm font-semibold text-[#111827]">Recent Feedback</h3>
            </div>
            {recentFeedback.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <MessageSquare size={32} className="text-[#ECECF2] mx-auto mb-3" />
                <p className="text-sm text-[#6B7280]">No feedback yet. Share your QR code to get started!</p>
              </div>
            ) : (
              <div className="divide-y divide-[#ECECF2]">
                {recentFeedback.map((item) => (
                  <div key={item.id} className="px-4 md:px-6 py-4 flex items-start gap-3">
                    <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      item.rating >= 4 ? "bg-[#F0FDF4] text-[#16A34A]" : "bg-orange-50 text-orange-600"
                    }`}>
                      {item.rating}★
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#111827] line-clamp-2">
                        {item.generatedReview || item.feedbackText || <span className="text-[#9CA3AF] italic">No comment</span>}
                      </p>
                      <p className="text-xs text-[#9CA3AF] mt-1 flex flex-wrap gap-1.5">
                        {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        {item.rating <= 3 && <span className="text-orange-500 font-medium">· Private</span>}
                        {item.generatedReview && <span className="text-[#6D28D9] font-medium">· AI</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rating Distribution */}
          <div className="bg-white rounded-2xl border border-[#ECECF2] shadow-sm">
            <div className="px-4 md:px-6 py-4 border-b border-[#ECECF2]">
              <h3 className="text-sm font-semibold text-[#111827]">Rating Distribution</h3>
            </div>
            <div className="px-4 md:px-6 py-5 space-y-3">
              {ratingDist.map(({ stars, count }) => (
                <RatingBar key={stars} stars={stars} count={count} total={stats?.totalRatings ?? 0} />
              ))}
              {stats?.totalRatings === 0 && (
                <p className="text-sm text-[#9CA3AF] text-center pt-4">No ratings yet</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="px-4 md:px-8 py-4 border-t border-[#ECECF2]">
        <p className="text-center text-xs text-[#9CA3AF] tracking-wide uppercase">Powered by Adshree Inc.</p>
      </footer>
    </MerchantLayout>
  );
}
