export interface Business {
  id: string;
  userId: string;
  name: string;
  slug: string;
  logoUrl?: string;
  googleReviewUrl?: string;
  category?: string;
  placeId?: string;
  themeColor: string;
  plan?: "free" | "pro";
  planStartDate?: string;
  dailyAiCount?: number;
  lastAiGenDate?: string;
  monthlyAiCount?: number;
  lastAiGenMonth?: string;
}

export interface Feedback {
  id: string;
  businessId: string;
  rating: number;
  feedbackText?: string;
  generatedReview?: string;
  customerName?: string;
  customerEmail?: string;
  createdAt: string;
}
