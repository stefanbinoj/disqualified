import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    position: "",
    location: "",
    duration: "",
    rate: "",
    salary: "",
    experience: "",
    skills: "",
    type: "Full Time",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting job with company:", formData.company);

      const jobData = {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        position: formData.position,
        location: formData.location,
        duration: formData.duration,
        rate: Number(formData.rate),
        salary: formData.salary,
        experience: formData.experience,
        skills: formData.skills.split(",").map((skill) => skill.trim()),
        type: formData.type,
      };

      const response = await api.post("/jobs", jobData);

      if (response.data.success) {
        // Handle success (redirect, show message, etc.)
        navigate("/employer/dashboard");
      }
    } catch (error) {
      console.error("Error creating job:", error);
      // Handle error
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      {/* Render your form here */}
      <div className="mb-4">
        <label htmlFor="company" className="block text-gray-700 mb-2">
          Company Name
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter your company name"
        />
      </div>
    </div>
  );
};

export default PostJob;
