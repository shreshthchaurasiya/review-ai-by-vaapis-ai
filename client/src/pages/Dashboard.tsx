import { useQuery } from "@tanstack/react-query";
import { Users, Star, Sparkles, MessageSquare } from "lucide-react";
import MerchantLayout from "@/components/MerchantLayout";
import { useAuth } from "@/hooks/use-auth";
import type { Feedback, Business } from "@shared/schema";

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
  const { user } = useAuth();

  const { data: stats } = useQuery<{ totalRatings: number; avgRating: number; aiReviewsGenerated: number; privateFeedback: number }>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: feedbackList = [] } = useQuery<Feedback[]>({
    queryKey: ["/api/feedback"],
  });

  const { data: business } = useQuery<Business>({
    queryKey: ["/api/business"],
  });

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
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-[#ECECF2] px-4 md:px-8 h-14 md:h-16 flex items-center">
        <h1 className="text-sm font-semibold text-[#111827]">Dashboard</h1>
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
