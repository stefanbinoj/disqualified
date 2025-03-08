import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import {
  MapPin,
  Phone,
  Calendar,
  ChevronRight,
  AlertCircle,
  Mail,
  Clock,
} from "lucide-react";
import api from "../axiosWithHeaders";
import axiosWithHeader from "../axiosWithHeaders"; // Add this import for consistency

const Applies = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Fetch applications using our new API endpoint
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);

        console.log("Attempting to fetch real application data...");

        // We need to first get the employer's job listings
        let jobListingResponse;
        try {
          jobListingResponse = await axiosWithHeader.get("/jobs/created");
          console.log("Employer job listings:", jobListingResponse.data);
        } catch (err) {
          console.log(
            "Failed to fetch created jobs, trying alternative endpoint"
          );
          // Alternative endpoint
          jobListingResponse = await axiosWithHeader.get("/jobs");
          console.log("All job listings:", jobListingResponse.data);
        }

        // If we can't get the job listings, fallback to mock data
        if (
          !jobListingResponse ||
          !jobListingResponse.data ||
          !Array.isArray(jobListingResponse.data)
        ) {
          throw new Error("Could not fetch job listings");
        }

        const jobListings = jobListingResponse.data;

        // No jobs? No applications.
        if (jobListings.length === 0) {
          console.log("No job listings found for this employer");
          setApplications([]);
          setError(
            "You don't have any job listings yet. Post a job to receive applications."
          );
          setLoading(false);
          return;
        }

        // For each job, fetch its applicants
        const allApplicationsPromises = jobListings.map(async (job) => {
          try {
            const jobId = job._id;
            const response = await axiosWithHeader.get(
              `/jobs/${jobId}/applicants`
            );
            console.log(`Applicants for job ${job.title}:`, response.data);

            // If this job has applicants, format them and include job details
            if (response.data && Array.isArray(response.data)) {
              return response.data.map((applicant) => ({
                _id: `${jobId}_${applicant._id}`,
                user: {
                  _id: applicant._id,
                  firstName: applicant.firstName || "Applicant",
                  lastName: applicant.lastName || "",
                  email: applicant.email || "email@example.com",
                  phone: applicant.phone || "N/A",
                  location: applicant.location || "N/A",
                },
                job: {
                  _id: jobId,
                  title: job.title || "Job Position",
                  company: job.company || "Your Company",
                  location: job.location || "N/A",
                  salary: job.salary || job.rate || "N/A",
                  type: job.position || job.type || "N/A",
                },
                status: applicant.status || "pending",
                appliedDate: applicant.appliedDate || new Date(),
              }));
            }
            return [];
          } catch (error) {
            console.error(
              `Error fetching applicants for job ${job._id}:`,
              error
            );
            return [];
          }
        });

        try {
          const applicantsByJob = await Promise.all(allApplicationsPromises);
          // Flatten the array of arrays
          const allApplications = applicantsByJob.flat();

          if (allApplications.length > 0) {
            console.log(
              `Found ${allApplications.length} total applications across ${jobListings.length} jobs`
            );
            setApplications(allApplications);
          } else {
            console.log("No applications found for any job listings");
            setError(
              "No applications have been received for your job listings yet."
            );
            setApplications([]);
          }
        } catch (error) {
          console.error("Error processing application data:", error);
          throw error;
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching applications:", err);
        const errorMessage = `Failed to load applications: ${err.message}. Using mock data as fallback.`;
        console.error(errorMessage);

        if (err.response) {
          console.error("Server response:", err.response.data);
          console.error("Status code:", err.response.status);
        }

        setError(errorMessage);
        // Fallback to mock data if API fails
        setApplications(getMockApplications());
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();

    // Set up polling to refresh data every 30 seconds
    const interval = setInterval(fetchApplications, 30000);

    // Clean up on unmount
    return () => clearInterval(interval);
  }, []);

  // Helper function to format API applications to match our UI requirements
  const formatApplicationsFromAPI = (apiApplications) => {
    console.log("Formatting applications:", apiApplications);
    if (!apiApplications || !Array.isArray(apiApplications)) {
      console.warn("Invalid applications data format:", apiApplications);
      return [];
    }

    return apiApplications.map((app) => {
      console.log("Processing application:", app);

      // Handle different API response formats
      // The app might have nested user/job objects, or flattened properties
      const user = app.user || app.applicant || app.candidate || {};
      const job = app.job || {};

      // Make sure each application has a unique ID
      let applicationId;
      if (app._id) {
        applicationId = app._id;
      } else if (app.id) {
        applicationId = app.id;
      } else if (job._id && (user._id || app.applicantId)) {
        applicationId = `${job._id}_${user._id || app.applicantId}`;
      } else if (app.jobId && app.applicantId) {
        applicationId = `${app.jobId}_${app.applicantId}`;
      } else {
        applicationId = `app_${Math.random().toString(36).substr(2, 9)}`;
        console.warn("Generated random ID for application:", applicationId);
      }

      return {
        _id: applicationId,
        user: {
          _id: user._id || app.applicantId || app.userId || "user-id",
          firstName:
            user.firstName ||
            app.firstName ||
            app.applicantName?.split(" ")[0] ||
            "Applicant",
          lastName:
            user.lastName ||
            app.lastName ||
            app.applicantName?.split(" ").slice(1).join(" ") ||
            "",
          email:
            user.email ||
            app.email ||
            app.applicantEmail ||
            "email@example.com",
          phone: user.phone || app.phone || app.applicantPhone || "N/A",
          location:
            user.location || app.location || app.applicantLocation || "N/A",
          resume: user.resume || app.resume || app.applicantResume,
          profileImage:
            user.profileImage || app.profileImage || app.applicantImage,
        },
        job: {
          _id: job._id || app.jobId || "job-id",
          title: job.title || app.jobTitle || app.title || "Job Position",
          company:
            job.company || app.company || app.jobCompany || "Your Company",
          location: job.location || app.jobLocation || "N/A",
          salary: job.salary || app.salary || app.jobSalary || "N/A",
          type: job.type || app.jobType || app.type || "N/A",
        },
        status: app.status || "pending",
        appliedDate: app.appliedDate || app.createdAt || app.date || new Date(),
        notes: app.notes || app.feedback || "",
      };
    });
  };

  // Generate mock data for development
  const getMockApplications = () => {
    return [
      {
        _id: "mock_job1_user1",
        userId: {
          _id: "user1",
          firstName: "Rahul",
          lastName: "Kumar",
          email: "rahul@example.com",
          phone: "9876543210",
          location: "Kochi, Kerala",
        },
        job: {
          _id: "job1",
          title: "Senior Electrician",
          company: "Your Company",
          location: "Kochi, Kerala",
          salary: "₹18-24k/month",
          type: "Full Time",
        },
        status: "pending",
        appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        _id: "mock_job2_user2",
        userId: {
          _id: "user2",
          firstName: "Mary",
          lastName: "Thomas",
          email: "mary@example.com",
          phone: "9876543211",
          location: "Ernakulam, Kerala",
        },
        job: {
          _id: "job2",
          title: "Head Cook",
          company: "Your Company",
          location: "Kochi, Kerala",
          salary: "₹25-30k/month",
          type: "Full Time",
        },
        status: "viewed",
        appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ];
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "offered":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "interviewed":
        return "bg-purple-100 text-purple-700";
      case "viewed":
        return "bg-yellow-100 text-yellow-700";
      case "pending":
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    if (!selectedApplication || !["viewed", "interviewed"].includes(newStatus))
      return;

    try {
      setStatusUpdating(true);

      // Extract job and user IDs from the combined ID
      let jobId, applicantId;

      if (applicationId.includes("_")) {
        [jobId, applicantId] = applicationId.split("_");
      } else {
        // If we don't have a combined ID, try to get the IDs from the selected application
        jobId = selectedApplication?.job?._id;
        applicantId = selectedApplication?.user?._id;
      }

      console.log("Attempting to update application status:", {
        applicationId,
        jobId,
        applicantId,
        newStatus,
      });

      // Try to update application status using the job applicants endpoint
      let successful = false;
      let response = null;

      try {
        // This is the endpoint that should work based on our backend analysis
        response = await axiosWithHeader.put(
          `/jobs/${jobId}/applicants/${applicantId}/status`,
          {
            status: newStatus,
          }
        );
        successful = true;
        console.log(
          "Status updated successfully using job applicants endpoint"
        );
      } catch (error) {
        console.error(
          "Failed to update status using primary endpoint:",
          error.message
        );

        // Fallback to a more generic endpoint if the first one fails
        try {
          response = await axiosWithHeader.put(`/applications/update`, {
            jobId,
            applicantId,
            status: newStatus,
          });
          successful = true;
          console.log("Status updated successfully using fallback endpoint");
        } catch (fallbackError) {
          console.error(
            "Fallback endpoint also failed:",
            fallbackError.message
          );
        }
      }

      if (successful && response?.data) {
        console.log("Status update response:", response.data);
      }

      // Update the UI regardless of API success (optimistic update)
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      setSelectedApplication({
        ...selectedApplication,
        status: newStatus,
      });

      alert(
        `Application status updated to ${newStatus}. ${
          successful
            ? "The applicant has been notified."
            : "However, the server update failed. The UI has been updated."
        }`
      );
    } catch (err) {
      console.error("Error updating application status:", err);
      alert(
        "Failed to update status: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(date);
  };

  // Confirmation handler
  const handleConfirmStatusChange = (applicationId, newStatus) => {
    // Set the confirmation state with the action details
    setConfirmAction({
      applicationId,
      newStatus,
      message: `Are you sure you want to ${
        newStatus === "offered" ? "accept" : "reject"
      } this applicant? This decision cannot be changed later.`,
    });
  };

  // Actual status change after confirmation
  const executeStatusChange = async () => {
    if (!confirmAction) return;

    const { applicationId, newStatus } = confirmAction;

    try {
      setStatusUpdating(true);

      // Extract job and user IDs from the combined ID
      let jobId, applicantId;

      if (applicationId.includes("_")) {
        [jobId, applicantId] = applicationId.split("_");
      } else {
        // If we don't have a combined ID, try to get the IDs from the selected application
        jobId = selectedApplication?.job?._id;
        applicantId = selectedApplication?.user?._id;
      }

      console.log("Attempting to update application status:", {
        applicationId,
        jobId,
        applicantId,
        newStatus,
      });

      // Try to update application status using the job applicants endpoint
      let successful = false;
      let response = null;

      try {
        // This is the endpoint that should work based on our backend analysis
        response = await axiosWithHeader.put(
          `/jobs/${jobId}/applicants/${applicantId}/status`,
          {
            status: newStatus,
          }
        );
        successful = true;
        console.log(
          "Status updated successfully using job applicants endpoint"
        );
      } catch (error) {
        console.error(
          "Failed to update status using primary endpoint:",
          error.message
        );

        // Fallback to a more generic endpoint if the first one fails
        try {
          response = await axiosWithHeader.put(`/applications/update`, {
            jobId,
            applicantId,
            status: newStatus,
          });
          successful = true;
          console.log("Status updated successfully using fallback endpoint");
        } catch (fallbackError) {
          console.error(
            "Fallback endpoint also failed:",
            fallbackError.message
          );
        }
      }

      if (successful && response?.data) {
        console.log("Status update response:", response.data);
      }

      // Update the UI regardless of API success (optimistic update)
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      if (selectedApplication && selectedApplication._id === applicationId) {
        setSelectedApplication({
          ...selectedApplication,
          status: newStatus,
        });
      }

      alert(
        `Application ${
          newStatus === "offered" ? "accepted" : "rejected"
        } successfully! ${
          successful
            ? "The applicant will be notified."
            : "However, the server update failed. The UI has been updated."
        }`
      );
    } catch (err) {
      console.error("Error updating application status:", err);
      alert(
        "Failed to update status: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setStatusUpdating(false);
      setConfirmAction(null); // Clear confirmation state
    }
  };

  // Cancel confirmation
  const cancelConfirmation = () => {
    setConfirmAction(null);
  };

  // Application Details Modal
  const ApplicationModal = ({ application, onClose }) => (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-[1000] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4 items-start">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 font-bold">
              {application.job.company?.charAt(0) || "C"}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{application.job.title}</h2>
              <p className="text-gray-600">{application.job.company}</p>
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Applied {getTimeAgo(application.appliedDate)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Applicant Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Applicant Details</h3>
            <div className="space-y-3">
              <p className="text-gray-700 font-medium text-lg">
                {application.user?.firstName} {application.user?.lastName}
              </p>

              <div className="flex flex-col gap-2 mt-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {application.user?.location || "Location not specified"}
                  </span>
                </div>

                {application.user?.phone && (
                  <button
                    onClick={() => handleCall(application.user.phone)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{application.user.phone}</span>
                  </button>
                )}

                {application.user?.email && (
                  <button
                    onClick={() => handleEmail(application.user.email)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{application.user.email}</span>
                  </button>
                )}
              </div>

              {application.message && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Applicant's Note:
                  </p>
                  <p className="text-gray-600 italic">{application.message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Job Details */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-3">Job Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{application.job.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Salary</p>
                <p className="font-medium">{application.job.salary}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Job Type</p>
                <p className="font-medium">{application.job.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Application Status</p>
                <p className="font-medium">{application.status}</p>
              </div>
            </div>
          </div>

          {/* Resume Preview (if available) */}
          {application.user?.resume && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">Resume</h3>
              <a
                href={application.user.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                View Resume
              </a>
            </div>
          )}

          {/* Status Update */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-3">
              Update Application Status
            </h3>

            {/* Show different UI based on current status */}
            {application.status === "offered" ||
            application.status === "accepted" ? (
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-700">
                <p className="font-medium">
                  This application has been accepted
                </p>
                <p className="text-sm mt-1">
                  The applicant has been notified of your decision.
                </p>
              </div>
            ) : application.status === "rejected" ? (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700">
                <p className="font-medium">
                  This application has been rejected
                </p>
                <p className="text-sm mt-1">
                  The applicant has been notified of your decision.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    handleConfirmStatusChange(application._id, "offered")
                  }
                  disabled={statusUpdating}
                  className="py-2.5 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white"
                >
                  {statusUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                      Updating...
                    </>
                  ) : (
                    "Accept Applicant"
                  )}
                </button>

                <button
                  onClick={() =>
                    handleConfirmStatusChange(application._id, "rejected")
                  }
                  disabled={statusUpdating}
                  className="py-2.5 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white"
                >
                  {statusUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                      Updating...
                    </>
                  ) : (
                    "Reject Applicant"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Confirmation Dialog
  const ConfirmationDialog = () => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[1100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
        <h3 className="text-lg font-semibold mb-3">Confirm Decision</h3>
        <p className="text-gray-600 mb-6">{confirmAction?.message}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={cancelConfirmation}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={executeStatusChange}
            className={`px-4 py-2 text-white rounded-lg ${
              confirmAction?.newStatus === "offered"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header at the top */}
      <Header />

      {/* Content below header */}
      <div className="pt-14">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex items-center justify-between my-6 px-2">
            <h1 className="text-2xl font-semibold">Applications</h1>
            <div className="text-sm text-gray-500">
              {applications.length} total applications
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex justify-center py-8">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Applications List */}
          {!loading && !error && (
            <>
              {applications.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center shadow-sm">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    No Applications Yet
                  </h3>
                  <p className="text-gray-500">
                    When job seekers apply for your job listings, they'll appear
                    here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-[1px] bg-gray-100 rounded-lg overflow-hidden shadow-sm mb-6">
                  {applications.map((application) => (
                    <div
                      key={application._id}
                      className="bg-white p-4 hover:shadow-md transition-all cursor-pointer border-b border-gray-100 hover:bg-gray-50"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 font-bold">
                          {application.user?.firstName?.charAt(0) || "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {application.user?.firstName}{" "}
                                {application.user?.lastName}
                              </h3>
                              <p className="text-sm text-gray-600 truncate">
                                Applied for: {application.job.title}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${getStatusColor(
                                application.status
                              )}`}
                            >
                              {application.status?.charAt(0).toUpperCase() +
                                application.status?.slice(1) || "Pending"}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-6">
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">
                                {application.user?.location ||
                                  "Location not specified"}
                              </span>
                            </span>
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{getTimeAgo(application.appliedDate)}</span>
                            </span>
                            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals with high z-index to appear above everything */}
      {selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}

      {/* Confirmation Dialog */}
      {confirmAction && <ConfirmationDialog />}
    </div>
  );
};

export default Applies;
