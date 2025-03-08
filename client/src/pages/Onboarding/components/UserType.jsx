import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../contexts/LanguageContext";
import bgImage from '../../../assets/bg.jpg';
import axios from "axios";

const UserType = ({ selectedType, onSelect, onBack, formData, currentStep, totalSteps }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const userTypes = [
    {
      id: "job_seeker",
      title: t("jobSeeker.title"),
      description: t("jobSeeker.description"),
    },
    {
      id: "employer",
      title: t("employer.title"),
      description: t("employer.description"),
    },
  ];

  const handleGetStarted = async () => {
    if (selectedType) {
      if (selectedType === "employer") {
        navigate("/employer-onboarding",{state:{formDataUser:formData}});
      } else if (selectedType === "job_seeker") {
        try {
          const response = await axios.post(
            "http://localhost:4002/api/users/",
            {
              ...formData,
              role: "employee",
              phone: formData.phoneNumber,
            }
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
        navigate("/user/home");
      }
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
              <motion.button 
                className="text-black mb-6 flex items-center"
                onClick={onBack}
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                ← {t('back')}
              </motion.button>

              <h2 className="text-2xl font-semibold mb-8">{t('whatBringsYou')}</h2>

              <div className="space-y-4 mb-8">
                {userTypes.map((type) => (
                  <motion.div
                    key={type.id}
                    className={`p-6 rounded-xl border-2 cursor-pointer ${
                      selectedType === type.id 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => onSelect(type.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h3 className="text-xl font-medium mb-2">{type.title}</h3>
                    <p className={selectedType === type.id ? 'text-gray-200' : 'text-gray-500'}>
                      {type.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="w-full py-4 bg-black text-white rounded-xl disabled:opacity-50 font-medium text-lg"
                onClick={handleGetStarted}
                disabled={!selectedType}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('getStarted')}
              </motion.button>
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

export default UserType;
