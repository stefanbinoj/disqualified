const mongoose = require("mongoose");

const jobListingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      trim: true,
    },
    starRating: {
      type: Number,
    },
    position: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    rate: {
      type: Number,
      min: 0,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const JobListing = mongoose.model("JobListing", jobListingSchema);

module.exports = JobListing;
