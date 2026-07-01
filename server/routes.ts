import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import bcrypt from "bcryptjs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import QRCode from "qrcode";
import pg from "pg";
import { storage } from "./storage";
import { signupSchema, loginSchema } from "@shared/schema";

const PgSession = connectPgSimple(session);
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

function getGemini() {
  if (!process.env.OPENAI_API_KEY) return null;
  return new GoogleGenerativeAI(process.env.OPENAI_API_KEY);
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.use(
    session({
      store: new PgSession({ pool, createTableIfMissing: true }),
      secret: process.env.SESSION_SECRET || "reviewai-secret-key-change-in-prod",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 },
    })
  );

  // ── AUTH ─────────────────────────────────────────────────────────────────────

  app.post("/api/auth/signup", async (req, res) => {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ message: result.error.issues[0].message });
    const { email, password } = result.data;

    const existing = await storage.getUserByEmail(email);
    if (existing) return res.status(409).json({ message: "An account with this email already exists" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await storage.createUser({ email, passwordHash });

    // Create a default business for the user
    const slug = `${slugify(email.split("@")[0])}-${Date.now().toString(36)}`;
    await storage.createBusiness({
      userId: user.id,
      name: "",
      category: "",
      logo: "",
      googleReviewUrl: "",
      publicSlug: slug,
    });

    req.session.userId = user.id;
    res.json({ user: { id: user.id, email: user.email } });
  });

  app.post("/api/auth/login", async (req, res) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ message: "Invalid credentials" });
    const { email, password } = result.data;

    const user = await storage.getUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid email or password" });

    req.session.userId = user.id;
    res.json({ user: { id: user.id, email: user.email } });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {});
    res.json({ ok: true });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session?.userId) return res.status(401).json({ message: "Not authenticated" });
    const user = await storage.getUserById(req.session.userId);
    if (!user) return res.status(401).json({ message: "Not authenticated" });
    res.json({ user: { id: user.id, email: user.email } });
  });

  // ── BUSINESS ─────────────────────────────────────────────────────────────────

  app.get("/api/business", requireAuth, async (req, res) => {
    const business = await storage.getBusinessByUserId(req.session.userId!);
    if (!business) return res.status(404).json({ message: "No business found" });
    res.json(business);
  });

  app.put("/api/business", requireAuth, async (req, res) => {
    const business = await storage.getBusinessByUserId(req.session.userId!);
    if (!business) return res.status(404).json({ message: "No business found" });

    const { name, category, logo, googleReviewUrl } = req.body;
    const updated = await storage.updateBusiness(business.id, {
      name: name ?? business.name,
      category: category ?? business.category,
      logo: logo ?? business.logo,
      googleReviewUrl: googleReviewUrl ?? business.googleReviewUrl,
    });
    res.json(updated);
  });

  // Public: get business by slug
  app.get("/api/r/:slug", async (req, res) => {
    const business = await storage.getBusinessBySlug(req.params.slug);
    if (!business) return res.status(404).json({ message: "Business not found" });
    // Only expose safe fields
    res.json({
      id: business.id,
      name: business.name,
      category: business.category,
      logo: business.logo,
      googleReviewUrl: business.googleReviewUrl,
    });
  });

  // QR code for business
  app.get("/api/business/qr", requireAuth, async (req, res) => {
    const business = await storage.getBusinessByUserId(req.session.userId!);
    if (!business) return res.status(404).json({ message: "No business found" });
    const url = `${req.protocol}://${req.get("host")}/r/${business.publicSlug}`;
    const qrDataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "M",
      margin: 2,
      color: { dark: "#6D28D9", light: "#FFFFFF" },
    });
    res.json({ qr: qrDataUrl, url });
  });

  // ── FEEDBACK ──────────────────────────────────────────────────────────────────

  app.get("/api/feedback", requireAuth, async (req, res) => {
    const business = await storage.getBusinessByUserId(req.session.userId!);
    if (!business) return res.status(404).json({ message: "No business found" });
    const items = await storage.getFeedbackByBusinessId(business.id);
    res.json(items);
  });

  app.post("/api/feedback", async (req, res) => {
    const { businessId, rating, feedbackText, generatedReview } = req.body;
    if (!businessId || !rating) return res.status(400).json({ message: "businessId and rating are required" });
    if (rating < 1 || rating > 5) return res.status(400).json({ message: "Rating must be 1-5" });
    const item = await storage.createFeedback({ businessId, rating, feedbackText: feedbackText || "", generatedReview: generatedReview || "" });
    res.json(item);
  });

  // ── DASHBOARD STATS ───────────────────────────────────────────────────────────

  app.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    const business = await storage.getBusinessByUserId(req.session.userId!);
    if (!business) return res.status(404).json({ message: "No business found" });
    const stats = await storage.getDashboardStats(business.id);
    res.json(stats);
  });

  // ── AI REVIEW GENERATION ──────────────────────────────────────────────────────

  app.post("/api/generate-review", async (req, res) => {
    const { businessName, category, rating, experience, employeeName } = req.body;
    if (!rating) return res.status(400).json({ message: "rating is required" });
    const resolvedName = businessName || "this business";

    const gemini = getGemini();
    if (!gemini) {
      return res.json({
        review: `Had a wonderful experience at ${resolvedName}. The staff were attentive and the quality was excellent. Will definitely be coming back soon!`,
      });
    }

    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
    const prompt = `You are an expert review writing assistant. Write natural Google reviews that sound like genuine customers. Never mention AI. Never sound robotic.

Business Name: ${resolvedName}
Business Type: ${category || "local business"}
Star Rating: ${rating}/5 ${stars}
Customer Experience: ${experience || "No additional comments provided."}
Staff Name: ${employeeName || "Not provided."}

Write ONE authentic Google review that sounds like it was written naturally by a real customer.

Rules:
- The review MUST naturally mention the business name "${resolvedName}" at least once.
- Base the review primarily on the star rating.
- If the customer wrote additional comments, use them naturally in the review.
- If the customer didn't write anything, create a believable review based only on the star rating and business type.
- If a staff name is provided, mention it naturally. If not provided, never invent a person's name.
- Never fabricate specific experiences that the customer did not provide.
- Keep the tone human, conversational, and trustworthy.
- Every generation should have different wording and sentence structure.
- Never sound robotic or AI-generated.
- Avoid clichés like "I highly recommend this place" in every response.
- Do not overuse words like amazing, outstanding, excellent, perfect, or fantastic.
- Keep the review between 40 and 100 words.
- Use proper grammar and punctuation.
- Return ONLY the review text without quotation marks, titles, or explanations.`;

    const model = gemini.getGenerativeModel(
      { model: "gemini-2.5-flash" },
      { apiVersion: "v1" }
    );
    const result = await model.generateContent(prompt);
    const review = result.response.text().trim();
    res.json({ review });
  });

  return httpServer;
}
