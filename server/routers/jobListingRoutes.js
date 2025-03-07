const express = require("express");
const router = express.Router();
const {
  getAllJobListings,
  getJobListingById,
  createJobListing,
  updateJobListing,
  deleteJobListing,
  applyForJob,
  getJobApplicants,
} = require("../controllers/jobListingController");
const verifyToken = require("../middlewares/auth");

// Public routes
router.get("/", getAllJobListings);
router.get("/:id", getJobListingById);

// Protected routes (only employers can create, update, delete)
router.post("/", verifyToken, createJobListing);
router.patch("/:id", verifyToken, updateJobListing);
router.delete("/:id", verifyToken, deleteJobListing);

// Job application routes
router.post("/:id/apply", verifyToken, applyForJob);
router.get("/:id/applicants", verifyToken, getJobApplicants);

module.exports = router;
