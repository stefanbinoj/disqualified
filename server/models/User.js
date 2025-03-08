const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["employee", "employer"],
      default: "employee",
    },
    // Employee specific fields
    title: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    location: {
      type: String,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
    },
    // Employer specific fields
    companyName: {
      type: String,
      trim: true,
    },
    businessType: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    employeeCount: {
      type: String,
      trim: true,
    },
    workingHours: {
      type: String,
      trim: true,
    },
    inbox: [
      {
        subject: { type: String, required: true },
        sender: { type: String, required: true },
        preview: { type: String },
        timestamp: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
        type: {
          type: String,
          enum: ["interview", "offer", "rejection", "general"],
        },
        fullMessage: { type: String, required: true },
      },
    ],
    // New applied array for job applications
    applied: [
      {
        job: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "JobListing",
        },
        status: {
          type: String,
          enum: [
            "pending",
            "viewed",
            "interviewed",
            "rejected",
            "offered",
            "accepted",
          ],
          default: "pending",
        },
        appliedDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
