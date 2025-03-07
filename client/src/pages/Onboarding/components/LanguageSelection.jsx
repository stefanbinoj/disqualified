import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import bgImage from '../../../assets/bg.jpg'; // Changed from bg.png to bg.jpg

const languages = [
  { code: 'ml', name: 'മലയാളം' },
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ta', name: 'தமிழ்' }
];

const LanguageSelection = ({ selectedLanguage, onSelect, onNext, currentStep, totalSteps }) => {
  const { t, setLanguage } = useLanguage();

  const handleLanguageSelect = (code) => {
    setLanguage(code);
    onSelect(code);
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
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex-1 flex flex-col justify-end"
        >
          {/* White Card */}
          <div className="bg-white rounded-t-[32px] p-8 shadow-lg w-full max-w-none">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-8">{t('chooseLanguage')}</h2>
              <div className="grid grid-cols-2 gap-6 mb-8">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    className={`p-5 rounded-xl border-2 ${
                      selectedLanguage === lang.code 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleLanguageSelect(lang.code)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-lg">{lang.name}</span>
                  </motion.button>
                ))}
              </div>

              <button
                className="w-full py-4 bg-black text-white rounded-xl disabled:opacity-50 font-medium text-lg"
                onClick={onNext}
                disabled={!selectedLanguage}
              >
                {t('continue')}
              </button>
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
        </motion.div>
      </div>
    </div>
  );
};

export default LanguageSelection;