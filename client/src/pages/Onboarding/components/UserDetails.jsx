import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import bgImage from '../../../assets/bg.jpg';

const UserDetails = ({ formData, onUpdate, onNext, onBack, currentStep, totalSteps }) => {
  const [errors, setErrors] = useState({});
  const { t } = useLanguage();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('firstNameRequired');
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('lastNameRequired');
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t('phoneRequired');
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = t('phoneInvalid');
    }
    
    if (!formData.age.trim()) {
      newErrors.age = t('ageRequired');
    } else if (isNaN(formData.age) || parseInt(formData.age) < 18 || parseInt(formData.age) > 100) {
      newErrors.age = t('ageInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
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
              <button 
                className="text-black mb-6 flex items-center"
                onClick={onBack}
              >
                ← {t('back')}
              </button>

              <h2 className="text-2xl font-semibold mb-8">{t('personalDetails')}</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    className="w-full p-4 border-2 rounded-xl focus:border-black outline-none"
                    placeholder={t('firstName')}
                    value={formData.firstName}
                    onChange={(e) => onUpdate({ firstName: e.target.value })}
                  />
                  {errors.firstName && <p className="text-red-500 mt-1 text-sm">{errors.firstName}</p>}
                </div>

                <div>
                  <input
                    type="text"
                    className="w-full p-4 border-2 rounded-xl focus:border-black outline-none"
                    placeholder={t('lastName')}
                    value={formData.lastName}
                    onChange={(e) => onUpdate({ lastName: e.target.value })}
                  />
                  {errors.lastName && <p className="text-red-500 mt-1 text-sm">{errors.lastName}</p>}
                </div>

                <div>
                  <input
                    type="tel"
                    className="w-full p-4 border-2 rounded-xl focus:border-black outline-none"
                    placeholder={t('phoneNumber')}
                    value={formData.phoneNumber}
                    onChange={(e) => onUpdate({ phoneNumber: e.target.value.replace(/\D/g, '') })}
                    maxLength={10}
                  />
                  {errors.phoneNumber && <p className="text-red-500 mt-1 text-sm">{errors.phoneNumber}</p>}
                </div>

                <div>
                  <input
                    type="number"
                    className="w-full p-4 border-2 rounded-xl focus:border-black outline-none"
                    placeholder={t('age')}
                    value={formData.age}
                    onChange={(e) => onUpdate({ age: e.target.value })}
                    min="18"
                    max="100"
                  />
                  {errors.age && <p className="text-red-500 mt-1 text-sm">{errors.age}</p>}
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 bg-black text-white rounded-xl font-medium text-lg mt-8"
                >
                  {t('continue')}
                </button>
              </form>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white z-50">
            <div className="bg-gray-100 h-1.5">
              <div 
                className="bg-black h-1.5 transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails; 