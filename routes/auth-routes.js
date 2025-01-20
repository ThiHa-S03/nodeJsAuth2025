const express = require("express");
const router = express.Router();
const {
  registerController,
  logInController,
  changePasswordController,
} = require("../controllers/auth-controller");
const authMiddleware = require("../middlewares/auth-middleware");

router.post("/register", registerController);
router.post("/login", logInController);
router.post("/changePassword", authMiddleware, changePasswordController);

module.exports = router;
