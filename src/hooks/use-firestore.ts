import { useState, useEffect, useCallback } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, addDoc, orderBy } from "firebase/firestore";
import QRCode from "qrcode";
import type { Business, Feedback } from "@/lib/types";

// Helper to wait for auth to initialize
const getUserId = () => auth.currentUser?.uid;

type QueryOptions = {
  queryKey: string[];
  retry?: boolean;
};

export function useQuery<T = any>({ queryKey }: QueryOptions) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuery = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const path = queryKey[0];
      
      // /api/business -> Get current user's business
      if (path === "/api/business") {
        const uid = getUserId();
        if (!uid) {
          setData(undefined);
          return;
        }
        const docRef = doc(db, "businesses", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as any);
        } else {
          setData(undefined);
        }
      }
      
      // /api/business/qr -> Generate QR code for current business
      else if (path === "/api/business/qr") {
        const uid = getUserId();
        if (!uid) {
          setData(undefined);
          return;
        }
        const url = `${window.location.origin}/r/${uid}`;
        const qr = await QRCode.toDataURL(url, { width: 400, margin: 2 });
        setData({ qr, url } as any);
      }
      
      // /api/r/:slug -> Get public business details
      else if (path.startsWith("/api/r/")) {
        const slug = path.split("/")[3]; // /api/r/:slug
        if (!slug) return;
        const docRef = doc(db, "businesses", slug);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as any);
        } else {
          setData(undefined);
        }
      }
      
      // /api/feedback -> Get feedbacks for current business
      else if (path === "/api/feedback") {
        const uid = getUserId();
        if (!uid) return;
        const q = query(collection(db, "feedbacks"), where("businessId", "==", uid));
        const querySnapshot = await getDocs(q);
        const feedbacks: any[] = [];
        querySnapshot.forEach((doc) => {
          feedbacks.push({ id: doc.id, ...doc.data() });
        });
        // Sort by createdAt descending locally to avoid requiring Firestore composite index
        feedbacks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setData(feedbacks as any);
      }
      
      // /api/dashboard/stats -> Compute dashboard stats
      else if (path === "/api/dashboard/stats") {
        const uid = getUserId();
        if (!uid) return;
        const q = query(collection(db, "feedbacks"), where("businessId", "==", uid));
        const querySnapshot = await getDocs(q);
        let totalRatings = 0;
        let sumRating = 0;
        let aiReviewsGenerated = 0;
        let privateFeedback = 0;
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          totalRatings++;
          sumRating += data.rating || 0;
          if (data.generatedReview) aiReviewsGenerated++;
          if (data.rating <= 3) privateFeedback++;
        });
        
        setData({
          totalRatings,
          avgRating: totalRatings > 0 ? Number((sumRating / totalRatings).toFixed(1)) : 0,
          aiReviewsGenerated,
          privateFeedback
        } as any);
      }
    } catch (e: any) {
      setError(e);
      console.error("useQuery error:", e);
    } finally {
      setIsLoading(false);
    }
  }, [queryKey[0]]);

  useEffect(() => {
    // We use onAuthStateChanged so the query fires when auth is ready
    const unsubscribe = auth.onAuthStateChanged((user) => {
      fetchQuery();
    });
    return () => unsubscribe();
  }, [fetchQuery]);

  return { data, isLoading, error, refetch: fetchQuery };
}

export function useMutation({ mutationFn, onSuccess, onError }: any) {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (...args: any[]) => {
    setIsPending(true);
    try {
      // Mocked mutation logic replaced by actual API matching
      let result;
      // We pass the args to mutationFn which previously called apiRequest
      // But now we can just implement the mutation directly inside mutationFn or here
      result = await mutationFn(...args);
      if (onSuccess) onSuccess(result);
    } catch (e: any) {
      console.error("Mutation error", e);
      if (onError) onError(e);
    } finally {
      setIsPending(false);
    }
  };
  
  const mutateAsync = async (...args: any[]) => {
    return mutate(...args);
  };

  return { mutate, mutateAsync, isPending };
}

// Minimal mock to replace queryClient.invalidateQueries
export function useQueryClient() {
  return {
    invalidateQueries: async ({ queryKey }: any) => {
      // Just a dummy, since useQuery doesn't have a global cache store here
      // But we can trigger a hard reload if needed or leave it as no-op 
      // because we refresh the page or states manually in a simple implementation.
      console.log("Invalidate", queryKey);
    }
  };
}
