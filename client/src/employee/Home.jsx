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
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import api from "../axiosWithHeaders";
import company from "../assets/company.png";

const Home = () => {
  const { t } = useLanguage();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Kochi");
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [hiddenJobs, setHiddenJobs] = useState(new Set());
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: "",
    position: "",
    minRate: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState([]);
  const [locationSearch, setLocationSearch] = useState("");

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

        const transformedJobs = response.data.map((job) => ({
          id: job._id,
          title: job.title,
          company:
            job.userId?.firstName + " " + job.userId?.lastName ||
            "Company Name",
          location: job.location,
          salary: `₹${job.salary}`,
          experience: job.duration,
          postedDate: formatDate(job.postedDate),
          type: job.position,
          skills: [],
          logo: company,
        }));

        setJobs(transformedJobs);
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

  const filteredJobs = jobs.filter((job) => {
    return (
      (!filters.location || job.location.includes(filters.location)) &&
      (!filters.position || job.type.includes(filters.position)) &&
      (!filters.minRate || job.rate >= filters.minRate)
    );
  });

  const filteredLocations = locations.filter((location) =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

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

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      {/* Search Section */}
      <div className="pt-14 px-4 pb-4 bg-white shadow-sm">
        <div className="relative flex items-center gap-2 mt-3">
          {/* Filter Button */}
          <button
            onClick={() => setShowFilterModal(true)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <SlidersHorizontal className="w-6 h-6 text-gray-600" />
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
              className="bg-white rounded-lg p-4 mb-0.5 shadow-sm border border-gray-100 mx-1 cursor-pointer"
              onClick={() => openJobDetails(job)}
            >
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(job.id);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-full flex items-center gap-1"
                      >
                        <BookmarkIcon
                          className={`w-5 h-5 ${
                            savedJobs.has(job.id)
                              ? "fill-black text-black"
                              : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            savedJobs.has(job.id)
                              ? "text-black"
                              : "text-gray-400"
                          }`}
                        >
                          {savedJobs.has(job.id) ? "Saved" : "Save"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
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
                    />
                    ₹15,000 - ₹30,000
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="compensation"
                      className="mr-2"
                      value="salary_30_50"
                    />
                    ₹30,000 - ₹50,000
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="compensation"
                      className="mr-2"
                      value="salary_50_80"
                    />
                    ₹50,000 - ₹80,000
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="compensation"
                      className="mr-2"
                      value="salary_80_plus"
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
                    />
                    ₹500 - ₹800 per day
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="compensation"
                      className="mr-2"
                      value="wage_800_1200"
                    />
                    ₹800 - ₹1,200 per day
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="compensation"
                      className="mr-2"
                      value="wage_1200_plus"
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
                    <input type="checkbox" className="mr-2" />
                    Full Time (40 hrs/week)
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Part Time (20-30 hrs/week)
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Flexible Hours
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  className="flex-1 py-3 border border-gray-300 rounded-lg"
                  onClick={() => setShowFilterModal(false)}
                >
                  {t("clear")}
                </button>
                <button
                  className="flex-1 py-3 bg-black text-white rounded-lg"
                  onClick={() => setShowFilterModal(false)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  closeJobDetails();
                }}
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
                <p className="text-gray-600">
                  We are looking for a {selectedJob.title} to join our team.
                  This is a full-time position with competitive compensation and
                  benefits.
                </p>
              </div>

              {/* Company Overview */}
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  About {selectedJob.company}
                </h3>
                <p className="text-gray-600">
                  {selectedJob.company} is a leading technology company focused
                  on innovation and excellence.
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
                  className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle apply action
                    console.log("Apply clicked for job:", selectedJob.id);
                  }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
