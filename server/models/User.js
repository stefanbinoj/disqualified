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
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
