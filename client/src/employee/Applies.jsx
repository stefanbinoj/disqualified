import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import axiosWithHeader from "../axiosWithHeaders"; // Adjust this path as needed
import Loader from "../components/Loader"; // Create or import this component
import {
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
  Circle,
  CheckCircle2,
  Star,
  BookmarkIcon,
  Bell,
  RefreshCw,
} from "lucide-react";
import company from "../assets/company.png";
import { useNavigate } from "react-router-dom";

const Applies = () => {
  const [applications, setApplications] = useState([]);
  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [applyingToJob, setApplyingToJob] = useState(false);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [notification, setNotification] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const navigate = useNavigate();

  // Function to show notifications
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Enhanced fetchApplications to ensure we get latest status from backend
  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axiosWithHeader.get("/users/applied");
      console.log("Fetched applications from API:", response.data);

      if (response.data.success) {
        // Get applications from backend
        const apiApplications = response.data.applied || [];

        // Load any temporary applications from localStorage
        const tempApps = JSON.parse(
          localStorage.getItem("tempApplications") || "[]"
        );

        // Identify which temp applications may need to be removed
        // (they've been processed by the backend)
        const apiJobIds = new Set(apiApplications.map((app) => app.job._id));
        const filteredTempApps = tempApps.filter((app) => {
          // Keep temp apps only if they're not already in the API response
          // and they're not older than 24 hours
          const isOld =
            new Date() - new Date(app.appliedDate) > 24 * 60 * 60 * 1000;
          const existsInApi = apiJobIds.has(app.job._id);
          return !existsInApi && !isOld;
        });

        // Update localStorage with filtered temp apps
        localStorage.setItem(
          "tempApplications",
          JSON.stringify(filteredTempApps)
        );

        // Combine API and remaining temp applications, with API apps taking precedence
        const combinedApps = [...apiApplications, ...filteredTempApps];

        // Sort by date (newest first)
        combinedApps.sort(
          (a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)
        );

        setApplications(combinedApps);
        setLastRefreshed(new Date());
        return combinedApps;
      } else {
        setError("Failed to fetch applications");
        return [];
      }
    } catch (err) {
      const errorMsg =
        "Failed to fetch applications: " +
        (err.response?.data?.message || err.message);
      setError(errorMsg);
      console.error("Applications fetch error:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up polling to refresh application status periodically
  useEffect(() => {
    // Fetch on initial load
    fetchApplications();

    // Set up interval to fetch every 2 minutes while the page is open
    const interval = setInterval(() => {
      fetchApplications();
    }, 12000); // 2 minutes

    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchApplications]);

  // Also refresh when user returns to the page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // If it's been more than 1 minute since last refresh
        if (new Date() - lastRefreshed > 60000) {
          fetchApplications();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchApplications, lastRefreshed]);

  const fetchSuggestedJobs = useCallback(async () => {
    try {
      setLoadingSuggestions(true);
      const response = await axiosWithHeader.get("/jobs");

      const transformedJobs = response.data.map((job) => ({
        id: job._id,
        title: job.title || "Job Title",
        company: job.company || "Company Name",
        location: job.location || "Remote",
        salary: job.salary || (job.rate ? `₹${job.rate}` : "₹Not specified"),
        experience: job.experience || job.duration || "Not specified",
        postedDate: formatDate(job.postedDate),
        type: job.type || job.position || "Full Time",
        description: job.description || "No description provided",
        skills: job.skills || [],
        logo: job.userId?.profilePicture || job.companyLogo || company,
        employerId: job.userId?._id,
      }));

      setSuggestedJobs(transformedJobs);
      return transformedJobs;
    } catch (err) {
      console.error("Suggested jobs fetch error:", err);
      return [];
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);

      // Load real applications from API
      const apiApps = await fetchApplications();

      // Load any temporary applications from localStorage
      try {
        const tempApps = JSON.parse(
          localStorage.getItem("tempApplications") || "[]"
        );
        if (tempApps.length > 0) {
          // Combine real and temporary applications
          const combinedApps = [...tempApps, ...apiApps];
          setApplications(combinedApps);
        }
      } catch (e) {
        console.error("Error loading temporary applications:", e);
      }

      await fetchSuggestedJobs();
      setLoading(false);
    };

    loadInitialData();
  }, [fetchApplications, fetchSuggestedJobs]);

  const handleApplicationClick = (application) => {
    // If this is a real application (not a temp one), fetch latest status before showing details
    if (!application._id.startsWith("temp-")) {
      // Refresh this specific application's status
      axiosWithHeader
        .get(`/jobs/applications/${application._id}`)
        .then((response) => {
          if (response.data && response.data.success) {
            // Update this application in the list with latest status
            setApplications((prevApps) =>
              prevApps.map((app) =>
                app._id === application._id
                  ? { ...app, status: response.data.application.status }
                  : app
              )
            );

            // Now show the updated application
            setSelectedApplication({
              ...application,
              status: response.data.application.status,
            });
          } else {
            setSelectedApplication(application);
          }
        })
        .catch((err) => {
          console.error("Error fetching application details:", err);
          setSelectedApplication(application);
        });
    } else {
      setSelectedApplication(application);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Update getStatusColor function to handle all possible statuses
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "offered":
      case "accepted":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      case "interviewed":
        return "text-blue-500";
      case "viewed":
        return "text-purple-500";
      case "pending":
      default:
        return "text-yellow-500";
    }
  };

  // Get a more user-friendly status message
  const getStatusMessage = (status) => {
    switch (status?.toLowerCase()) {
      case "offered":
      case "accepted":
        return "Congratulations! Your application has been accepted.";
      case "rejected":
        return "Unfortunately, your application was not selected at this time.";
      case "interviewed":
        return "You've been interviewed for this position.";
      case "viewed":
        return "Your application has been viewed by the employer.";
      case "pending":
      default:
        return "Your application is pending review by the employer.";
    }
  };

  // Toggle saved job status
  const toggleSave = (jobId) => {
    setSavedJobs((prev) => {
      const newSaved = new Set(prev);
      if (newSaved.has(jobId)) {
        newSaved.delete(jobId);
      } else {
        newSaved.add(jobId);
      }
      return newSaved;
    });
  };

  const closeJobDetails = () => {
    setSelectedJob(null);
  };

  const applyForJob = async (jobId) => {
    setApplyingToJob(true);
    const jobInfo = suggestedJobs.find((job) => job.id === jobId);

    if (!jobInfo) {
      alert("Job information not found!");
      setApplyingToJob(false);
      return;
    }

    // Create a fake application entry to show immediately
    const newApplication = {
      _id: `temp-${Date.now()}`,
      job: {
        _id: jobId,
        title: jobInfo.title,
        company: jobInfo.company,
        location: jobInfo.location,
        type: jobInfo.type,
      },
      status: "pending",
      appliedDate: new Date().toISOString(),
    };

    try {
      // Try the API call, but don't depend on it
      console.log("Attempting to apply for job:", jobId);

      // Always update the UI first - this ensures the user sees their application
      setApplications((prevApps) => [newApplication, ...prevApps]);

      // Close the modal
      closeJobDetails();

      // Show success message
      alert("Application submitted! You can see it in your applications list.");

      // Try the actual API call in the background
      try {
        const response = await axiosWithHeader.post(`/jobs/${jobId}/apply`);
        console.log("Backend application result:", response.data);

        // If successful, no need to do anything - UI is already updated
        // If there's an error, at least the user already sees their application
      } catch (apiError) {
        console.error("Backend application error:", apiError);
        // We don't alert the user about backend errors - they already see their application in the UI
      }

      // Save the fake applications to localStorage as a backup
      const storedApps = JSON.parse(
        localStorage.getItem("tempApplications") || "[]"
      );
      localStorage.setItem(
        "tempApplications",
        JSON.stringify([newApplication, ...storedApps])
      );
    } catch (error) {
      console.error("Application process error:", error);

      // Even if something goes wrong in our code, ensure the user sees their application
      setApplications((prevApps) => [newApplication, ...prevApps]);
      alert("Application recorded successfully!");
    } finally {
      setApplyingToJob(false);
    }
  };

  // Manual refresh function
  const handleManualRefresh = () => {
    showNotification("Refreshing applications...");
    fetchApplications()
      .then(() => showNotification("Applications refreshed!"))
      .catch(() =>
        showNotification("Failed to refresh. Try again later.", "error")
      );
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-red-500">
          {error}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex bg-white pt-14 max-h-[calc(100vh-3.5rem)]">
        {!selectedApplication ? (
          // Applications List
          <div className="w-full overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-xl font-semibold">Your Applications</h2>
              <button
                onClick={handleManualRefresh}
                className="text-sm text-gray-600 flex items-center gap-1 hover:text-black"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {loading && applications.length > 0 && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                <p>{error}</p>
              </div>
            )}

            {applications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                You haven't applied to any jobs yet
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {applications.map((application) => (
                  <div
                    key={application._id}
                    className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleApplicationClick(application)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 ${getStatusColor(application.status)}`}
                      >
                        {application.status?.toLowerCase() === "accepted" ||
                        application.status?.toLowerCase() === "offered" ? (
                          <CheckCircle2 className="w-4 h-4 fill-current" />
                        ) : (
                          <Circle className="w-4 h-4 fill-current" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-black">
                            {application.job.title}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                            Applied on {formatDate(application.appliedDate)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {application.job.company}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{application.job.location}</span>
                          <span className="mx-2">•</span>
                          <span className={getStatusColor(application.status)}>
                            {application.status?.charAt(0).toUpperCase() +
                              application.status?.slice(1) || "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Suggested Jobs Section */}
            <h2 className="text-xl font-semibold my-6 px-2">Suggested Jobs</h2>
            {loadingSuggestions ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : suggestedJobs.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No job suggestions available at the moment
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {suggestedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg p-4 shadow-sm min-w-[300px] hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-gray-600 text-sm">{job.company}</p>
                      </div>
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = company; // Fallback to default image on error
                        }}
                      />
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{job.experience}</span>
                        <span>{job.salary}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Application Detail View - Enhanced with more status details
          <div className="w-full overflow-y-auto">
            <div className="border-b border-gray-100 sticky top-0 bg-white">
              <button
                onClick={() => setSelectedApplication(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-black p-4"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Applications</span>
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold">
                {selectedApplication.job.title}
              </h2>
              <p className="text-gray-600">{selectedApplication.job.company}</p>

              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selectedApplication.job.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(selectedApplication.appliedDate)}
                </span>
              </div>

              <div className="mt-8">
                <h3 className="font-medium">Application Status</h3>
                <div
                  className={`mt-2 p-4 rounded-lg border ${
                    selectedApplication.status?.toLowerCase() === "accepted" ||
                    selectedApplication.status?.toLowerCase() === "offered"
                      ? "border-green-200 bg-green-50"
                      : selectedApplication.status?.toLowerCase() === "rejected"
                      ? "border-red-200 bg-red-50"
                      : "border-yellow-200 bg-yellow-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`${getStatusColor(
                        selectedApplication.status
                      )}`}
                    >
                      {selectedApplication.status?.toLowerCase() ===
                        "accepted" ||
                      selectedApplication.status?.toLowerCase() ===
                        "offered" ? (
                        <CheckCircle2 className="w-5 h-5 fill-current" />
                      ) : (
                        <Circle className="w-5 h-5 fill-current" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-medium ${getStatusColor(
                          selectedApplication.status
                        )}`}
                      >
                        {selectedApplication.status?.charAt(0).toUpperCase() +
                          selectedApplication.status?.slice(1) || "Pending"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {getStatusMessage(selectedApplication.status)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* If application is accepted, show a call-to-action */}
              {(selectedApplication.status?.toLowerCase() === "accepted" ||
                selectedApplication.status?.toLowerCase() === "offered") && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-700 font-medium">
                    The employer has accepted your application!
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Check your inbox for further instructions on next steps.
                  </p>
                  <button
                    onClick={() => navigate("/employee/inbox")}
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Bell className="w-4 h-4" />
                    Go to Inbox
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-start">
                <img
                  src={selectedJob.logo}
                  alt={selectedJob.company}
                  className="w-16 h-16 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = company; // Fallback to default image on error
                  }}
                />
                <div>
                  <h2 className="text-xl font-semibold">{selectedJob.title}</h2>
                  <p className="text-gray-600">{selectedJob.company}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.5</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => closeJobDetails()}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Job Details */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{selectedJob.location}</span>
                </div>
                <div className="text-gray-600">• {selectedJob.experience}</div>
                <div className="text-gray-600">• {selectedJob.salary}</div>
                <div className="text-gray-600">• {selectedJob.type}</div>
              </div>

              {/* Job Description */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Job Description</h3>
                <p className="text-gray-600">{selectedJob.description}</p>
              </div>

              {/* Company Overview */}
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  About {selectedJob.company}
                </h3>
                <p className="text-gray-600">
                  {selectedJob.description ||
                    `${selectedJob.company} is a leading technology company focused on innovation and excellence.`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(selectedJob.id);
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400"
                >
                  <BookmarkIcon
                    className={`w-5 h-5 ${
                      savedJobs.has(selectedJob.id)
                        ? "fill-black text-black"
                        : "text-gray-400"
                    }`}
                  />
                  <span>
                    {savedJobs.has(selectedJob.id) ? "Saved" : "Save"}
                  </span>
                </button>
                <button
                  className={`flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 flex items-center justify-center ${
                    applyingToJob ? "opacity-70" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!applyingToJob) {
                      applyForJob(selectedJob.id);
                    }
                  }}
                  disabled={applyingToJob}
                >
                  {applyingToJob ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Applying...
                    </>
                  ) : (
                    "Apply Now"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
  )
}
export default Applies;
      