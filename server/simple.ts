import express, { type Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import { storage } from "./storage.js";
import { insertUserSchema, insertGameScoreSchema } from "../shared/schema.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static file serving
const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// API Routes
app.post("/api/auth/register", async (req, res) => {
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
      bestTime: null,
    });
    
    res.json({ user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(400).json({ message: "Invalid user data" });
  }
});

app.post("/api/auth/login", async (req, res) => {
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

app.post("/api/game/score", async (req, res) => {
  try {
    const scoreData = insertGameScoreSchema.parse(req.body);
    const score = await storage.saveGameScore(scoreData);
    
    const progress = await storage.getUserProgress(scoreData.userId);
    if (progress) {
      const updates: any = {
        gamesPlayed: progress.gamesPlayed + 1,
        totalScore: progress.totalScore + scoreData.score,
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

app.get("/api/game/scores/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const scores = await storage.getUserGameScores(userId);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/game/leaderboard", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const topScores = await storage.getTopScores(limit);
    res.json(topScores);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/user/progress/:userId", async (req, res) => {
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

// Error handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Serve React app for all other routes
app.get("*", (_req, res) => {
  const indexPath = path.resolve(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Fallback: serve a simple HTML page
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Chemistry Ball Sort</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1>Chemistry Ball Sort Game</h1>
          <p>Loading...</p>
          <p>If you see this message, the app is still building. Please wait a moment and refresh.</p>
        </body>
      </html>
    `);
  }
});

const httpServer = createServer(app);
const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
