const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/auth");

// Public routes
router.post("/", createUser);

// Protected routes
router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserById);

module.exports = router;
