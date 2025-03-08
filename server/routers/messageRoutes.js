const express = require("express");
const router = express.Router();
const {
  getInbox,
  getSentMessages,
  markAsRead,
  sendMessage,
} = require("../controllers/messageController");
const verifyToken = require("../middlewares/auth");

// All message routes are protected
router.use(verifyToken);

// Get inbox
router.get("/inbox", getInbox);

// Get sent messages
router.get("/sent", getSentMessages);

// Mark message as read
router.patch("/:id/read", markAsRead);

// Send new message
router.post("/", sendMessage);

module.exports = router;
