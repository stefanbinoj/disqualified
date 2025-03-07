const JobListing = require("../models/JobListing");

// Get all job listings
const getAllJobListings = async (req, res) => {
  try {
    const jobListings = await JobListing.find().sort({ postedDate: -1 });
    res.json(jobListings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single job listing
const getJobListingById = async (req, res) => {
  try {
    const jobListing = await JobListing.findById(req.params.id);
    if (!jobListing) {
      return res.status(404).json({ message: "Job listing not found" });
    }
    res.json(jobListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create job listing
const createJobListing = async (req, res) => {
  try {
    const { title, starRating = 3.5, location, duration, rate } = req.body;

    // Validate required fields
    const requiredFields = ["title", "location", "duration", "rate"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missingFields,
      });
    }

    // Create new job listing with applicants array
    const jobListing = new JobListing({
      userId: req.user.userId, // From auth middleware
      title,
      starRating,
      location,
      duration,
      rate,
      description: req.body.description,
      applicants: [], // Initialize empty applicants array
      postedDate: new Date(), // Set current date
    });

    const newJobListing = await jobListing.save();

    // Populate user details in response
    const populatedJob = await JobListing.findById(newJobListing._id)
      .populate("userId", "firstName lastName")
      .populate("applicants", "firstName lastName phone role");

    res.status(201).json({
      success: true,
      message: "Job listing created successfully",
      jobListing: populatedJob,
    });
  } catch (error) {
    console.error("Create job listing error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create job listing",
      error: error.message,
    });
  }
};

// Apply for a job
const applyForJob = async (req, res) => {
  try {
    const jobListing = await JobListing.findById(req.params.id);

    if (!jobListing) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    // Check if user has already applied
    if (jobListing.applicants.includes(req.user.userId)) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    // Add user to applicants array
    jobListing.applicants.push(req.user.userId);
    await jobListing.save();

    res.json({ message: "Successfully applied for the job" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all applicants for a job
const getJobApplicants = async (req, res) => {
  try {
    const jobListing = await JobListing.findById(req.params.id).populate(
      "applicants",
      "firstName lastName phone role"
    );

    if (!jobListing) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    res.json(jobListing.applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update job listing
const updateJobListing = async (req, res) => {
  try {
    const jobListing = await JobListing.findById(req.params.id);
    if (!jobListing) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    if (req.body.title) jobListing.title = req.body.title;
    if (req.body.starRating) jobListing.starRating = req.body.starRating;
    if (req.body.position) jobListing.position = req.body.position;
    if (req.body.location) jobListing.location = req.body.location;
    if (req.body.duration) jobListing.duration = req.body.duration;
    if (req.body.rate) jobListing.rate = req.body.rate;

    const updatedJobListing = await jobListing.save();
    res.json(updatedJobListing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete job listing
const deleteJobListing = async (req, res) => {
  try {
    const jobListing = await JobListing.findById(req.params.id);
    if (!jobListing) {
      return res.status(404).json({ message: "Job listing not found" });
    }
    await jobListing.deleteOne();
    res.json({ message: "Job listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllJobListings,
  getJobListingById,
  createJobListing,
  updateJobListing,
  deleteJobListing,
  applyForJob,
  getJobApplicants,
};
