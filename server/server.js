import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import { Server } from "socket.io";
import studentRoutes from "./routes/studentRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import credentialRoutes from "./routes/credentialRoutes.js";
import StudentAuth from "./models/StudentAuth.js";
import Company from "./models/Company.js";

dotenv.config();

const app = express();
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
};
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: corsOptions });
const PORT = process.env.PORT || 5001;
let gameStarted = false;

const isDbReady = () => mongoose.connection.readyState === 1;

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/readyz", (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ status: "not-ready", db: "disconnected" });
  }
  return res.status(200).json({ status: "ready", db: "connected" });
});

// ─── AUTH CHECK ───────────────────────────────────────────────────────────────
// GET /api/auth/me — JWT-only, no DB needed. Defined before the DB-readiness
// gate so a temporarily disconnected database doesn't log users out.
app.get("/api/auth/me", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.json({ id: null });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ id: decoded.id, type: decoded.type });
  } catch {
    res.json({ id: null });
  }
});

app.use("/api", (req, res, next) => {
  if (!isDbReady()) {
    return res.status(503).json({
      message: "Service temporarily unavailable. Database is not connected.",
    });
  }
  return next();
});

// ─── ATTENDING COUNT ──────────────────────────────────────────────────────────
// GET /api/count — returns combined student + company count
// Cached for 60 s so repeated page loads don't hit MongoDB every time.
let countCache = { value: null, at: 0 };
const COUNT_TTL = 60_000;

app.get("/api/count", async (req, res) => {
  if (countCache.value !== null && Date.now() - countCache.at < COUNT_TTL) {
    return res.json(countCache.value);
  }
  try {
    const [students, companies] = await Promise.all([
      StudentAuth.countDocuments(),
      Company.countDocuments(),
    ]);
    countCache = { value: { students, companies, total: students + companies }, at: Date.now() };
    res.json(countCache.value);
  } catch (err) {
    console.error("Count error:", err);
    res.status(500).json({ message: "Server error retrieving count" });
  }
});

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/credentials", credentialRoutes);

// Socket.io
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("start-game", () => {
    gameStarted = true;
    io.emit("game-started");
  });

  socket.on("reset-game", () => {
    gameStarted = false;
    io.emit("game-reset");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// MongoDB Connection with retry logic
const connectDB = async (delay = 1000) => {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set. Check your .env file.");
    return;
  }

  while (true) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log("MongoDB connected successfully");
      return;
    } catch (err) {
      console.error(`MongoDB connection failed: ${err.message}`);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, 30000);
    }
  }
};

// Start server immediately so Socket.IO is always reachable.
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Connect to MongoDB in the background.
connectDB();