import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import bgImage from '../../../assets/bg.jpg';

const OtpVerification = ({ onVerify, onBack, updateFormData, currentStep, totalSteps }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const DEFAULT_OTP = '1234';
  const { t } = useLanguage();

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 3) {
      const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    
    if (enteredOtp === DEFAULT_OTP) {
      updateFormData({ otp: enteredOtp });
      setError('');
      onVerify();
    } else {
      setError(t('invalidOtp'));
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
              
              <h2 className="text-2xl font-semibold mb-4">{t('enterOtp')}</h2>
              <p className="text-gray-500 mb-8">{t('otpMessage')}</p>

              <form onSubmit={handleSubmit}>
                <div className="flex gap-4 justify-center mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      name={`otp-${index}`}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-2xl border-2 rounded-xl focus:border-black outline-none"
                    />
                  ))}
                </div>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <button
                  type="submit"
                  className="w-full py-4 bg-black text-white rounded-xl disabled:opacity-50 font-medium text-lg mb-4"
                  disabled={otp.some(digit => digit === '')}
                >
                  {t('verify')}
                </button>

                <p className="text-center text-gray-500 text-sm">
                  {t('didntReceive')}{' '}
                  <button 
                    type="button"
                    className="text-black underline"
                    onClick={() => setError(t('defaultOtpMessage'))}
                  >
                    {t('resend')}
                  </button>
                </p>
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

export default OtpVerification; 