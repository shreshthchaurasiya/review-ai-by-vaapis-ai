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
      
      const prompt = `Write a short, authentic-sounding Google review for a ${category} named "${businessName}".
The user gave a rating of ${rating} out of 5 stars.
Their experience: "${experience}"
${employeeName ? `They were helped by an employee named ${employeeName}.` : ""}

Guidelines:
- Keep it under 3-4 sentences.
- Sound like a real person writing it.
- Mention the employee if provided.
- Do not include any brackets, placeholders, or quotes around the review. Just the raw text.`;

      const genModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await genModel.generateContent(prompt);
      const reviewText = result.response.text();
      
      return new Response(JSON.stringify({ review: reviewText }), { status: 200, headers: { 'Content-Type': 'application/json' }});
    }

    return new Response(JSON.stringify({ error: "Route not found" }), { status: 404 });
  } catch (error: any) {
    console.error("API Error", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
