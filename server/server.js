// Load .env FIRST
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// ===============================
// CORS
// ===============================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://convertbot-crp0.onrender.com",
    ],
    credentials: true,
  })
);

// ===============================
// Middleware
// ===============================

app.use(express.json());

// ===============================
// Connect MongoDB
// ===============================

connectDB();

// ===============================
// Routes
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

// ===============================
// Test Route
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "Server is working",
  });
});

// ===============================
// Start Server
// ===============================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});