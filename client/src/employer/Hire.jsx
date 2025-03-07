import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import {
  MapPin,
  Building,
  Clock,
  IndianRupee,
  Users,
  Star,
  X,
  Plus,
} from "lucide-react";
import api from "../axiosWithHeaders";

const Hire = () => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    salary: "15000 - 25000",
    salaryType: "monthly",
    type: "Full Time",
    workingHours: "",
    workingHoursType: "per week",
    description: "",
    companyName: "xyz",
    logo: null,
    logoPreview: null,
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await api.get("/users/");
        const { user } = response.data;
        setFormData((prev) => ({
          ...prev,
          companyName: user.companyName,
          logoPreview: user.logo || null,
        }));
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    fetchCompanyDetails();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.salary.trim()) newErrors.salary = "Salary range is required";
    if (!formData.workingHours.trim())
      newErrors.workingHours = "Working hours are required";
    if (!formData.description.trim())
      newErrors.description = "Job description is required";
    if (!formData.type) newErrors.type = "Job type is required";

    if (formData.salary) {
      if (!/^\d+(\s*-\s*\d+)?$/.test(formData.salary.replace(/,/g, ""))) {
        newErrors.salary = "Invalid salary format. Use format: 15000 - 25000";
      } else {
        const [min, max] = formData.salary
          .split("-")
          .map((num) => parseInt(num.replace(/[^\d]/g, "")));
        if (max && min >= max) {
          newErrors.salary =
            "Maximum salary should be greater than minimum salary";
        }
      }
    }

    if (!formData.workingHours.trim()) {
      newErrors.workingHours = "Working hours are required";
    } else if (!/^\d+$/.test(formData.workingHours)) {
      newErrors.workingHours = "Please enter a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Modify the handleSubmit function:

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Format salary - extract the first number from the range for database storage
      let salaryValue = 0;
      if (formData.salary) {
        // Parse the first number from a string like "15,000 - 25,000"
        const salaryMatch = formData.salary.replace(/,/g, "").match(/\d+/);
        if (salaryMatch) {
          salaryValue = parseInt(salaryMatch[0]);
        }
      }

      // Prepare job data object
      const jobData = {
        title: formData.title,
        description: formData.description,
        company: formData.companyName,
        location: formData.location,
        rate: salaryValue, // Convert to number for database
        salary: formData.salary, // Keep original range as string for display
        salaryType: formData.salaryType, // Store whether it's monthly/daily
        type: formData.type,
        workingHours: {
          hours: parseInt(formData.workingHours) || 0,
          type: formData.workingHoursType,
        },
        // Add default values for required fields not in the form
        position: formData.title, // Use title as position if not specified
        starRating: 0, // Default rating for new jobs
        duration: formData.type === "Contract" ? "3 months" : "Ongoing", // Default based on job type
        experience: 0, // Default minimum experience
        skills: [], // Default empty skills array
        // Note: userId will be extracted from auth token on the server
      };

      // Send the job posting to the server
      const response = await api.post("/jobs", jobData);

      console.log("Job posted successfully:", response.data);
      setShowSuccess(true);

      // Optionally reset the form
      // setFormData({...initial form state...});
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job. Please try again.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h1 className="text-2xl font-semibold mb-8">Post a New Job</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex items-center gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                  {formData.logoPreview ? (
                    <img
                      src={formData.logoPreview}
                      alt={formData.companyName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-lg">
                    {formData.companyName}
                  </h3>
                  <p className="text-sm text-gray-500">Posting as employer</p>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Job Title<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, title: e.target.value }));
                    if (errors.title) {
                      setErrors((prev) => ({ ...prev, title: "" }));
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:border-black`}
                  placeholder="e.g. Senior React Developer"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-2">
                    Location<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }));
                        if (errors.location) {
                          setErrors((prev) => ({ ...prev, location: "" }));
                        }
                      }}
                      className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                        errors.location ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:border-black`}
                      placeholder="e.g. Bangalore, India"
                    />
                  </div>
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-2">
                    Job Type<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, type: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                  >
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Contract</option>
                    <option>Freelance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block font-medium">
                  Salary Range<span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.salary}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            salary: e.target.value,
                          }));
                          if (errors.salary) {
                            setErrors((prev) => ({ ...prev, salary: "" }));
                          }
                        }}
                        className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                          errors.salary ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:border-black`}
                        placeholder="e.g. 15,000 - 25,000"
                      />
                    </div>
                    {errors.salary && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.salary}
                      </p>
                    )}
                  </div>
                  <select
                    value={formData.salaryType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        salaryType: e.target.value,
                      }))
                    }
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                  >
                    <option value="monthly">per month</option>
                    <option value="daily">per day</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Working Hours<span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.workingHours}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            workingHours: e.target.value,
                          }));
                          if (errors.workingHours) {
                            setErrors((prev) => ({
                              ...prev,
                              workingHours: "",
                            }));
                          }
                        }}
                        className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                          errors.workingHours
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:outline-none focus:border-black`}
                        placeholder="e.g. 40"
                      />
                    </div>
                    {errors.workingHours && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.workingHours}
                      </p>
                    )}
                  </div>
                  <select
                    value={formData.workingHoursType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        workingHoursType: e.target.value,
                      }))
                    }
                    className="w-[140px] px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                  >
                    <option value="per week">per week</option>
                    <option value="per day">per day</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Job Description<span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }));
                    if (errors.description) {
                      setErrors((prev) => ({ ...prev, description: "" }));
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:border-black h-40 resize-none`}
                  placeholder="Describe the role and responsibilities..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 font-medium disabled:bg-gray-400 mt-8 transition-colors"
                disabled={
                  !formData.title.trim() ||
                  !formData.location.trim() ||
                  !formData.salary.trim() ||
                  !formData.workingHours.trim() ||
                  !formData.description.trim() ||
                  Object.keys(errors).length > 0
                }
              >
                Post Job
              </button>
            </form>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 animate-slide-up">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold">
                Job Posted Successfully! 🎉
              </h2>
              <button
                onClick={() => setShowSuccess(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                  {formData.logoPreview ? (
                    <img
                      src={formData.logoPreview}
                      alt={formData.companyName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {formData.title}
                      </h3>
                      <p className="text-gray-600">{formData.companyName}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">New</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {formData.location}
                    </span>
                    <span className="text-sm text-gray-600">
                      • ₹{formData.salary}{" "}
                      {formData.salaryType === "monthly"
                        ? "per month"
                        : "per day"}
                    </span>
                    <span className="text-sm text-gray-600">
                      • {formData.workingHours} hours{" "}
                      {formData.workingHoursType}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-gray-600">
              <p>
                Your job posting is now live and visible to potential
                candidates!
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowSuccess(false)}
                  className="px-8 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hire;
