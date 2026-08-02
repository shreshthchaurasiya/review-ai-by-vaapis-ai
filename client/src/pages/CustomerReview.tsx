import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@/hooks/use-firestore";
import { apiRequest } from "@/lib/queryClient";
import { Copy, ExternalLink, RefreshCw, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PublicBusiness {
  id: string;
  name: string;
  category: string;
  logo: string;
  googleReviewUrl: string;
  publicSlug?: string;
}

type Step = "rating" | "high-form" | "generating" | "review-draft" | "low-form" | "low-thanks";

function StarButton({ star, selected, onClick }: { star: number; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-4xl transition-transform hover:scale-110 active:scale-95 leading-none ${selected ? "drop-shadow-sm" : ""}`}
      data-testid={`button-star-${star}`}
    >
      {selected ? "⭐" : "☆"}
    </button>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-[#F5F3FF]" />
        <div className="absolute inset-0 rounded-full border-4 border-t-[#6D28D9] animate-spin" />
      </div>
      <p className="text-sm text-[#6B7280] text-center">Creating your personalized review…</p>
    </div>
  );
}

export default function CustomerReview() {
  const params = useParams<{ slug: string }>();

  const { data: business, isLoading: bizLoading } = useQuery<PublicBusiness>({
    queryKey: [`/api/r/${params.slug}`],
    retry: false,
  });

  const [step, setStep] = useState<Step>("rating");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [experience, setExperience] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [privateFeedback, setPrivateFeedback] = useState("");
  const [generatedReview, setGeneratedReview] = useState("");
  const [copied, setCopied] = useState(false);

  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/generate-review", {
        businessName: business!.name || business!.publicSlug || "this business",
        category: business!.category,
        rating,
        experience,
        employeeName,
      });
      if (!res.ok) {
        throw new Error("Failed to generate review. Please check your Gemini API Key.");
      }
      return res.json() as Promise<{ review: string }>;
    },
    onSuccess: async (data: any) => {
      setGeneratedReview(data.review);
      // Auto copy and redirect just like before
      try { await navigator.clipboard.writeText(data.review); } catch {}
      setCopied(true);
      await feedbackMutation.mutateAsync({ generatedReview: data.review });
      toast({
        title: "Review Copied!",
        description: "Redirecting you to Google to paste your review...",
      });
      setTimeout(() => {
        if (business?.googleReviewUrl) window.open(business.googleReviewUrl, "_blank");
      }, 1500);
      setStep("review-draft"); // We can still show it in case popup blocker blocks the redirect
    },
    onError: (err: any) => {
      setStep("high-form");
      toast({
        title: "Error",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  });

  const feedbackMutation = useMutation({
    mutationFn: async (data: { feedbackText?: string; generatedReview?: string }) => {
      await apiRequest("POST", "/api/feedback", {
        businessId: business!.id,
        rating,
        feedbackText: data.feedbackText || "",
        generatedReview: data.generatedReview || "",
      });
    },
  });

  const handleRatingSelect = (r: number) => {
    setRating(r);
  };

  const handleRatingContinue = () => {
    if (!rating) return;
    if (rating >= 4) setStep("high-form");
    else setStep("low-form");
  };

  const handleGenerateReview = () => {
    setStep("generating");
    generateMutation.mutate();
  };

  const handleRegenerateReview = () => {
    setStep("generating");
    generateMutation.mutate();
  };

  const handleCopyAndPost = async () => {
    try { await navigator.clipboard.writeText(generatedReview); } catch {}
    setCopied(true);
    await feedbackMutation.mutateAsync({ generatedReview });
    setTimeout(() => {
      if (business?.googleReviewUrl) window.open(business.googleReviewUrl, "_blank");
    }, 400);
  };

  const handleCopyOnly = async () => {
    try {
      await navigator.clipboard.writeText(generatedReview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handlePrivateFeedback = async () => {
    await feedbackMutation.mutateAsync({ feedbackText: privateFeedback });
    setStep("low-thanks");
  };

  const displayRating = hovered || rating;

  if (bizLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#6D28D9]" size={32} />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex flex-col items-center justify-center text-center px-4">
        <p className="text-2xl font-bold text-[#111827] mb-2">Page not found</p>
        <p className="text-[#6B7280] text-sm">This review link is invalid or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col font-['Poppins',sans-serif]">
      {/* Subtle background accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#6D28D9]/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#A855F7]/8 rounded-full blur-3xl" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo + Brand */}
          <div className="flex flex-col items-center mb-8">
            {business.logo ? (
              <img src={business.logo} alt={business.name} className="w-16 h-16 rounded-2xl object-cover shadow-md mb-3" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#F5F3FF] flex items-center justify-center text-2xl font-bold text-[#6D28D9] shadow-sm mb-3">
                {business.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <p className="text-[#A855F7] text-xs font-semibold tracking-widest uppercase">REVIEWAI</p>
          </div>

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/60 shadow-xl shadow-[#6D28D9]/5 px-6 py-8">

            {/* Step: Rating */}
            {step === "rating" && (
              <div className="flex flex-col items-center gap-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-[#111827] leading-snug">
                    How was your experience<br />at <span className="text-[#6D28D9]">{business.name}</span>?
                  </h1>
                  <p className="text-[#6B7280] text-sm mt-2">Your feedback helps us improve and supports local businesses.</p>
                </div>

                <div
                  className="flex gap-2 items-center"
                  onMouseLeave={() => setHovered(0)}
                >
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      onMouseEnter={() => setHovered(s)}
                      onClick={() => handleRatingSelect(s)}
                      className={`text-4xl transition-all duration-100 hover:scale-110 active:scale-95 leading-none cursor-pointer ${
                        s <= displayRating ? "grayscale-0" : "grayscale opacity-30"
                      }`}
                      data-testid={`button-star-${s}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>

                {rating > 0 && (
                  <div className="text-sm text-[#6B7280]">
                    {rating === 1 && "That bad? We're sorry."}
                    {rating === 2 && "Not great. Help us improve."}
                    {rating === 3 && "Room for improvement."}
                    {rating === 4 && "Great! We're glad you enjoyed it."}
                    {rating === 5 && "Amazing! We love hearing that! 🎉"}
                  </div>
                )}

                <button
                  onClick={handleRatingContinue}
                  disabled={!rating}
                  className="w-full py-3 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-semibold rounded-2xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  data-testid="button-continue"
                >
                  {rating ? "Continue" : "Select a rating to continue"}
                </button>
              </div>
            )}

            {/* Step: High Rating Form (4-5 stars) */}
            {step === "high-form" && (
              <div className="flex flex-col gap-5">
                <div className="text-center">
                  <div className="text-2xl mb-1">{"⭐".repeat(rating)}</div>
                  <h2 className="text-lg font-bold text-[#111827]">Tell us more!</h2>
                  <p className="text-[#6B7280] text-sm mt-1">Your answers help us write an authentic review for Google.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">
                    What did you enjoy most? <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    rows={3}
                    placeholder="e.g. The coffee was incredible and the atmosphere was so cozy…"
                    className="w-full px-4 py-3 rounded-xl border border-[#ECECF2] bg-[#FAFAFC] text-[#111827] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition-colors resize-none"
                    data-testid="textarea-experience"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">
                    Who helped you today? <span className="text-[#9CA3AF] font-normal text-xs">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={employeeName}
                    onChange={e => setEmployeeName(e.target.value)}
                    placeholder="e.g. Sarah"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#ECECF2] bg-[#FAFAFC] text-[#111827] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition-colors"
                    data-testid="input-employee"
                  />
                </div>

                <button
                  onClick={handleGenerateReview}
                  disabled={!experience.trim()}
                  className="w-full py-3 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-semibold rounded-2xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  data-testid="button-generate"
                >
                  ✨ Generate Review
                </button>
                <button
                  onClick={() => setStep("rating")}
                  className="text-sm text-[#9CA3AF] hover:text-[#6B7280] transition-colors text-center"
                >
                  ← Back
                </button>
              </div>
            )}

            {/* Step: Generating */}
            {step === "generating" && <LoadingSpinner />}

            {/* Step: Review Draft */}
            {step === "review-draft" && (
              <div className="flex flex-col gap-5">
                <div className="text-center">
                  <div className="text-2xl mb-1">🎉</div>
                  <h2 className="text-lg font-bold text-[#111827]">Your Review Draft</h2>
                  <p className="text-[#6B7280] text-sm mt-1">Edit it if you'd like, then post it on Google.</p>
                </div>

                <textarea
                  value={generatedReview}
                  onChange={e => setGeneratedReview(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-[#6D28D9]/30 bg-[#FAFAFC] text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition-colors resize-none leading-relaxed"
                  data-testid="textarea-review"
                />

                <div className="flex gap-2">
                  <button
                    onClick={handleRegenerateReview}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#ECECF2] text-sm font-medium text-[#6B7280] hover:bg-[#FAFAFC] transition-colors"
                    data-testid="button-regenerate"
                  >
                    <RefreshCw size={14} /> Regenerate
                  </button>
                  <button
                    onClick={handleCopyOnly}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#ECECF2] text-sm font-medium text-[#6B7280] hover:bg-[#FAFAFC] transition-colors"
                    data-testid="button-copy"
                  >
                    {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                  </button>
                </div>

                {business.googleReviewUrl ? (
                  <button
                    onClick={handleCopyAndPost}
                    disabled={feedbackMutation.isPending}
                    className="w-full py-3 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2"
                    data-testid="button-post-google"
                  >
                    <ExternalLink size={15} />
                    {feedbackMutation.isPending ? "Opening…" : "Copy & Post on Google"}
                  </button>
                ) : (
                  <button
                    onClick={handleCopyOnly}
                    className="w-full py-3 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy size={15} /> Copy Review
                  </button>
                )}
              </div>
            )}

            {/* Step: Low Rating Form (1-3 stars) */}
            {step === "low-form" && (
              <div className="flex flex-col gap-5">
                <div className="text-center">
                  <div className="text-3xl mb-2">😟</div>
                  <h2 className="text-lg font-bold text-[#111827]">We're sorry your experience wasn't perfect.</h2>
                  <p className="text-[#6B7280] text-sm mt-1">Your private feedback helps us improve. It won't be posted publicly.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">Tell us what happened…</label>
                  <textarea
                    value={privateFeedback}
                    onChange={e => setPrivateFeedback(e.target.value)}
                    rows={4}
                    placeholder="What could we have done better?"
                    className="w-full px-4 py-3 rounded-xl border border-[#ECECF2] bg-[#FAFAFC] text-[#111827] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition-colors resize-none"
                    data-testid="textarea-private-feedback"
                  />
                </div>

                <button
                  onClick={handlePrivateFeedback}
                  disabled={feedbackMutation.isPending}
                  className="w-full py-3 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-semibold rounded-2xl transition-colors disabled:opacity-60"
                  data-testid="button-send-feedback"
                >
                  {feedbackMutation.isPending ? "Sending…" : "Send Private Feedback"}
                </button>
                <button
                  onClick={() => setStep("rating")}
                  className="text-sm text-[#9CA3AF] hover:text-[#6B7280] transition-colors text-center"
                >
                  ← Back
                </button>
              </div>
            )}

            {/* Step: Low Rating Thank You */}
            {step === "low-thanks" && (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="text-4xl">🙏</div>
                <h2 className="text-lg font-bold text-[#111827]">Thank you for helping us improve.</h2>
                <p className="text-[#6B7280] text-sm">Your feedback has been received. We take every comment seriously and will work to do better.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center gap-3 mt-6 opacity-50">
            <p className="text-xs text-[#6B7280] flex items-center gap-1.5">🔒 Verified & Secure Feedback</p>
            <div className="flex gap-4 text-xs text-[#9CA3AF]">
              <span className="cursor-pointer hover:text-[#6B7280]">Terms</span>
              <span className="cursor-pointer hover:text-[#6B7280]">Privacy Policy</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center">
        <p className="text-xs text-[#9CA3AF] tracking-widest uppercase">Powered by Adshree Inc.</p>
      </footer>
    </div>
  );
}
