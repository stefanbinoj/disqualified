import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';

const languages = [
  { code: 'ml', name: 'മലയാളം' },
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ta', name: 'தமிழ்' }
];

const LanguageSelection = ({ selectedLanguage, onSelect, onNext }) => {
  const { t, setLanguage } = useLanguage();

  const handleLanguageSelect = (code) => {
    setLanguage(code);
    onSelect(code);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="step-title">{t('chooseLanguage')}</h2>
      <div className="language-grid">
        {languages.map((lang) => (
          <motion.div
            key={lang.code}
            className={`language-option ${selectedLanguage === lang.code ? 'selected' : ''}`}
            onClick={() => handleLanguageSelect(lang.code)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {lang.name}
          </motion.div>
        ))}
      </div>
      <button
        className="button button-primary"
        onClick={onNext}
        disabled={!selectedLanguage}
      >
        {t('continue')}
      </button>
    </motion.div>
  );
};

export default LanguageSelection; 