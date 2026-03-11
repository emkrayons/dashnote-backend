const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET logged-in user
router.get("/me", protect, (req, res) => {
  res.json({
    message: "Protected data accessed successfully",
    user: req.user,
  });
});

module.exports = router;
