import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LanguageSelection from './components/LanguageSelection';
import UserDetails from './components/UserDetails';
import OtpVerification from './components/OtpVerification';
import UserType from './components/UserType';
import './Onboarding.css';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    language: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    age: '',
    otp: '',
    userType: ''
  });

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <LanguageSelection
            selectedLanguage={formData.language}
            onSelect={(lang) => updateFormData({ language: lang })}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <UserDetails
            formData={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <OtpVerification
            onVerify={() => handleNext()}
            onBack={handleBack}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <UserType
            selectedType={formData.userType}
            onSelect={(type) => updateFormData({ userType: type })}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="onboarding-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="onboarding-card"
      >
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
        {renderStep()}
      </motion.div>
    </div>
  );
};

export default Onboarding; 