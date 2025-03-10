const express = require("express");
const router = express.Router();
const {
  getCurrentUser,
  getUserById,
  createUser,
  updateUserProfile,
  getUserInbox,
  getAppliedJobs,
} = require("../controllers/userController");

const verifyToken = require("../middlewares/auth");

// Public routes
router.post("/", createUser);

// Protected routes
router.get("/", verifyToken, getCurrentUser);
router.patch("/profile", verifyToken, updateUserProfile);
// Inbox and applied jobs routes (protected by authentication)
router.get("/inbox", verifyToken, getUserInbox);
router.get("/applied", verifyToken, getAppliedJobs);

router.get("/:id", verifyToken, getUserById);

module.exports = router;
