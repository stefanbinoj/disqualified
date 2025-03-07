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
  const { title, starRating, position, location, duration, rate } = req.body;

  if (!title || !starRating || !position || !location || !duration || !rate) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const jobListing = new JobListing({
    userId: req.user.userId,
    title: req.body.title,
    starRating: req.body.starRating,
    position: req.body.position,
    location: req.body.location,
    duration: req.body.duration,
    rate: req.body.rate,
  });

  try {
    const newJobListing = await jobListing.save();
    res.status(201).json(newJobListing);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
