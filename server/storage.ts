import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users, businesses, feedback,
  type User, type InsertUser,
  type Business, type InsertBusiness,
  type Feedback, type InsertFeedback,
} from "@shared/schema";
import { sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Businesses
  getBusinessByUserId(userId: string): Promise<Business | undefined>;
  getBusinessBySlug(slug: string): Promise<Business | undefined>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(id: string, updates: Partial<InsertBusiness>): Promise<Business>;

  // Feedback
  getFeedbackByBusinessId(businessId: string): Promise<Feedback[]>;
  createFeedback(item: InsertFeedback): Promise<Feedback>;
  getDashboardStats(businessId: string): Promise<{
    totalRatings: number;
    avgRating: number;
    aiReviewsGenerated: number;
    privateFeedback: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getBusinessByUserId(userId: string): Promise<Business | undefined> {
    const [business] = await db.select().from(businesses).where(eq(businesses.userId, userId));
    return business;
  }

  async getBusinessBySlug(slug: string): Promise<Business | undefined> {
    const [business] = await db.select().from(businesses).where(eq(businesses.publicSlug, slug));
    return business;
  }

  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    const [business] = await db.insert(businesses).values(insertBusiness).returning();
    return business;
  }

  async updateBusiness(id: string, updates: Partial<InsertBusiness>): Promise<Business> {
    const [business] = await db
      .update(businesses)
      .set(updates)
      .where(eq(businesses.id, id))
      .returning();
    return business;
  }

  async getFeedbackByBusinessId(businessId: string): Promise<Feedback[]> {
    return db
      .select()
      .from(feedback)
      .where(eq(feedback.businessId, businessId))
      .orderBy(desc(feedback.createdAt));
  }

  async createFeedback(item: InsertFeedback): Promise<Feedback> {
    const [created] = await db.insert(feedback).values(item).returning();
    return created;
  }

  async getDashboardStats(businessId: string): Promise<{
    totalRatings: number;
    avgRating: number;
    aiReviewsGenerated: number;
    privateFeedback: number;
  }> {
    const items = await db.select().from(feedback).where(eq(feedback.businessId, businessId));
    const totalRatings = items.length;
    const avgRating = totalRatings > 0
      ? Math.round((items.reduce((s, f) => s + f.rating, 0) / totalRatings) * 10) / 10
      : 0;
    const aiReviewsGenerated = items.filter(f => f.generatedReview && f.generatedReview.length > 0).length;
    const privateFeedback = items.filter(f => f.rating <= 3).length;
    return { totalRatings, avgRating, aiReviewsGenerated, privateFeedback };
  }
}

export const storage = new DatabaseStorage();
