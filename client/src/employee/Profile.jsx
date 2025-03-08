import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { Mail, Phone, MapPin, Pencil } from "lucide-react";
import bg from "../assets/bg.png";
import api from "../axiosWithHeaders";

const Profile = () => {
  // State for profile data
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "Kochi, Kerala",
    about: "",
    image: bg,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/users/");
        const { user } = response.data;

        setProfileData((prevState) => {
          // Create new state object
          const newState = { ...prevState };

          // Update name only if both firstName and lastName exist
          if (user.firstName && user.lastName) {
            newState.name = `${user.firstName} ${user.lastName}`;
          }

          // Update other fields only if they exist in response
          const fieldsToUpdate = ["phone", "email", "location", "about"];
          fieldsToUpdate.forEach((field) => {
            if (user[field]) {
              newState[field] = user[field];
            }
          });

          return newState;
        });
      } catch (error) {
        console.error(
          "Error fetching profile:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchUserProfile();
  }, []);

  // State for edit modes
  const [editMode, setEditMode] = useState({
    basic: false,
    about: false,
    contact: false,
  });

  // State for temporary edit values
  const [editValues, setEditValues] = useState({ ...profileData });

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
      };
      reader.readAsDataURL(file);
    }
  };

  // Add error and loading states
  const [isLoading, setIsLoading] = useState({
    basic: false,
    contact: false,
    about: false,
  });

  const [error, setError] = useState({
    basic: null,
    contact: null,
    about: null,
  });

  // Modified handleSave function
  const handleSave = async (section) => {
    try {
      setIsLoading((prev) => ({ ...prev, [section]: true }));
      setError((prev) => ({ ...prev, [section]: null }));

      let updateData = {};

      // Prepare update data based on section
      switch (section) {
        case "basic":
          // Split name into firstName and lastName
          const [firstName = "", lastName = ""] = editValues.name.split(" ");
          updateData = {
            firstName,
            lastName,
          };
          break;

        case "contact":
          updateData = {
            email: editValues.email,
            phone: editValues.phone,
            location: editValues.location,
          };
          break;

        case "about":
          updateData = {
            about: editValues.about,
          };
          break;

        default:
          break;
      }

      // Send update request to backend
      const response = await api.patch("/users/profile", updateData);

      if (response.data.success) {
        // Update local state
        setProfileData((prev) => ({
          ...prev,
          ...editValues,
        }));

        // Close edit mode
        setEditMode((prev) => ({
          ...prev,
          [section]: false,
        }));

        console.log("Profile updated successfully");
      }
    } catch (error) {
      // Handle errors
      setError((prev) => ({
        ...prev,
        [section]: error.response?.data?.message || "Failed to update profile",
      }));
      console.error(
        "Error updating profile:",
        error.response?.data?.message || error.message
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, [section]: false }));
    }
  };

  // Update the save buttons in your JSX to show loading state and errors
  const SaveButton = ({ section, onClick }) => (
    <button
      onClick={onClick}
      disabled={isLoading[section]}
      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
    >
      {isLoading[section] ? "Saving..." : "Save"}
    </button>
  );

  // Add error display
  const ErrorMessage = ({ section }) =>
    error[section] && (
      <div className="text-red-500 text-sm mt-2 text-center">
        {error[section]}
      </div>
    );

  // Cancel editing for any section
  const handleCancel = (section) => {
    setEditValues({ ...profileData });
    setEditMode((prev) => ({
      ...prev,
      [section]: false,
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="pt-20 px-6 pb-8 flex justify-center">
        <div className="max-w-2xl w-full">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
            {/* Basic Info */}
            <div className="flex flex-col items-center text-center mb-12">
              <div className="relative mb-6">
                <img
                  src={profileData.image}
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md"
                />
                <label className="absolute bottom-0 right-0 p-2 bg-black rounded-full text-white hover:bg-gray-800 cursor-pointer shadow-md transition-colors">
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
                <div className="space-y-4 w-full max-w-sm">
                  <input
                    type="text"
                    value={editValues.name}
                    onChange={(e) =>
                      setEditValues((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full text-center text-xl font-semibold px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Your Name"
                  />
                  <div className="flex gap-3 justify-center mt-4">
                    <SaveButton
                      section="basic"
                      onClick={() => handleSave("basic")}
                    />
                    <button
                      onClick={() => handleCancel("basic")}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  <ErrorMessage section="basic" />
                </div>
              ) : (
                <div className="relative inline-block">
                  <h1 className="text-2xl font-semibold px-8">
                    {profileData.name || "Add your name"}
                  </h1>
                  <button
                    onClick={() =>
                      setEditMode((prev) => ({ ...prev, basic: true }))
                    }
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Edit name"
                  >
                    <Pencil className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Contact Information</h2>
                {!editMode.contact && (
                  <button
                    onClick={() =>
                      setEditMode((prev) => ({ ...prev, contact: true }))
                    }
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Edit contact information"
                  >
                    <Pencil className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>

              {editMode.contact ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-600 min-w-5" />
                    <input
                      type="email"
                      value={editValues.email}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-black px-2 py-1"
                      placeholder="Email address"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-600 min-w-5" />
                    <input
                      type="tel"
                      value={editValues.phone}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-black px-2 py-1"
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-600 min-w-5" />
                    <input
                      type="text"
                      value={editValues.location}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-black px-2 py-1"
                      placeholder="Your location"
                    />
                  </div>
                  <div className="flex gap-3 justify-end mt-4">
                    <SaveButton
                      section="contact"
                      onClick={() => handleSave("contact")}
                    />
                    <button
                      onClick={() => handleCancel("contact")}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  <ErrorMessage section="contact" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg transition-colors hover:bg-gray-100">
                    <Mail className="w-5 h-5 text-gray-600 min-w-5" />
                    <span className="text-gray-700">
                      {profileData.email || "Add your email"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg transition-colors hover:bg-gray-100">
                    <Phone className="w-5 h-5 text-gray-600 min-w-5" />
                    <span className="text-gray-700">
                      {profileData.phone || "Add your phone number"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg transition-colors hover:bg-gray-100">
                    <MapPin className="w-5 h-5 text-gray-600 min-w-5" />
                    <span className="text-gray-700">
                      {profileData.location || "Add your location"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* About */}
            <div className="mt-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">About</h2>
                {!editMode.about && (
                  <button
                    onClick={() =>
                      setEditMode((prev) => ({ ...prev, about: true }))
                    }
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Edit about"
                  >
                    <Pencil className="w-4 h-4 text-gray-600" />
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
                    placeholder="Tell us about yourself..."
                    className="w-full p-4 border rounded-lg h-40 resize-none focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <div className="flex gap-3 justify-end mt-4">
                    <SaveButton
                      section="about"
                      onClick={() => handleSave("about")}
                    />
                    <button
                      onClick={() => handleCancel("about")}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  <ErrorMessage section="about" />
                </div>
              ) : (
                <p className="text-gray-600 leading-relaxed p-4 bg-gray-50 rounded-lg transition-colors hover:bg-gray-100">
                  {profileData.about || "Add a description about yourself"}
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
