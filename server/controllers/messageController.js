const Message = require("../models/Message");

// Get inbox messages for the current user
const getInbox = async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log(`Fetching inbox for user: ${userId}`);

    // Get ONLY messages where the current user is the receiver
    const messages = await Message.find({
      receiverId: userId, // This ensures only messages FOR this user are returned
    })
      .populate("senderId", "firstName lastName role")
      .populate("jobId", "title position location rate duration")
      .sort({ createdAt: -1 });

    console.log(`Found ${messages.length} messages for user ${userId}`);

    // For debugging, log a few message IDs and their receiver IDs
    if (messages.length > 0) {
      console.log(
        `Sample message: ID=${messages[0]._id}, receiverId=${messages[0].receiverId}`
      );
    }

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("Get inbox error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inbox",
      error: error.message,
    });
  }
};

// Get sent messages for the current user
const getSentMessages = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get messages where user is sender
    const messages = await Message.find({ senderId: userId })
      .populate("receiverId", "firstName lastName role")
      .populate("jobId", "title position location rate duration")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("Get sent messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sent messages",
      error: error.message,
    });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.userId;

    // Find message and check if user is receiver
    const message = await Message.findOne({
      _id: messageId,
      receiverId: userId,
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found or you don't have permission",
      });
    }

    // Mark as read
    message.isRead = true;
    await message.save();

    res.status(200).json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark message as read",
      error: error.message,
    });
  }
};

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, jobId, title, content } = req.body;
    const senderId = req.user.userId;

    // Validate required fields
    if (!receiverId || !title || !content) {
      return res.status(400).json({
        success: false,
        message: "receiverId, title and content are required",
      });
    }

    // Create new message
    const message = new Message({
      jobId: jobId, // Optional - can be null for general messages
      senderId,
      receiverId,
      title,
      content,
      type: "message",
    });

    await message.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

module.exports = {
  getInbox,
  getSentMessages,
  markAsRead,
  sendMessage,
};
