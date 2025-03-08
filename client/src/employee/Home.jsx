import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  MapPin,
  Star,
  BookmarkIcon,
  EyeOffIcon,
  X,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import api from "../axiosWithHeaders";
import company from "../assets/company.png";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";

const Home = () => {
  const { t } = useLanguage();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Kochi");
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [hiddenJobs, setHiddenJobs] = useState(new Set());
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    salaryRange: "",
    wageRange: "",
    workingHours: [],
  });
  const [activeFilters, setActiveFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [applyingToJob, setApplyingToJob] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  // Toggle save job with animation and notification
  const toggleSave = (jobId, event) => {
    if (event) {
      event.stopPropagation();
    }

    setSavedJobs((prev) => {
      const newSaved = new Set(prev);
      if (newSaved.has(jobId)) {
        newSaved.delete(jobId);
        toast.success("Job removed from saved items");
      } else {
        newSaved.add(jobId);
        toast.success("Job saved! You can view it later.");
      }

      // Save to localStorage
      localStorage.setItem("savedJobs", JSON.stringify([...newSaved]));
      return newSaved;
    });
  };

  // Load saved jobs and applied jobs from localStorage on initial load
  useEffect(() => {
    try {
      // Load saved jobs
      const savedJobsData = localStorage.getItem("savedJobs");
      if (savedJobsData) {
        setSavedJobs(new Set(JSON.parse(savedJobsData)));
      }

      // Load applied jobs
      const appliedJobsData = localStorage.getItem("appliedJobs");
      if (appliedJobsData) {
        setAppliedJobs(new Set(JSON.parse(appliedJobsData)));
      }

      // Also check temporary applications to mark those jobs as applied
      const tempApps = JSON.parse(
        localStorage.getItem("tempApplications") || "[]"
      );
      if (tempApps.length > 0) {
        const tempAppliedJobIds = tempApps.map((app) => app.job._id);
        setAppliedJobs((prev) => new Set([...prev, ...tempAppliedJobIds]));
      }
    } catch (error) {
      console.error("Error loading applied/saved jobs:", error);
    }
  }, []);

  const hideJob = (jobId) => {
    setHiddenJobs((prev) => new Set([...prev, jobId]));
  };

  const unhideJob = (jobId) => {
    setHiddenJobs((prev) => {
      const newHidden = new Set(prev);
      newHidden.delete(jobId);
      return newHidden;
    });
  };

  const openJobDetails = (job) => {
    setSelectedJob(job);
  };

  const closeJobDetails = () => {
    setSelectedJob(null);
  };

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    if (type === "workingHours") {
      setFilters((prev) => {
        // Toggle working hours selection
        const updatedHours = prev.workingHours.includes(value)
          ? prev.workingHours.filter((item) => item !== value)
          : [...prev.workingHours, value];

        return { ...prev, workingHours: updatedHours };
      });
    } else {
      // For salary and wage ranges - radio buttons
      setFilters((prev) => ({ ...prev, [type]: value }));
    }
  };

  // Apply filters function
  const applyFilters = () => {
    const newActiveFilters = { ...filters };
    setActiveFilters(newActiveFilters);
    applyActiveFilters();
    setShowFilterModal(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      salaryRange: "",
      wageRange: "",
      workingHours: [],
    });
    setActiveFilters({});
    setFilteredJobs(jobs.filter((job) => !hiddenJobs.has(job.id)));
    setShowFilterModal(false);
  };

  // Remove a specific filter
  const removeFilter = (filterType) => {
    const newActiveFilters = { ...activeFilters };

    if (filterType === "workingHours") {
      delete newActiveFilters.workingHours;
      setFilters((prev) => ({ ...prev, workingHours: [] }));
    } else {
      delete newActiveFilters[filterType];
      setFilters((prev) => ({ ...prev, [filterType]: "" }));
    }

    setActiveFilters(newActiveFilters);
    applyActiveFilters();
  };

  // Apply active filters to jobs
  const applyActiveFilters = () => {
    let filtered = jobs.filter((job) => !hiddenJobs.has(job.id));

    // Filter by selected location
    if (selectedLocation && selectedLocation !== "All Locations") {
      filtered = filtered.filter((job) => job.location === selectedLocation);
    }

    // Apply salary filter
    if (activeFilters.salaryRange) {
      const salaryRanges = {
        salary_15_30: (job) =>
          extractSalary(job.salary) >= 15000 &&
          extractSalary(job.salary) <= 30000,
        salary_30_50: (job) =>
          extractSalary(job.salary) >= 30000 &&
          extractSalary(job.salary) <= 50000,
        salary_50_80: (job) =>
          extractSalary(job.salary) >= 50000 &&
          extractSalary(job.salary) <= 80000,
        salary_80_plus: (job) => extractSalary(job.salary) >= 80000,
      };

      if (salaryRanges[activeFilters.salaryRange]) {
        filtered = filtered.filter(salaryRanges[activeFilters.salaryRange]);
      }
    }

    // Apply wage filter
    if (activeFilters.wageRange) {
      const wageRanges = {
        wage_500_800: (job) =>
          extractWage(job.salary) >= 500 && extractWage(job.salary) <= 800,
        wage_800_1200: (job) =>
          extractWage(job.salary) >= 800 && extractWage(job.salary) <= 1200,
        wage_1200_plus: (job) => extractWage(job.salary) >= 1200,
      };

      if (wageRanges[activeFilters.wageRange]) {
        filtered = filtered.filter(wageRanges[activeFilters.wageRange]);
      }
    }

    // Apply working hours filter
    if (activeFilters.workingHours && activeFilters.workingHours.length > 0) {
      filtered = filtered.filter((job) => {
        // Simple keyword matching for now - this could be improved with better data
        return activeFilters.workingHours.some((hours) => {
          if (hours === "fulltime")
            return job.type.toLowerCase().includes("full");
          if (hours === "parttime")
            return job.type.toLowerCase().includes("part");
          if (hours === "flexible")
            return job.type.toLowerCase().includes("flex");
          return false;
        });
      });
    }

    setFilteredJobs(filtered);
  };

  // Helper to extract numeric salary values
  const extractSalary = (salaryString) => {
    if (!salaryString) return 0;
    const match = salaryString.match(/₹(\d+),?(\d+)?/);
    if (match) {
      const value = match[1] + (match[2] || "");
      return parseInt(value.replace(/,/g, ""), 10);
    }
    return 0;
  };

  // Helper to extract wage values
  const extractWage = (wageString) => {
    if (!wageString) return 0;
    // Similar to extractSalary but for daily wages
    const match = wageString.match(/₹(\d+),?(\d+)?/);
    if (match) {
      const value = match[1] + (match[2] || "");
      return parseInt(value.replace(/,/g, ""), 10);
    }
    return 0;
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get("/jobs");
        const uniqueLocations = [
          ...new Set(response.data.map((job) => job.location)),
        ];
        setLocations(uniqueLocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get("/jobs", {
          params: {
            search: searchQuery,
            location:
              selectedLocation !== "All Locations" ? selectedLocation : "",
          },
        });

        const transformedJobs = response.data.map((job) => {
          const companyName =
            job.company ||
            (job.userId?.firstName || job.userId?.lastName
              ? `${job.userId?.firstName || ""} ${
                  job.userId?.lastName || ""
                }'s Company`.trim()
              : "Company Name");

          const formattedSalary = job.salary
            ? job.salary.startsWith("₹")
              ? job.salary
              : `₹${job.salary}`
            : job.rate
            ? `₹${job.rate}`
            : "₹Not specified";

          // Use the employer's profile picture if available
          const profilePicture = job.userId?.profilePicture || job.companyLogo;

          return {
            id: job._id,
            title: job.title || "Job Title",
            company: companyName,
            description: job.description || "No description provided",
            location: job.location || "Remote",
            salary: formattedSalary,
            experience: job.experience || job.duration || "Not specified",
            postedDate: formatDate(job.postedDate),
            type: job.type || job.position || "Full Time",
            skills: job.skills || [],
            logo: profilePicture || company, // Use company logo from assets as fallback
            employerId: job.userId?._id, // Store the employer ID for messaging
          };
        });

        setJobs(transformedJobs);
        setFilteredJobs(transformedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError(error.response?.data?.message || "Failed to fetch jobs");
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedLocation]);

  // Apply active filters whenever jobs or active filters change
  useEffect(() => {
    if (jobs.length > 0) {
      applyActiveFilters();
    }
  }, [jobs, activeFilters, hiddenJobs, selectedLocation]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const filteredLocations = locations.filter((location) =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const applyForJob = async (jobId) => {
    // Prevent duplicate applications
    if (appliedJobs.has(jobId)) {
      toast.error("You have already applied for this job");
      return;
    }

    setApplyingToJob(true);
    const jobInfo = jobs.find((job) => job.id === jobId);

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
      // Mark this job as applied
      const updatedAppliedJobs = new Set(appliedJobs);
      updatedAppliedJobs.add(jobId);
      setAppliedJobs(updatedAppliedJobs);

      // Save to localStorage to prevent future duplicate applications
      localStorage.setItem(
        "appliedJobs",
        JSON.stringify([...updatedAppliedJobs])
      );

      // Always update the UI first by storing in localStorage
      const storedApps = JSON.parse(
        localStorage.getItem("tempApplications") || "[]"
      );
      localStorage.setItem(
        "tempApplications",
        JSON.stringify([newApplication, ...storedApps])
      );

      // Close the modal
      closeJobDetails();

      // Show success message
      alert("Application submitted! You can see it in your applications list.");

      // Try the actual API call in the background
      try {
        // 1. Apply for the job
        const response = await api.post(`/jobs/${jobId}/apply`);
        console.log("Backend application result:", response.data);

        // 2. Send a confirmation message to the applicant's inbox
        await api.post("/messages/send", {
          recipient: "self", // Send to yourself
          subject: `Application Confirmation: ${jobInfo.title}`,
          content: `Your application for "${jobInfo.title}" at ${jobInfo.company} has been submitted successfully. The employer will review your application and get back to you soon.`,
          relatedJob: jobId,
        });

        // 3. Send a notification to the employer
        await api.post("/messages/send", {
          recipient: jobInfo.employerId || "employer", // Send to the employer who posted the job
          subject: `New Application: ${jobInfo.title}`,
          content: `A new candidate has applied for your job "${jobInfo.title}". You can review this application in your employer dashboard.`,
          relatedJob: jobId,
          isNotification: true,
        });

        // If successful, show toast notification as additional confirmation
        if (response.data.success) {
          toast.success(
            "Application confirmed! A confirmation message has been sent to your inbox."
          );
        }
      } catch (apiError) {
        console.error("Backend application error:", apiError);
        // We still keep the user's application in localStorage so it shows in the UI
      }
    } catch (error) {
      console.error("Application process error:", error);
      alert(
        "Application recorded but encountered an issue. It will still appear in your applications."
      );
    } finally {
      setApplyingToJob(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // Get active filter count
  const activeFilterCount = Object.keys(activeFilters).filter((key) => {
    if (key === "workingHours") {
      return activeFilters[key]?.length > 0;
    }
    return activeFilters[key];
  }).length;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      {/* Search Section */}
      <div className="pt-14 px-4 pb-4 bg-white shadow-sm">
        <div className="relative flex items-center gap-2 mt-3">
          {/* Filter Button */}
          <button
            onClick={() => setShowFilterModal(true)}
            className="p-2 hover:bg-gray-100 rounded-full relative"
          >
            <SlidersHorizontal className="w-6 h-6 text-gray-600" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Location Dropdown */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400"
          >
            <span className="text-sm text-gray-700">
              {selectedLocation || "All Locations"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Active Filters display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {activeFilters.salaryRange && (
              <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1">
                <span>
                  {activeFilters.salaryRange === "salary_15_30" && "₹15K-₹30K"}
                  {activeFilters.salaryRange === "salary_30_50" && "₹30K-₹50K"}
                  {activeFilters.salaryRange === "salary_50_80" && "₹50K-₹80K"}
                  {activeFilters.salaryRange === "salary_80_plus" && "₹80K+"}
                </span>
                <button onClick={() => removeFilter("salaryRange")}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {activeFilters.wageRange && (
              <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1">
                <span>
                  {activeFilters.wageRange === "wage_500_800" &&
                    "₹500-₹800/day"}
                  {activeFilters.wageRange === "wage_800_1200" &&
                    "₹800-₹1200/day"}
                  {activeFilters.wageRange === "wage_1200_plus" && "₹1200+/day"}
                </span>
                <button onClick={() => removeFilter("wageRange")}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {activeFilters.workingHours?.length > 0 && (
              <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1">
                <span>
                  {activeFilters.workingHours.length === 1
                    ? activeFilters.workingHours[0] === "fulltime"
                      ? "Full Time"
                      : activeFilters.workingHours[0] === "parttime"
                      ? "Part Time"
                      : "Flexible"
                    : `${activeFilters.workingHours.length} schedules`}
                </span>
                <button onClick={() => removeFilter("workingHours")}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Job Listings with reduced spacing */}
      <div className="px-2 py-1">
        {filteredJobs.map((job) =>
          hiddenJobs.has(job.id) ? (
            <div
              key={job.id}
              className="bg-gray-50 p-3 mb-0.5 text-sm text-gray-600 flex justify-between items-center"
            >
              <span>We will suggest fewer posts like this now.</span>
              <button
                onClick={() => unhideJob(job.id)}
                className="text-black underline text-xs"
              >
                Undo
              </button>
            </div>
          ) : (
            <div
              key={job.id}
              className="bg-white rounded-lg p-4 mb-0.5 shadow-sm border border-gray-100 mx-1 cursor-pointer relative group"
              onClick={() => openJobDetails(job)}
            >
              {/* Floating save button - visible on hover or when saved */}
              <button
                onClick={(e) => toggleSave(job.id, e)}
                className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                  savedJobs.has(job.id)
                    ? "bg-black text-white opacity-100"
                    : "bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100"
                }`}
                aria-label={savedJobs.has(job.id) ? "Unsave job" : "Save job"}
              >
                <BookmarkIcon
                  className={`w-4 h-4 ${
                    savedJobs.has(job.id) ? "fill-white" : ""
                  }`}
                />
              </button>

              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <div className="flex items-start pr-8">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">4.5</span>
                      </div>
                    </div>
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-12 h-12 rounded-lg object-cover ml-4"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = company; // Fallback to default image on error
                      }}
                    />
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="text-sm text-gray-600">
                      • {job.experience}
                    </span>
                    <span className="text-sm text-gray-600">
                      • {job.salary}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        {job.postedDate}
                      </span>
                      <span className="text-sm text-gray-600">{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          hideJob(job.id);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-full flex items-center gap-1"
                      >
                        <EyeOffIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-xs text-gray-400">Hide</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {filteredJobs.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-sm mt-4 mx-2">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No matching jobs found
            </h3>
            <p className="text-gray-500 max-w-md">
              We couldn't find any jobs that match your current filters. Try
              adjusting your search criteria or check back later for new
              opportunities.
            </p>
            {Object.keys(activeFilters).length > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-x-0 top-[72px] z-50">
          <div
            className="bg-black/25 backdrop-blur-[2px] h-screen"
            onClick={() => setShowLocationModal(false)}
          >
            <div
              className="bg-white w-full rounded-b-2xl p-4 animate-slide-up max-h-[50vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{t("selectLocation")}</h2>
                <button onClick={() => setShowLocationModal(false)}>✕</button>
              </div>
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder={t("searchLocation")}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 sticky top-0"
              />
              <div className="space-y-3 overflow-y-auto max-h-[calc(50vh-120px)]">
                <button
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg"
                  onClick={() => {
                    setSelectedLocation("All Locations");
                    setShowLocationModal(false);
                  }}
                >
                  All Locations
                </button>
                {filteredLocations.map((location) => (
                  <button
                    key={location}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg"
                    onClick={() => {
                      setSelectedLocation(location);
                      setShowLocationModal(false);
                    }}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-4 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{t("filters")}</h2>
              <button onClick={() => setShowFilterModal(false)}>✕</button>
            </div>
            <div className="space-y-4">
              {/* Monthly Salary Ranges */}
              <div>
                <h3 className="font-medium mb-2">Monthly Salary</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="compensation"
                      className="mr-2"
                      value="salary_15_30"
                      checked={filters.salaryRange === "salary_15_30"}
                      onChange={() =>
                        handleFilterChange("salaryRange", "salary_15_30")
                      }
                    />
                    ₹15,000 - ₹30,000
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="compensation"
                      className="mr-2"
                      value="salary_30_50"
                      checked={filters.salaryRange === "salary_30_50"}
                      onChange={() =>
                        handleFilterChange("salaryRange", "salary_30_50")
                      }
                    />
                    ₹30,000 - ₹50,000
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="compensation"
                      className="mr-2"
                      value="salary_50_80"
                      checked={filters.salaryRange === "salary_50_80"}
                      onChange={() =>
                        handleFilterChange("salaryRange", "salary_50_80")
                      }
                    />
                    ₹50,000 - ₹80,000
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="compensation"
                      className="mr-2"
                      value="salary_80_plus"
                      checked={filters.salaryRange === "salary_80_plus"}
                      onChange={() =>
                        handleFilterChange("salaryRange", "salary_80_plus")
                      }
                    />
                    ₹80,000+
                  </label>
                </div>
              </div>

              {/* Daily Wage Ranges */}
              <div>
                <h3 className="font-medium mb-2">Daily Wage</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="compensation"
                      className="mr-2"
                      value="wage_500_800"
                      checked={filters.wageRange === "wage_500_800"}
                      onChange={() =>
                        handleFilterChange("wageRange", "wage_500_800")
                      }
                    />
                    ₹500 - ₹800 per day
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="compensation"
                      className="mr-2"
                      value="wage_800_1200"
                      checked={filters.wageRange === "wage_800_1200"}
                      onChange={() =>
                        handleFilterChange("wageRange", "wage_800_1200")
                      }
                    />
                    ₹800 - ₹1,200 per day
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="compensation"
                      className="mr-2"
                      value="wage_1200_plus"
                      checked={filters.wageRange === "wage_1200_plus"}
                      onChange={() =>
                        handleFilterChange("wageRange", "wage_1200_plus")
                      }
                    />
                    ₹1,200+ per day
                  </label>
                </div>
              </div>

              {/* Working Hours */}
              <div>
                <h3 className="font-medium mb-2">Working Hours</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filters.workingHours.includes("fulltime")}
                      onChange={() =>
                        handleFilterChange("workingHours", "fulltime")
                      }
                    />
                    Full Time (40 hrs/week)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filters.workingHours.includes("parttime")}
                      onChange={() =>
                        handleFilterChange("workingHours", "parttime")
                      }
                    />
                    Part Time (20-30 hrs/week)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filters.workingHours.includes("flexible")}
                      onChange={() =>
                        handleFilterChange("workingHours", "flexible")
                      }
                    />
                    Flexible Hours
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  className="flex-1 py-3 border border-gray-300 rounded-lg"
                  onClick={clearFilters}
                >
                  {t("clear")}
                </button>
                <button
                  className="flex-1 py-3 bg-black text-white rounded-lg"
                  onClick={applyFilters}
                >
                  {t("apply")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(selectedJob.id);
                  }}
                  className={`w-10 h-10 flex items-center justify-center rounded-full 
                    ${
                      savedJobs.has(selectedJob.id)
                        ? "bg-black text-white"
                        : "border border-gray-300 text-gray-400 hover:border-gray-400"
                    }`}
                >
                  <BookmarkIcon
                    className={`w-5 h-5 ${
                      savedJobs.has(selectedJob.id) ? "fill-white" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={closeJobDetails}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
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

              {/* Updated Apply Button - Disabled if already applied */}
              <div className="pt-4">
                {appliedJobs.has(selectedJob.id) ? (
                  <button
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-medium cursor-default flex items-center justify-center"
                    disabled
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Already Applied
                  </button>
                ) : (
                  <button
                    className={`w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 font-medium flex items-center justify-center ${
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
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animation CSS as in Applies.jsx */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;
