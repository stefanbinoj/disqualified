import React, { useState } from "react";
import Header from "./components/Header";
import { Search, SlidersHorizontal, ChevronDown, MapPin, Star, BookmarkIcon, EyeOffIcon } from "lucide-react";

// Sample job data
const jobs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp Solutions",
    location: "Bangalore, India",
    salary: "₹18-24 LPA",
    experience: "5-8 years",
    postedDate: "2 days ago",
    skills: ["React", "Node.js", "TypeScript"],
    type: "Full Time",
    logo: "https://via.placeholder.com/50"
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Innovation Labs",
    location: "Mumbai, India",
    salary: "₹20-25 LPA",
    experience: "4-7 years",
    postedDate: "1 day ago",
    skills: ["Product Strategy", "Agile", "Analytics"],
    type: "Full Time",
    logo: "https://via.placeholder.com/50"
  },
  {
    id: 3,
    title: "Product Manager",
    company: "Innovation Labs",
    location: "Mumbai, India",
    salary: "₹20-25 LPA",
    experience: "4-7 years",
    postedDate: "1 day ago",
    skills: ["Product Strategy", "Agile", "Analytics"],
    type: "Full Time",
    logo: "https://via.placeholder.com/50"
  },
  {
    id: 4,
    title: "Product Manager",
    company: "Innovation Labs",
    location: "Mumbai, India",
    salary: "₹20-25 LPA",
    experience: "4-7 years",
    postedDate: "1 day ago",
    skills: ["Product Strategy", "Agile", "Analytics"],
    type: "Full Time",
    logo: "https://via.placeholder.com/50"
  },
  {
    id: 5,
    title: "Product Manager",
    company: "Innovation Labs",
    location: "Mumbai, India",
    salary: "₹20-25 LPA",
    experience: "4-7 years",
    postedDate: "1 day ago",
    skills: ["Product Strategy", "Agile", "Analytics"],
    type: "Full Time",
    logo: "https://via.placeholder.com/50"
  },
  // Add more job listings as needed
];

const Home = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Kochi");
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [hiddenJobs, setHiddenJobs] = useState(new Set());
  const [selectedJob, setSelectedJob] = useState(null);

  const toggleSave = (jobId) => {
    setSavedJobs(prev => {
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
    setHiddenJobs(prev => new Set([...prev, jobId]));
  };

  const unhideJob = (jobId) => {
    setHiddenJobs(prev => {
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
            <span className="text-sm text-gray-700">{selectedLocation}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          
          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search jobs, skills, companies"
              className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Job Listings with reduced spacing */}
      <div className="px-2 py-1">
        {jobs.map(job => (
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
                    <span className="text-sm text-gray-600">• {job.experience}</span>
                    <span className="text-sm text-gray-600">• {job.salary}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{job.postedDate}</span>
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
                              ? 'fill-black text-black' 
                              : 'text-gray-400'
                          }`}
                        />
                        <span className={`text-xs ${
                          savedJobs.has(job.id) 
                            ? 'text-black' 
                            : 'text-gray-400'
                        }`}>
                          {savedJobs.has(job.id) ? 'Saved' : 'Save'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-4 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Select Location</h2>
              <button onClick={() => setShowLocationModal(false)}>✕</button>
            </div>
            <input
              type="text"
              placeholder="Search location..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <div className="space-y-3">
              {["Kochi", "Bangalore", "Mumbai", "Delhi NCR"].map((location) => (
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
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-4 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setShowFilterModal(false)}>✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Experience</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    0-2 years
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    2-5 years
                  </label>
                  {/* Add more experience ranges */}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Salary</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    3-6 LPA
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    6-10 LPA
                  </label>
                  {/* Add more salary ranges */}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  className="flex-1 py-3 border border-gray-300 rounded-lg"
                  onClick={() => setShowFilterModal(false)}
                >
                  Clear
                </button>
                <button 
                  className="flex-1 py-3 bg-black text-white rounded-lg"
                  onClick={() => setShowFilterModal(false)}
                >
                  Apply
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
                  We are looking for a {selectedJob.title} to join our team. This is a full-time position with competitive compensation and benefits.
                </p>
              </div>

              {/* Company Overview */}
              <div>
                <h3 className="font-semibold text-lg mb-2">About {selectedJob.company}</h3>
                <p className="text-gray-600">
                  {selectedJob.company} is a leading technology company focused on innovation and excellence.
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
                        ? 'fill-black text-black' 
                        : 'text-gray-400'
                    }`}
                  />
                  <span>{savedJobs.has(selectedJob.id) ? 'Saved' : 'Save'}</span>
                </button>
                <button 
                  className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle apply action
                    console.log('Apply clicked for job:', selectedJob.id);
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