import { useQuery } from "@/hooks/use-firestore";
import { MessageSquare, Star } from "lucide-react";
import MerchantLayout from "@/components/MerchantLayout";
import type { Feedback } from "@/lib/types";

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400 text-sm tracking-tighter">
      {"★".repeat(rating)}
      <span className="text-[#E5E7EB]">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function FeedbackPage() {
  const { data: feedbackList = [], isLoading } = useQuery<Feedback[]>({
    queryKey: ["/api/feedback"],
  });

  const publicReviews = feedbackList.filter(f => f.rating >= 4);
  const privateReviews = feedbackList.filter(f => f.rating <= 3);

  return (
    <MerchantLayout>
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-[#ECECF2] px-4 md:px-8 h-14 md:h-16 flex items-center justify-between">
        <h1 className="text-sm font-semibold text-[#111827]">Feedback</h1>
        <div className="flex gap-2 text-xs">
          <span className="bg-[#F0FDF4] text-[#16A34A] px-2.5 py-1 rounded-full font-medium">
            {publicReviews.length} public
          </span>
          <span className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full font-medium">
            {privateReviews.length} private
          </span>
        </div>
      </div>

      <main className="flex-1 px-4 md:px-8 py-5 md:py-8">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Public Reviews */}
          {publicReviews.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-[#111827] mb-3 flex items-center gap-2">
                <Star size={15} className="text-[#16A34A]" />
                Google Review Candidates <span className="text-[#9CA3AF] font-normal">({publicReviews.length})</span>
              </h2>
              <div className="bg-white rounded-2xl border border-[#ECECF2] shadow-sm divide-y divide-[#ECECF2]">
                {publicReviews.map(item => (
                  <div key={item.id} className="px-4 md:px-6 py-4 md:py-5">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <StarRow rating={item.rating} />
                      <span className="text-xs text-[#9CA3AF]">
                        {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      {item.generatedReview && (
                        <span className="text-xs bg-[#F5F3FF] text-[#6D28D9] px-2 py-0.5 rounded-full font-medium">AI</span>
                      )}
                    </div>
                    {item.generatedReview ? (
                      <p className="text-sm text-[#111827] leading-relaxed">{item.generatedReview}</p>
                    ) : item.feedbackText ? (
                      <p className="text-sm text-[#111827] leading-relaxed">{item.feedbackText}</p>
                    ) : (
                      <p className="text-sm text-[#9CA3AF] italic">No comment provided</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Private Feedback */}
          {privateReviews.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-[#111827] mb-3 flex items-center gap-2">
                <MessageSquare size={15} className="text-orange-500" />
                Private Feedback <span className="text-[#9CA3AF] font-normal">({privateReviews.length})</span>
              </h2>
              <div className="bg-white rounded-2xl border border-[#ECECF2] shadow-sm divide-y divide-[#ECECF2]">
                {privateReviews.map(item => (
                  <div key={item.id} className="px-4 md:px-6 py-4 md:py-5">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 text-xs font-bold">{item.rating}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <StarRow rating={item.rating} />
                          <span className="text-xs text-[#9CA3AF]">
                            {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        {item.feedbackText ? (
                          <p className="text-sm text-[#111827] leading-relaxed">{item.feedbackText}</p>
                        ) : (
                          <p className="text-sm text-[#9CA3AF] italic">No comment provided</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && feedbackList.length === 0 && (
            <div className="bg-white rounded-2xl border border-[#ECECF2] shadow-sm px-6 py-14 text-center">
              <MessageSquare size={40} className="text-[#ECECF2] mx-auto mb-4" />
              <h3 className="text-base font-semibold text-[#111827] mb-1">No feedback yet</h3>
              <p className="text-sm text-[#6B7280] max-w-sm mx-auto">Share your QR code or review link with customers to start collecting feedback.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="px-4 md:px-8 py-4 border-t border-[#ECECF2]">
        <p className="text-center text-xs text-[#9CA3AF] tracking-wide uppercase">Powered by Adshree Inc.</p>
      </footer>
    </MerchantLayout>
  );
}
