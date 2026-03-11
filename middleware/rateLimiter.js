// backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// General API rate limiter - 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP. Please try again in 15 minutes."
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Custom handler to ensure consistent error format
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests from this IP. Please try again in 15 minutes."
    });
  }
});

// Stricter limiter for auth routes - 5 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login/register attempts per windowMs
  message: {
    error: "Too many login attempts. Please try again in 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Custom handler for auth routes
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many login attempts. Please try again in 15 minutes."
    });
  }
});

module.exports = { apiLimiter, authLimiter };