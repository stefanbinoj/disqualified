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
      className="text-center"
    >
      <h2 className="text-2xl font-semibold mb-6">{t('chooseLanguage')}</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            className={`p-4 rounded-lg border-2 ${
              selectedLanguage === lang.code 
                ? 'border-black bg-black text-white' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleLanguageSelect(lang.code)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {lang.name}
          </motion.button>
        ))}
      </div>
      <button
        className="w-full py-3 bg-black text-white rounded-lg disabled:opacity-50"
        onClick={onNext}
        disabled={!selectedLanguage}
      >
        {t('continue')}
      </button>
    </motion.div>
  );
};

export default LanguageSelection; 