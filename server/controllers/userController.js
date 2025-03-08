const User = require("../models/User");
const jwt = require("jsonwebtoken");
const JobListing = require("../models/JobListing");

// Get all users
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    res.json({ user }).status(200);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single user
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create user
const createUser = async (req, res) => {
  if (!req.body.firstName || !req.body.lastName || !req.body.phone)
    return res.json({ message: "All are compulsory" }).status(400);

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    role: req.body.role,
  });

  try {
    const newUser = await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser._id,
        role: newUser.role,
        phone: newUser.phone,
      },
      process.env.ACCESS_TOKEN_SECRET, // Use environment variable in production
      { expiresIn: "24h" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(201).json({
      user: newUser,
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    // Get userId from authenticated user
    const userId = req.user.userId;

    console.log("Updating user profile for userId:", userId);
    console.log("Update data:", req.body);

    // Fields that are allowed to be updated - include all fields from both employee and employer profiles
    const allowedUpdates = [
      // Common fields
      "firstName",
      "lastName",
      "phone",
      "email",
      "location",
      "about",

      // Employee specific fields
      "title",
      "status",

      // Employer specific fields
      "companyName",
      "businessType",
      "website",
      "employeeCount",
      "workingHours",
    ];

    // Create update object only with allowed fields that are present in req.body
    const updates = {};
    Object.keys(req.body).forEach((field) => {
      if (allowedUpdates.includes(field)) {
        updates[field] = req.body[field];
      }
    });

    // If no valid updates provided
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    console.log("Validated updates:", updates);

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true } // Return updated user and run schema validators
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("User updated successfully:", updatedUser._id);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// Get user's inbox messages
const getUserInbox = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Filter options
    const filter = {};
    if (req.query.read !== undefined) {
      filter.read = req.query.read === "true";
    }
    if (req.query.type) {
      filter.type = req.query.type;
    }

    // Apply filters if present, otherwise return all messages
    let inbox = user.inbox;
    if (Object.keys(filter).length > 0) {
      inbox = user.inbox.filter((message) => {
        let match = true;
        if (filter.read !== undefined)
          match = match && message.read === filter.read;
        if (filter.type) match = match && message.type === filter.type;
        return match;
      });
    }

    res.status(200).json({
      success: true,
      count: inbox.length,
      inbox: inbox,
    });
  } catch (error) {
    console.error("Inbox fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching inbox",
      error: error.message,
    });
  }
};

// Get user's applied jobs
const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find user and populate job details from JobList model
    const user = await User.findById(userId).populate({
      path: "applied.job",
      model: "JobListing",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Filter by status if provided
    let appliedJobs = user.applied;
    if (req.query.status) {
      appliedJobs = user.applied.filter(
        (application) => application.status === req.query.status
      );
    }

    res.status(200).json({
      success: true,
      count: appliedJobs.length,
      applied: appliedJobs,
    });
  } catch (error) {
    console.error("Applied jobs fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching applied jobs",
      error: error.message,
    });
  }
};

module.exports = {
  getCurrentUser,
  getUserById,
  createUser,
  updateUserProfile,
  getUserInbox,
  getAppliedJobs,
};
