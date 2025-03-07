import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../contexts/LanguageContext";
import axios from "axios";
const UserType = ({ selectedType, onSelect, onBack, formData }) => {
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
        try {
          const response = await axios.post(
            "http://localhost:4002/api/users/",
            { ...formData, role: "employer", phone: formData.phoneNumber }
          );
          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            // navigate("/employer/hire");
          }
        } catch (error) {
          console.error(
            "Error:",
            error.response ? error.response.data : error.message
          );
        }
        navigate("/employer/hire");
      } else if (selectedType === "job_seeker") {
        console.log(1);
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
            navigate("/employer/hire");
          }
        } catch (error) {
          console.error(
            "Error:",
            error.response ? error.response.data : error.message
          );
        }
        //navigate("/user/home");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button className="back-button" onClick={onBack}>
        ← {t("back")}
      </button>
      <h2 className="step-title">{t("whatBringsYou")}</h2>

      <div className="user-type-container">
        {userTypes.map((type) => (
          <motion.div
            key={type.id}
            className={`user-type-option ${
              selectedType === type.id ? "selected" : ""
            }`}
            onClick={() => onSelect(type.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              {type.title}
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                color:
                  selectedType === type.id
                    ? "var(--gray-200)"
                    : "var(--gray-500)",
              }}
            >
              {type.description}
            </p>
          </motion.div>
        ))}
      </div>

      <button
        className="button button-primary"
        onClick={handleGetStarted}
        disabled={!selectedType}
      >
        {t("getStarted")}
      </button>
    </motion.div>
  );
};

export default UserType;
