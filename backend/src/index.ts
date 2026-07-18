import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";
import visitorRoutes from "./routes/visitors.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Allowed origins — add your Vercel URL to CLIENT_URL env var
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => origin === o || origin.endsWith(".vercel.app"))) {
      return callback(null, true);
    }
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/visitors", visitorRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
