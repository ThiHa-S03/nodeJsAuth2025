const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/welcome", authMiddleware, (req, res) => {
  const { userName, userId, role } = req.userInfo;
  res.json({
    message: "Welcome from home page",
    user: {
      _id: userId,
      userName: userName,
      role: role,
    },
  });
});

module.exports = router;
