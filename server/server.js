import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import studentRoutes from "./routes/studentRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";

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

app.use(cors(corsOptions));
app.use(express.json());

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/readyz", (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ status: "not-ready", db: "disconnected" });
  }
  return res.status(200).json({ status: "ready", db: "connected" });
});

app.use("/api", (req, res, next) => {
  if (!isDbReady()) {
    return res.status(503).json({
      message: "Service temporarily unavailable. Database is not connected.",
    });
  }
  return next();
});

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/companies", companyRoutes);

// Socket.io
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  if (gameStarted) {
    socket.emit("game-started");
  }

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
