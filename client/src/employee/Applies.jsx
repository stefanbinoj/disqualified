import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import company from "../assets/company.png";

const Applies = () => {
  const [applications, setApplications] = useState([]);
  const [suggestedJobs] = useState([
    {
      id: 201,
      title: "AC Technician",
      company: "Royal Palace Hotel",
      location: "Kochi, Kerala",
      salary: "₹22-25k/month",
      experience: "2-4 years",
      type: "Full Time",
      logo: company,
    },
    {
      id: 202,
      title: "Maintenance Electrician",
      company: "Tech Park Solutions",
      location: "Bangalore, Karnataka",
      salary: "₹18-20k/month",
      experience: "1-3 years",
      type: "Full Time",
      logo: company,
    },
    {
      id: 203,
      title: "House Painter",
      company: "Premium Interiors",
      location: "Kochi, Kerala",
      salary: "₹800/day",
      experience: "2+ years",
      type: "Contract",
      logo: company,
    },
    {
      id: 204,
      title: "Security Supervisor",
      company: "Metro Mall",
      location: "Ernakulam, Kerala",
      salary: "₹15k/month",
      experience: "3-5 years",
      type: "Full Time",
      logo: company,
    },
    {
      id: 205,
      title: "Carpenter",
      company: "Furniture Craft",
      location: "Thrissur, Kerala",
      salary: "₹20-25k/month",
      experience: "4+ years",
      type: "Full Time",
      logo: company,
    },
    {
      id: 206,
      title: "Plumber",
      company: "City Services",
      location: "Kochi, Kerala",
      salary: "₹15-18k/month",
      experience: "2+ years",
      type: "Full Time",
      logo: company,
    },
    {
      id: 207,
      title: "Driver",
      company: "School Transport Services",
      location: "Aluva, Kerala",
      salary: "₹16k/month",
      experience: "3+ years",
      type: "Full Time",
      logo: company,
    },
    {
      id: 208,
      title: "Cook",
      company: "Garden Restaurant",
      location: "Kochi, Kerala",
      salary: "₹15-20k/month",
      experience: "2+ years",
      type: "Full Time",
      logo: company,
    },
    {
      id: 209,
      title: "Gardener",
      company: "Luxury Apartments",
      location: "Kakkanad, Kerala",
      salary: "₹12k/month",
      experience: "1+ years",
      type: "Part Time",
      logo: company,
    },
    {
      id: 210,
      title: "Watchman",
      company: "Residential Complex",
      location: "Edappally, Kerala",
      salary: "₹13k/month",
      experience: "1-2 years",
      type: "Full Time",
      logo: company,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axiosWithHeader.get("/users/applied");
      if (response.data.success) {
        setApplications(response.data.applied);
      } else {
        setError("Failed to fetch applications");
      }
    } catch (err) {
      setError(
        "Failed to fetch applications: " +
          (err.response?.data?.message || err.message)
      );
      console.error("Applications fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
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
            <h2 className="text-xl font-semibold mb-4 px-2">
              Your Applications
            </h2>

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
                        <Circle className="w-4 h-4 fill-current" />
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
                            {application.status.charAt(0).toUpperCase() +
                              application.status.slice(1)}
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
          </div>
        ) : (
          // Application Detail View
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

              <div className="mt-6">
                <h3 className="font-medium">Application Status</h3>
                <p
                  className={`mt-1 ${getStatusColor(
                    selectedApplication.status
                  )}`}
                >
                  {selectedApplication.status.charAt(0).toUpperCase() +
                    selectedApplication.status.slice(1)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applies;
