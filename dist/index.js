var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  gameScores: () => gameScores,
  gameScoresRelations: () => gameScoresRelations,
  insertGameScoreSchema: () => insertGameScoreSchema,
  insertUserProgressSchema: () => insertUserProgressSchema,
  insertUserSchema: () => insertUserSchema,
  userProgress: () => userProgress,
  userProgressRelations: () => userProgressRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import { pgTable, text, serial, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var gameScores = pgTable("game_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  level: integer("level").notNull(),
  score: integer("score").notNull(),
  timeElapsed: integer("time_elapsed").notNull(),
  // in seconds
  movesUsed: integer("moves_used").notNull(),
  maxMoves: integer("max_moves").notNull(),
  completedFormulas: json("completed_formulas").$type().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  highestLevel: integer("highest_level").default(1).notNull(),
  totalScore: integer("total_score").default(0).notNull(),
  gamesPlayed: integer("games_played").default(0).notNull(),
  bestTime: integer("best_time"),
  // best time in seconds for any level
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var usersRelations = relations(users, ({ many, one }) => ({
  gameScores: many(gameScores),
  progress: one(userProgress, {
    fields: [users.id],
    references: [userProgress.userId]
  })
}));
var gameScoresRelations = relations(gameScores, ({ one }) => ({
  user: one(users, {
    fields: [gameScores.userId],
    references: [users.id]
  })
}));
var userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id]
  })
}));
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertGameScoreSchema = createInsertSchema(gameScores).omit({
  id: true,
  createdAt: true
});
var insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  updatedAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
var connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL or POSTGRES_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc } from "drizzle-orm";
var DatabaseStorage = class {
  // User management
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  // Game scores
  async saveGameScore(gameScore) {
    const [score] = await db.insert(gameScores).values(gameScore).returning();
    return score;
  }
  async getUserGameScores(userId) {
    return await db.select().from(gameScores).where(eq(gameScores.userId, userId)).orderBy(desc(gameScores.createdAt));
  }
  async getTopScores(limit = 10) {
    return await db.select().from(gameScores).orderBy(desc(gameScores.score)).limit(limit);
  }
  // User progress
  async getUserProgress(userId) {
    const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
    return progress || void 0;
  }
  async updateUserProgress(userId, progressData) {
    const [progress] = await db.update(userProgress).set({ ...progressData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(userProgress.userId, userId)).returning();
    return progress;
  }
  async createUserProgress(progress) {
    const [newProgress] = await db.insert(userProgress).values(progress).returning();
    return newProgress;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await storage.createUser(userData);
      await storage.createUserProgress({
        userId: user.id,
        highestLevel: 1,
        totalScore: 0,
        gamesPlayed: 0,
        bestTime: null
      });
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.post("/api/game/score", async (req, res) => {
    try {
      const scoreData = insertGameScoreSchema.parse(req.body);
      const score = await storage.saveGameScore(scoreData);
      const progress = await storage.getUserProgress(scoreData.userId);
      if (progress) {
        const updates = {
          gamesPlayed: progress.gamesPlayed + 1,
          totalScore: progress.totalScore + scoreData.score
        };
        if (scoreData.level > progress.highestLevel) {
          updates.highestLevel = scoreData.level;
        }
        if (!progress.bestTime || scoreData.timeElapsed < progress.bestTime) {
          updates.bestTime = scoreData.timeElapsed;
        }
        await storage.updateUserProgress(scoreData.userId, updates);
      }
      res.json(score);
    } catch (error) {
      res.status(400).json({ message: "Invalid score data" });
    }
  });
  app2.get("/api/game/scores/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const scores = await storage.getUserGameScores(userId);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/game/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const topScores = await storage.getTopScores(limit);
      res.json(topScores);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/user/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgress(userId);
      if (!progress) {
        return res.status(404).json({ message: "User progress not found" });
      }
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "..", "dist", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = process.env.PORT || 3e3;
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
