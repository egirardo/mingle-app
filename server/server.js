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
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" },
});
const PORT = process.env.PORT || 5000;
let gameStarted = false;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/companies", companyRoutes);

// Socket.io
io.on("connection", (socket) => {
  console.log("✓ User connected");

  if (gameStarted) {
    socket.emit("game-started");
  }

  socket.on("start-game", () => {
    gameStarted = true;
    io.emit("game-started");
  });

  socket.on("disconnect", () => {
    console.log("✗ User disconnected");
  });
});

// MongoDB Connection with retry logic
const connectDB = async (retries = 5, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log("✓ MongoDB connected successfully");
      return true;
    } catch (err) {
      console.error(
        `MongoDB connection attempt ${i + 1}/${retries} failed:`,
        err.message,
      );
      if (i < retries - 1) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        console.error("✗ Failed to connect to MongoDB after all retries");
        return false;
      }
    }
  }

  return false;
};

// Start server immediately so Socket.IO is always reachable.
httpServer.listen(PORT, () => console.log(`✓ Server running on port ${PORT}`));

// Connect to MongoDB in the background.
connectDB().then((connected) => {
  if (!connected) {
    console.warn(
      "⚠ MongoDB is not connected yet, but the server is still running.",
    );
  }
});
