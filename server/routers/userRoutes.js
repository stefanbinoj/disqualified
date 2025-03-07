const express = require("express");
const router = express.Router();
const {
  getCurrentUser,
  getUserById,
  createUser,
  updateUserProfile,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/auth");

// Public routes
router.post("/", createUser);

// Protected routes
router.get("/", verifyToken, getCurrentUser);
router.patch("/profile", verifyToken, updateUserProfile);

router.get("/:id", verifyToken, getUserById);

module.exports = router;
