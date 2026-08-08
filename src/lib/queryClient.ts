import { db, auth } from "./firebase";
import { doc, updateDoc, collection, addDoc, getDoc } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function apiRequest(
  method: string,
  url: string,
  data?: any,
): Promise<Response> {
  const uid = auth.currentUser?.uid;

  try {
    if (url === "/api/business" && method === "PUT") {
      if (!uid) throw new Error("Not authenticated");
      const docRef = doc(db, "businesses", uid);
      await updateDoc(docRef, data);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    if (url === "/api/feedback" && method === "POST") {
      const feedbacksRef = collection(db, "feedbacks");
      await addDoc(feedbacksRef, {
        ...data,
        createdAt: new Date().toISOString()
      });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    if (url === "/api/generate-review" && method === "POST") {
      const { businessId, businessName, category, rating, experience, employeeName } = data;
      
      // Limit Checking Logic
      if (businessId) {
        const docRef = doc(db, "businesses", businessId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const bData = docSnap.data();
          const plan = bData.plan || "free";
          const planStartDate = bData.planStartDate ? new Date(bData.planStartDate) : new Date();
          let dailyAiCount = bData.dailyAiCount || 0;
          let lastAiGenDate = bData.lastAiGenDate || "";
          let monthlyAiCount = bData.monthlyAiCount || 0;
          let lastAiGenMonth = bData.lastAiGenMonth || "";
          
          const today = new Date().toISOString().split('T')[0];
          const thisMonth = today.substring(0, 7); // YYYY-MM
          
          if (lastAiGenDate !== today) {
            dailyAiCount = 0;
            lastAiGenDate = today;
          }
          if (lastAiGenMonth !== thisMonth) {
            monthlyAiCount = 0;
            lastAiGenMonth = thisMonth;
          }
          
          if (plan === "free") {
            // Check 3-day trial
            const daysSinceStart = Math.floor((new Date().getTime() - planStartDate.getTime()) / (1000 * 3600 * 24));
            if (daysSinceStart > 3) {
              return new Response(JSON.stringify({ error: "Upgrade plan today, review generation limit has expired." }), { status: 403 });
            }
            
            // Check daily limit (10)
            if (dailyAiCount >= 10) {
              return new Response(JSON.stringify({ error: "Daily limit of 10 AI reviews reached for the Free Plan." }), { status: 403 });
            }
          } else if (plan === "pro") {
             // Check monthly limit (100)
            if (monthlyAiCount >= 100) {
              return new Response(JSON.stringify({ error: "Monthly limit of 100 AI reviews reached for the Pro Plan." }), { status: 403 });
            }
          }
          
          // Increment limits before generation
          await updateDoc(docRef, {
            dailyAiCount: dailyAiCount + 1,
            lastAiGenDate: today,
            monthlyAiCount: monthlyAiCount + 1,
            lastAiGenMonth: thisMonth
          });
        }
      }

      const prompt = `Write 3 different, authentic-sounding Google review options for a ${category} named "${businessName}".
The user gave a rating of ${rating} out of 5 stars.
${experience ? `Their experience: "${experience}"` : "The user did not provide specific details, so write a general positive review based on the rating and business type."}
${employeeName ? `They were helped by an employee named ${employeeName}.` : ""}

Guidelines:
- Keep each option under 3-4 sentences.
- Make them sound like real people wrote them, with slightly different tones or focuses.
- Do not include any brackets, placeholders, or quotes around the reviews.
- RETURN EXACTLY a JSON array containing the 3 review strings. No markdown formatting, just the raw JSON array. Example: ["review 1", "review 2", "review 3"]`;

      const genModel = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest",
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await genModel.generateContent(prompt);
      const text = result.response.text();
      
      let reviews = [];
      try {
        reviews = JSON.parse(text);
        if (!Array.isArray(reviews)) reviews = [text];
      } catch (e) {
        reviews = [text];
      }
      
      return new Response(JSON.stringify({ reviews }), { status: 200, headers: { 'Content-Type': 'application/json' }});
    }

    return new Response(JSON.stringify({ error: "Route not found" }), { status: 404 });
  } catch (error: any) {
    console.error("API Error", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
