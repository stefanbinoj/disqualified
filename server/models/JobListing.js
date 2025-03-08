const mongoose = require("mongoose");

const jobListingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    company: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    starRating: {
      type: Number,
      default: 0,
    },
    position: {
      type: String,
      trim: true,
      required: true,
    },
    location: {
      type: String,
      trim: true,
      required: true,
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
      required: true,
    },
    salary: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    type: {
      type: String,
      trim: true,
      default: "Full Time",
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
