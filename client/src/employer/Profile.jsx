import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import {
  Mail,
  Phone,
  MapPin,
  Pencil,
  Building,
  Globe,
  Users,
  Clock,
} from "lucide-react";
import bg from "../assets/bg.png";
import api from "../axiosWithHeaders";

const Profile = () => {
  // State for profile data
  const [profileData, setProfileData] = useState({
    name: "",
    companyName: "",
    businessType: "",
    email: "",
    phone: "",
    location: "Kochi, Kerala",
    website: "",
    employeeCount: "",
    workingHours: "",
    about: "",
    image: bg,
  });

  // Add loading state for initial data fetch
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialError, setInitialError] = useState(null);

  useEffect(() => {
    const fetchEmployerProfile = async () => {
      try {
        setInitialLoading(true);
        setInitialError(null);
        console.log("Fetching employer profile data...");

        const response = await api.get("/users/");
        console.log("Profile data received:", response.data);

        const { user } = response.data;

        setProfileData((prevState) => {
          const newState = { ...prevState };
          if (user.firstName && user.lastName) {
            newState.name = `${user.firstName} ${user.lastName}`;
          }

          const fieldsToUpdate = [
            "phone",
            "companyName",
            "businessType",
            "email",
            "location",
            "website",
            "employeeCount",
            "workingHours",
            "about",
          ];
          fieldsToUpdate.forEach((field) => {
            if (user[field] !== undefined) {
              newState[field] = user[field];
            }
          });

          return newState;
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setInitialError(
          error.response?.data?.message || "Failed to load profile data"
        );
      } finally {
        setInitialLoading(false);
      }
    };

    fetchEmployerProfile();
  }, []);

  // State for edit modes
  const [editMode, setEditMode] = useState({
    basic: false,
    about: false,
    contact: false,
    company: false,
  });

  // State for temporary edit values
  const [editValues, setEditValues] = useState({});

  // Update editValues when profileData changes
  useEffect(() => {
    setEditValues({ ...profileData });
  }, [profileData]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({
          ...prev,
          image: reader.result,
        }));

        // In a real app, you would upload the image to a server here
        // For now, just update the local state
      };
      reader.readAsDataURL(file);
    }
  };

  const [isLoading, setIsLoading] = useState({
    basic: false,
    contact: false,
    about: false,
    company: false,
  });

  const [error, setError] = useState({
    basic: null,
    contact: null,
    about: null,
    company: null,
  });

  const handleSave = async (section) => {
    try {
      setIsLoading((prev) => ({ ...prev, [section]: true }));
      setError((prev) => ({ ...prev, [section]: null }));

      let updateData = {};

      switch (section) {
        case "basic":
          const [firstName = "", lastName = ""] = editValues.name.split(" ");
          updateData = {
            firstName,
            lastName,
            companyName: editValues.companyName,
            businessType: editValues.businessType,
          };
          console.log("Updating basic info:", updateData);
          break;

        case "contact":
          updateData = {
            email: editValues.email,
            phone: editValues.phone,
            location: editValues.location,
            website: editValues.website,
          };
          console.log("Updating contact info:", updateData);
          break;

        case "company":
          updateData = {
            employeeCount: editValues.employeeCount,
            workingHours: editValues.workingHours,
          };
          console.log("Updating company info:", updateData);
          break;

        case "about":
          updateData = {
            about: editValues.about,
          };
          console.log("Updating about info:", updateData);
          break;

        default:
          break;
      }

      // Remove undefined values
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      console.log(
        `Making PATCH request to /users/profile with data:`,
        updateData
      );
      const response = await api.patch("/users/profile", updateData);
      console.log("Profile update response:", response.data);

      if (response.data.success) {
        // Update profileData with the new values
        setProfileData((prev) => ({
          ...prev,
          ...editValues,
        }));

        // Close edit mode
        setEditMode((prev) => ({
          ...prev,
          [section]: false,
        }));

        // Show success feedback (could use a toast or alert)
        console.log(`${section} information updated successfully`);
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError((prev) => ({
        ...prev,
        [section]: error.response?.data?.message || "Failed to update profile",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, [section]: false }));
    }
  };

  const SaveButton = ({ section, onClick }) => (
    <button
      onClick={onClick}
      disabled={isLoading[section]}
      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
    >
      {isLoading[section] ? "Saving..." : "Save"}
    </button>
  );

  const ErrorMessage = ({ section }) =>
    error[section] && (
      <div className="text-red-500 text-sm mt-2">{error[section]}</div>
    );

  const handleCancel = (section) => {
    setEditValues({ ...profileData });
    setEditMode((prev) => ({
      ...prev,
      [section]: false,
    }));
  };

  if (initialLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center pt-14">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (initialError) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center pt-14">
          <div className="text-red-500 bg-white p-6 rounded-lg shadow-sm max-w-md">
            <h2 className="text-xl font-semibold mb-2">
              Error Loading Profile
            </h2>
            <p>{initialError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="h-[calc(100vh-3.5rem)] overflow-y-auto pt-14 px-4 pb-4">
        <div className="max-w-2xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            {/* Basic Info */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative mb-4">
                <img
                  src={profileData.image}
                  alt="Company Logo"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
                <label className="absolute bottom-0 right-0 p-2 bg-black rounded-full text-white hover:bg-gray-800 cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <Pencil className="w-4 h-4" />
                </label>
              </div>

              {editMode.basic ? (
                <div className="space-y-3 w-full max-w-sm">
                  <input
                    type="text"
                    value={editValues.name}
                    onChange={(e) =>
                      setEditValues((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Your Name"
                    className="w-full text-center text-xl font-semibold px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    value={editValues.companyName}
                    onChange={(e) =>
                      setEditValues((prev) => ({
                        ...prev,
                        companyName: e.target.value,
                      }))
                    }
                    placeholder="Company Name"
                    className="w-full text-center px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    value={editValues.businessType}
                    onChange={(e) =>
                      setEditValues((prev) => ({
                        ...prev,
                        businessType: e.target.value,
                      }))
                    }
                    placeholder="Business Type"
                    className="w-full text-center text-sm px-3 py-2 border rounded-lg"
                  />
                  <div className="flex gap-2 justify-center mt-4">
                    <SaveButton
                      section="basic"
                      onClick={() => handleSave("basic")}
                    />
                    <button
                      onClick={() => handleCancel("basic")}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                  <ErrorMessage section="basic" />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex items-center mb-1">
                    <h1 className="text-2xl font-semibold">
                      {profileData.name}
                    </h1>
                    <button
                      onClick={() =>
                        setEditMode((prev) => ({ ...prev, basic: true }))
                      }
                      className="ml-2 p-1.5 hover:bg-gray-100 rounded-full"
                      aria-label="Edit basic information"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-gray-600">
                    {profileData.companyName || "Add Company Name"}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {profileData.businessType || "Add Business Type"}
                  </p>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              {editMode.contact ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <input
                      type="email"
                      value={editValues.email}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-black"
                      placeholder="Email Address"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <input
                      type="tel"
                      value={editValues.phone}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-black"
                      placeholder="Phone Number"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <input
                      type="text"
                      value={editValues.location}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-black"
                      placeholder="Location"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                    <Globe className="w-5 h-5 text-gray-600" />
                    <input
                      type="text"
                      value={editValues.website}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                      placeholder="Company Website"
                      className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="flex gap-2 justify-end mt-4">
                    <SaveButton
                      section="contact"
                      onClick={() => handleSave("contact")}
                    />
                    <button
                      onClick={() => handleCancel("contact")}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                  <ErrorMessage section="contact" />
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() =>
                      setEditMode((prev) => ({ ...prev, contact: true }))
                    }
                    className="absolute right-2 top-2 p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">
                        {profileData.email || "Add email address"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">
                        {profileData.phone || "Add phone number"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">
                        {profileData.location || "Add location"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                      <Globe className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">
                        {profileData.website || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Company Details */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Company Details</h2>
                {!editMode.company && (
                  <button
                    onClick={() =>
                      setEditMode((prev) => ({ ...prev, company: true }))
                    }
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </div>
              {editMode.company ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                    <Users className="w-5 h-5 text-gray-600" />
                    <input
                      type="text"
                      value={editValues.employeeCount}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          employeeCount: e.target.value,
                        }))
                      }
                      placeholder="Number of Employees"
                      className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <input
                      type="text"
                      value={editValues.workingHours}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          workingHours: e.target.value,
                        }))
                      }
                      placeholder="Working Hours"
                      className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="flex gap-2 justify-end mt-4">
                    <SaveButton
                      section="company"
                      onClick={() => handleSave("company")}
                    />
                    <button
                      onClick={() => handleCancel("company")}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                  <ErrorMessage section="company" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                    <Users className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">
                      {profileData.employeeCount || "Not specified"} employees
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">
                      {profileData.workingHours || "Not specified"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* About */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">About Company</h2>
                {!editMode.about && (
                  <button
                    onClick={() =>
                      setEditMode((prev) => ({ ...prev, about: true }))
                    }
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </div>
              {editMode.about ? (
                <div>
                  <textarea
                    value={editValues.about}
                    onChange={(e) =>
                      setEditValues((prev) => ({
                        ...prev,
                        about: e.target.value,
                      }))
                    }
                    placeholder="Tell us about your company..."
                    className="w-full p-3 border rounded-lg h-32 resize-none"
                  />
                  <div className="flex gap-2 justify-end mt-4">
                    <SaveButton
                      section="about"
                      onClick={() => handleSave("about")}
                    />
                    <button
                      onClick={() => handleCancel("about")}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                  <ErrorMessage section="about" />
                </div>
              ) : (
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {profileData.about ||
                    "No company description available. Add one to tell potential employees about your company."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
