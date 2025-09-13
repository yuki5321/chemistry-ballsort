import { 
  users, 
  gameScores, 
  userProgress,
  type User, 
  type InsertUser,
  type GameScore,
  type InsertGameScore,
  type UserProgress,
  type InsertUserProgress
} from "../shared/schema.js";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game scores
  saveGameScore(gameScore: InsertGameScore): Promise<GameScore>;
  getUserGameScores(userId: number): Promise<GameScore[]>;
  getTopScores(limit?: number): Promise<GameScore[]>;
  
  // User progress
  getUserProgress(userId: number): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, progress: Partial<InsertUserProgress>): Promise<UserProgress>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
}

import { db } from "./db.js";
import { eq, desc } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Game scores
  async saveGameScore(gameScore: InsertGameScore): Promise<GameScore> {
    const [score] = await db
      .insert(gameScores)
      .values(gameScore)
      .returning();
    return score;
  }

  async getUserGameScores(userId: number): Promise<GameScore[]> {
    return await db
      .select()
      .from(gameScores)
      .where(eq(gameScores.userId, userId))
      .orderBy(desc(gameScores.createdAt));
  }

  async getTopScores(limit: number = 10): Promise<GameScore[]> {
    return await db
      .select()
      .from(gameScores)
      .orderBy(desc(gameScores.score))
      .limit(limit);
  }

  // User progress
  async getUserProgress(userId: number): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
    return progress || undefined;
  }

  async updateUserProgress(userId: number, progressData: Partial<InsertUserProgress>): Promise<UserProgress> {
    const [progress] = await db
      .update(userProgress)
      .set({ ...progressData, updatedAt: new Date() })
      .where(eq(userProgress.userId, userId))
      .returning();
    return progress;
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [newProgress] = await db
      .insert(userProgress)
      .values(progress)
      .returning();
    return newProgress;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gameScores: Map<number, GameScore>;
  private userProgressMap: Map<number, UserProgress>;
  currentId: number;
  currentScoreId: number;
  currentProgressId: number;

  constructor() {
    this.users = new Map();
    this.gameScores = new Map();
    this.userProgressMap = new Map();
    this.currentId = 1;
    this.currentScoreId = 1;
    this.currentProgressId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async saveGameScore(gameScore: InsertGameScore): Promise<GameScore> {
    const id = this.currentScoreId++;
    const score: GameScore = { 
      ...gameScore, 
      id, 
      createdAt: new Date(),
      completedFormulas: gameScore.completedFormulas as string[]
    };
    this.gameScores.set(id, score);
    return score;
  }

  async getUserGameScores(userId: number): Promise<GameScore[]> {
    return Array.from(this.gameScores.values())
      .filter(score => score.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTopScores(limit: number = 10): Promise<GameScore[]> {
    return Array.from(this.gameScores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async getUserProgress(userId: number): Promise<UserProgress | undefined> {
    return Array.from(this.userProgressMap.values()).find(p => p.userId === userId);
  }

  async updateUserProgress(userId: number, progressData: Partial<InsertUserProgress>): Promise<UserProgress> {
    const existing = await this.getUserProgress(userId);
    if (existing) {
      const updated = { ...existing, ...progressData, updatedAt: new Date() };
      this.userProgressMap.set(existing.id, updated);
      return updated;
    }
    throw new Error("User progress not found");
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const id = this.currentProgressId++;
    const newProgress: UserProgress = { 
      id,
      userId: progress.userId,
      highestLevel: progress.highestLevel ?? 1,
      totalScore: progress.totalScore ?? 0,
      gamesPlayed: progress.gamesPlayed ?? 0,
      bestTime: progress.bestTime ?? null,
      updatedAt: new Date()
    };
    this.userProgressMap.set(id, newProgress);
    return newProgress;
  }
}

export const storage = new DatabaseStorage();
