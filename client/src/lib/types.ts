export interface Business {
  id: string;
  userId: string;
  name: string;
  slug: string;
  logoUrl?: string;
  googleReviewLink?: string;
  placeId?: string;
  themeColor: string;
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
