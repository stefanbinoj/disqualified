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
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
