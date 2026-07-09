// index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Convert the environment string into a real array for validation
const rawOrigin = process.env.CLIENT_URL || 'http://localhost:3000';
const allowedOrigins = rawOrigin.split(",").map(url => url.trim());

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like curl, Postman, or Render background monitoring)
    if (!origin) return callback(null, true);
    
    // Now .some() works perfectly because allowedOrigins is a valid Array
    const isAllowed = allowedOrigins.some(o => origin === o) || origin.endsWith(".vercel.app");
    
    if (isAllowed) {
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

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});