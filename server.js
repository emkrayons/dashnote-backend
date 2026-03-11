require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const userRoutes = require("./routes/userRoutes");

const { apiLimiter, authLimiter } = require("./middleware/rateLimiter");

const app = express();

// CORS middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://dashnote.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

// Rate limiting
app.use("/api/", apiLimiter);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.error(err));

// Routes (no duplicates!)
app.use("/auth", authLimiter, authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);

// Optional: Root route
app.get('/', (req, res) => {
  res.json({ message: "Dashnote API is running! 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});