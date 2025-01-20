const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");
router.get("/welcome", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "Welcome to admin page" });
});

module.exports = router;
