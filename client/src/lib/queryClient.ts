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
      const { businessName, category, rating, experience, employeeName } = data;
      
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
        model: "gemini-2.5-flash",
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
