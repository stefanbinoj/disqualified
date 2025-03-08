import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import bgImage from '../../assets/bg.jpg';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const EmployerOnboarding = () => {
  const location = useLocation();
  const { formDataUser } = location.state || {}; // Access formData from state

  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    location: '',
    industry: '' 
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Company description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      if (validateForm()) {
        try {
          const response = await axios.post(
            "http://localhost:4002/api/users/",
            { ...formDataUser, role: "employer", phone: formDataUser.phoneNumber, ...formData ,companyDiscription:formData.description,companyLocation:formData.location,industry:formData.industry}
          );
          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
          }
        } catch (error) {
          console.error(
            "Error:",
            error.response ? error.response.data : error.message
          );
        }
        navigate('/employer/hire');
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              Welcome to Your Hiring Journey
            </h2>
            
            <p className="text-gray-600 mb-8">
              We're excited to help you find the perfect candidates for your company. 
              Let's start by setting up your employer profile to attract the best talent.
            </p>

            <motion.button
              className="w-full py-4 bg-black text-white rounded-xl font-medium text-lg"
              onClick={handleContinue}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
          </>
        );

      case 2:
        return (
          <>
            <motion.button 
              className="text-black mb-6 flex items-center"
              onClick={handleBack}
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back
            </motion.button>

            <h2 className="text-2xl font-semibold mb-6">
              Tell us about your company
            </h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={`w-full p-4 border-2 rounded-xl focus:border-black outline-none ${
                    errors.companyName ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your company name"
                  required
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className={`w-full p-4 border-2 rounded-xl focus:border-black outline-none ${
                    errors.industry ? 'border-red-500' : ''
                  }`}
                  placeholder="e.g., Technology, Healthcare, etc."
                  required
                />
                {errors.industry && (
                  <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full p-4 border-2 rounded-xl focus:border-black outline-none ${
                    errors.location ? 'border-red-500' : ''
                  }`}
                  placeholder="Company location"
                  required
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full p-4 border-2 rounded-xl focus:border-black outline-none resize-none ${
                    errors.description ? 'border-red-500' : ''
                  }`}
                  placeholder="Tell potential candidates about your company..."
                  required
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <motion.button
                type="button"
                className="w-full py-4 bg-black text-white rounded-xl font-medium text-lg mt-6"
                onClick={handleContinue}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue
              </motion.button>
            </form>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`,
          filter: 'brightness(0.9)'
        }}
      />

      {/* Content Container */}
      <div className="relative h-full flex flex-col">
        <div className="flex-1 flex flex-col justify-end">
          {/* White Card */}
          <div className="bg-white rounded-t-[32px] p-8 shadow-lg w-full max-w-none">
            <div className="max-w-2xl mx-auto">
              {renderStep()}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-[100]">
            <div className="h-2 bg-gray-200">
              <motion.div 
                className="h-full bg-black"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${(currentStep / totalSteps) * 100}%`,
                }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerOnboarding;
