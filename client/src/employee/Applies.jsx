import React, { useState } from "react";
import Header from "./components/Header";
import { ChevronRight, MapPin, Star, BookmarkIcon, EyeOffIcon, ChevronLeft } from "lucide-react";
import { useLanguage } from '../contexts/LanguageContext';

// This should come from your global state management (like Redux/Context)
const applications = [
  {
    id: 1,
    jobId: 101,
    appliedDate: "2024-02-15",
    status: "Under Review", // Changed from "Interview Scheduled"
    job: {
      title: "Senior Electrician",
      company: "City Maintenance Services",
      location: "Kochi, Kerala",
      salary: "₹18-24 LPA",
      experience: "5-8 years",
      type: "Full Time",
      logo: "https://via.placeholder.com/50"
    }
  },
  {
    id: 2,
    jobId: 102,
    appliedDate: "2024-02-18",
    status: "Applied",
    job: {
      title: "Plumber",
      company: "Green Apartments",
      location: "Bangalore, India",
      salary: "₹15-18 LPA",
      experience: "3-5 years",
      type: "Full Time",
      logo: "https://via.placeholder.com/50"
    }
  }
];

// Sample suggested jobs (should come from your jobs data)
const suggestedJobs = [
  {
    id: 201,
    title: "AC Technician",
    company: "Royal Palace Hotel",
    location: "Kochi, Kerala",
    salary: "₹22-25k/month",
    experience: "2-4 years",
    type: "Full Time",
    logo: "https://via.placeholder.com/50"
  },
  {
    id: 202,
    title: "Maintenance Electrician",
    company: "Tech Park Solutions",
    location: "Bangalore, Karnataka",
    salary: "₹18-20k/month",
    experience: "1-3 years",
    type: "Full Time",
    logo: "https://via.placeholder.com/50"
  },
  {
    id: 203,
    title: "House Painter",
    company: "Premium Interiors",
    location: "Kochi, Kerala",
    salary: "₹800/day",
    experience: "2+ years",
    type: "Contract",
    logo: "https://via.placeholder.com/50"
  },
  {
    id: 204,
    title: "Security Supervisor",
    company: "Metro Mall",
    location: "Ernakulam, Kerala",
    salary: "₹15k/month",
    experience: "3-5 years",
    type: "Full Time",
    logo: "https://via.placeholder.com/50"
  },
  {
    id: 205,
    title: "Carpenter",
    company: "Furniture Craft",
    location: "Thrissur, Kerala",
    salary: "₹20-25k/month",
    experience: "4+ years",
    type: "Full Time",
    logo: "https://via.placeholder.com/50"
  },
  {
    id: 206,
    title: "Plumber",
    company: "City Services",
    location: "Kochi, Kerala",
    salary: "₹15-18k/month",
    experience: "2+ years",
    type: "Full Time",
    logo: "https://via.placeholder.com/50"
  },
  {
    id: 207,
    title: "Driver",
    company: "School Transport Services",
    location: "Aluva, Kerala",
    salary: "₹16k/month",
    experience: "3+ years",
    type: "Full Time",
    logo: "https://via.placeholder.com/50"
  },
  {
    id: 208,
    title: "Cook",
    company: "Garden Restaurant",
    location: "Kochi, Kerala",
    salary: "₹15-20k/month",
    experience: "2+ years",
    type: "Full Time",
    logo: "https://via.placeholder.com/50"
  },
  {
    id: 209,
    title: "Gardener",
    company: "Luxury Apartments",
    location: "Kakkanad, Kerala",
    salary: "₹12k/month",
    experience: "1+ years",
    type: "Part Time",
    logo: "https://via.placeholder.com/50"
  },
  {
    id: 210,
    title: "Watchman",
    company: "Residential Complex",
    location: "Edappally, Kerala",
    salary: "₹13k/month",
    experience: "1-2 years",
    type: "Full Time",
    logo: "https://via.placeholder.com/50"
  }
];

const Applies = () => {
  const { t } = useLanguage();
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Selected":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Applied":
        return "bg-yellow-100 text-yellow-700";
      case "Under Review":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Application Details Modal
  const ApplicationModal = ({ application, onClose, t }) => (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
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

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{application.job.location}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
              {application.status}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>{t('experienceRequired')}:</span>
              <span>{application.job.experience}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{t('salary')}:</span>
              <span>{application.job.salary}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{t('jobType')}:</span>
              <span>{application.job.type}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{t('appliedOn')}:</span>
              <span>{new Date(application.appliedDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Job Details Modal (same as Home.jsx)
  const JobModal = ({ job, onClose, t }) => (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4 items-start">
            <img 
              src={job.logo} 
              alt={job.company} 
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.company}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{job.location}</span>
            </div>
            <div className="text-gray-600">• {job.experience}</div>
            <div className="text-gray-600">• {job.salary}</div>
            <div className="text-gray-600">• {job.type}</div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">{t('jobDescription')}</h3>
            <p className="text-gray-600">
              We are looking for a {job.title} to join our team. This is a {job.type.toLowerCase()} position with competitive compensation and benefits.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">{t('about')} {job.company}</h3>
            <p className="text-gray-600">
              {job.company} is a leading company in its field, focused on providing quality services.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                // Handle apply action
                console.log('Apply clicked for job:', job.id);
              }}
            >
              {t('applyNow')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-14 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Applications Section */}
          <h1 className="text-2xl font-semibold mt-6 mb-4">{t('yourApplications')}</h1>
          
          {applications.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-600">{t('noApplications')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((application) => (
                <div 
                  key={application.id}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedApplication(application)}
                >
                  <div className="flex items-start gap-4">
                    <img 
                      src={application.job.logo}
                      alt={application.job.company}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{application.job.title}</h3>
                          <p className="text-gray-600 text-sm">{application.job.company}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {application.job.location}
                        </span>
                        <span>{t('appliedOn')} {new Date(application.appliedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Suggestions Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t('suggestions')}</h2>
              <div className="flex gap-2">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {suggestedJobs.map(job => (
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
        </div>
      </div>

      {/* Render appropriate modal based on what was clicked */}
      {selectedApplication && (
        <ApplicationModal 
          application={selectedApplication} 
          onClose={() => setSelectedApplication(null)} 
          t={t}
        />
      )}
      {selectedJob && (
        <JobModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
          t={t}
        />
      )}
    </div>
  );
};

export default Applies;
