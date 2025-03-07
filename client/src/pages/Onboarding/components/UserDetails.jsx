import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';

const UserDetails = ({ formData, onUpdate, onNext, onBack }) => {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button className="back-button" onClick={onBack}>
        ← {t('back')}
      </button>
      <h2 className="step-title">{t('personalDetails')}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            className="input-field"
            placeholder={t('firstName')}
            value={formData.firstName}
            onChange={(e) => onUpdate({ firstName: e.target.value })}
          />
          {errors.firstName && <p className="error-message">{errors.firstName}</p>}
        </div>

        <div>
          <input
            type="text"
            className="input-field"
            placeholder={t('lastName')}
            value={formData.lastName}
            onChange={(e) => onUpdate({ lastName: e.target.value })}
          />
          {errors.lastName && <p className="error-message">{errors.lastName}</p>}
        </div>

        <div>
          <input
            type="tel"
            className="input-field"
            placeholder={t('phoneNumber')}
            value={formData.phoneNumber}
            onChange={(e) => onUpdate({ phoneNumber: e.target.value.replace(/\D/g, '') })}
            maxLength={10}
          />
          {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
        </div>

        <div>
          <input
            type="number"
            className="input-field"
            placeholder={t('age')}
            value={formData.age}
            onChange={(e) => onUpdate({ age: e.target.value })}
            min="18"
            max="100"
          />
          {errors.age && <p className="error-message">{errors.age}</p>}
        </div>

        <button type="submit" className="button button-primary">
          {t('continue')}
        </button>
      </form>
    </motion.div>
  );
};

export default UserDetails; 