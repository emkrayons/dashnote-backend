require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const userRoutes = require("./routes/userRoutes");

const { apiLimiter, authLimiter } = require("./middleware/rateLimiter");


const app = express();

// Add CORS middleware BEFORE other middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://dashnote.vercel.app'  // ⭐ ADD THIS
  ],
  credentials: true
}));

app.use(express.json());

// ⭐ NEW: Apply rate limiting to all API routes
app.use("/api/", apiLimiter);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.error(err));


app.use("/auth", authLimiter, authRoutes); // ⭐ Auth routes get stricter limit
app.use("/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});