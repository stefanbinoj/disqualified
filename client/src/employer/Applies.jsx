import React, { useState } from "react";
import Header from "../components/layout/Header";
import { MapPin, Phone, Calendar, ChevronRight } from "lucide-react";

// Sample applications data
const applications = [
  {
    id: 1,
    applicant: {
      name: "Rahul Kumar",
      phone: "9876543210",
      experience: "5 years",
      skills: ["Electrical wiring", "Circuit installation", "Maintenance"],
      currentLocation: "Kochi, Kerala"
    },
    job: {
      title: "Senior Electrician",
      company: "City Maintenance Services",
      location: "Kochi, Kerala",
      salary: "₹18-24k/month",
      type: "Full Time",
      logo: "https://via.placeholder.com/50"
    },
    appliedDate: "2024-02-15",
    status: "Under Review"
  },
  {
    id: 2,
    applicant: {
      name: "Mary Thomas",
      phone: "9876543211",
      experience: "10 years",
      skills: ["Kerala cuisine", "Chinese cuisine", "Bulk cooking"],
      currentLocation: "Ernakulam, Kerala"
    },
    job: {
      title: "Head Cook",
      company: "City Maintenance Services",
      location: "Kochi, Kerala",
      salary: "₹25-30k/month",
      type: "Full Time",
      logo: "https://via.placeholder.com/50"
    },
    appliedDate: "2024-02-18",
    status: "Under Review"
  },
  // Add more applications as needed
];

const Applies = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicationStatuses, setApplicationStatuses] = useState(
    applications.reduce((acc, app) => ({ ...acc, [app.id]: app.status }), {})
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Under Review":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleStatusChange = (applicationId, newStatus) => {
    setApplicationStatuses(prev => ({
      ...prev,
      [applicationId]: newStatus
    }));
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  // Application Details Modal
  const ApplicationModal = ({ application, onClose }) => (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4 items-start">
            <img 
              src={application.job.logo} 
              alt={application.job.company} 
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">{application.job.title}</h2>
              <p className="text-gray-600">{application.job.company}</p>
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
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Applicant Details</h3>
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">{application.applicant.name}</p>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{application.applicant.currentLocation}</span>
              </div>
              <button 
                onClick={() => handleCall(application.applicant.phone)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <Phone className="w-4 h-4" />
                <span>{application.applicant.phone}</span>
              </button>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Job Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Salary:</span>
                <span>{application.job.salary}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Job Type:</span>
                <span>{application.job.type}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Applied On:</span>
                <span>{new Date(application.appliedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Application Status</h3>
            <div className="flex gap-3">
              <button 
                onClick={() => handleStatusChange(application.id, "Accepted")}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Accept
              </button>
              <button 
                onClick={() => handleStatusChange(application.id, "Rejected")}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-14">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex items-center justify-between mt-6 mb-4 px-2">
            <h1 className="text-2xl font-semibold">Applications</h1>
            <div className="text-sm text-gray-500">
              {applications.length} total applications
            </div>
          </div>
          
          <div className="grid gap-[1px] bg-gray-100">
            {applications.map((application) => (
              <div 
                key={application.id}
                className="bg-white p-4 hover:shadow-md transition-all cursor-pointer border-b border-gray-100 hover:bg-gray-50"
                onClick={() => setSelectedApplication(application)}
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={application.job.logo}
                    alt={application.job.company}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {application.applicant.name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          Applied for: {application.job.title}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${getStatusColor(applicationStatuses[application.id])}`}>
                        {applicationStatuses[application.id]}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-6">
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{application.applicant.currentLocation}</span>
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(application.appliedDate).toLocaleDateString()}</span>
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedApplication && (
        <ApplicationModal 
          application={selectedApplication} 
          onClose={() => setSelectedApplication(null)} 
        />
      )}
    </div>
  );
};

export default Applies;
