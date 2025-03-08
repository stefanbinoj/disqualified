const JobListing = require("../models/JobListing");
const Message = require("../models/Message");
const User = require("../models/User");

// Get all job listings
const getAllJobListings = async (req, res) => {
  try {
    const { search, location } = req.query;

    // Build query
    let query = {};

    // Add search condition
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { position: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Add location filter
    if (location && location !== "All Locations") {
      query.location = { $regex: location, $options: "i" };
    }

    // Find jobs with full population
    const jobListings = await JobListing.find(query)
      .populate("userId", "firstName lastName")
      .sort({ postedDate: -1 });

    console.log(`Found ${jobListings.length} job listings`);

    // Log a sample job listing for debugging
    if (jobListings.length > 0) {
      console.log(
        `Sample job: id=${jobListings[0]._id}, company=${jobListings[0].company}`
      );
    }

    // Send the original job listings without modifications
    res.json(jobListings);
  } catch (error) {
    console.error("Error in getAllJobListings:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
    const {
      title,
      company,
      description,
      starRating,
      position,
      location,
      duration,
      rate,
      salary,
      experience,
      skills,
      type,
    } = req.body;

    // Get user info to ensure we have the correct name
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Basic validation for required fields
    if (!title || !position || !location || !rate) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
        requiredFields: ["title", "position", "location", "rate"],
      });
    }

    // Use the provided company name or generate one from user's name
    let companyName = company;

    // If no company name provided, use user's name + "'s Company"
    if (!companyName || companyName.trim() === "") {
      // Make sure we have both firstName and lastName
      const firstName = user.firstName || "";
      const lastName = user.lastName || "";

      if (firstName || lastName) {
        companyName = `${firstName} ${lastName}'s Company`.trim();
      } else {
        companyName = "Company Name"; // Last resort fallback
      }
    }

    console.log(`Creating job listing with company name: ${companyName}`);

    // Create new job listing with all fields
    const jobListing = new JobListing({
      userId: req.user.userId,
      title,
      company: companyName,
      description,
      starRating: starRating || 0,
      position,
      location,
      duration,
      rate,
      // Ensure salary has ₹ symbol
      salary: salary
        ? salary.startsWith("₹")
          ? salary
          : `₹${salary}`
        : `₹${rate}`,
      experience: experience || duration,
      skills: skills || [],
      type: type || "Full Time",
    });

    const newJobListing = await jobListing.save();

    // Return complete job listing with populated user data
    const populatedJob = await JobListing.findById(newJobListing._id).populate(
      "userId",
      "firstName lastName"
    );

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
    const jobId = req.params.id;
    const applicantId = req.user.userId;

    // Check if job exists
    const jobListing = await JobListing.findById(jobId);
    if (!jobListing) {
      return res.status(404).json({
        success: false,
        message: "Job listing not found",
      });
    }

    // Make sure we have the employer ID (job creator)
    const employerId = jobListing.userId;
    if (!employerId) {
      return res.status(400).json({
        success: false,
        message: "Invalid job listing - no employer found",
      });
    }

    // Check if applicant IS the employer (can't apply to own job)
    if (applicantId.toString() === employerId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot apply to your own job listing",
      });
    }

    // Check if user has already applied
    if (
      jobListing.applicants.some(
        (id) => id.toString() === applicantId.toString()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Get user info for the messages
    const [applicant, employer] = await Promise.all([
      User.findById(applicantId),
      User.findById(employerId),
    ]);

    if (!applicant || !employer) {
      return res.status(404).json({
        success: false,
        message: "User information could not be found",
      });
    }

    console.log(`Employer ID: ${employerId}, Applicant ID: ${applicantId}`);

    // Add user to applicants array
    jobListing.applicants.push(applicantId);
    await jobListing.save();

    // Create application message for employer (job creator)
    const employerMessage = new Message({
      jobId: jobId,
      senderId: applicantId, // From applicant
      receiverId: employerId, // To employer ONLY
      title: `New application for ${jobListing.title}`,
      content: `${applicant.firstName} ${applicant.lastName} has applied for your "${jobListing.title}" position.`,
      type: "application",
    });

    // Create confirmation message for the applicant
    const applicantMessage = new Message({
      jobId: jobId,
      senderId: employerId, // From employer
      receiverId: applicantId, // To applicant ONLY
      title: `Application submitted for ${jobListing.title}`,
      content: `Your application for "${jobListing.title}" posted by ${employer.firstName} ${employer.lastName} has been received. We'll notify you of any updates.`,
      type: "confirmation",
    });

    // Save both messages
    await Promise.all([employerMessage.save(), applicantMessage.save()]);

    res.status(200).json({
      success: true,
      message: "Successfully applied for the job",
    });
  } catch (error) {
    console.error("Apply for job error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to apply for job",
      error: error.message,
    });
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
