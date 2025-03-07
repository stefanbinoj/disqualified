import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';

const OtpVerification = ({ onVerify, onBack, updateFormData }) => {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button className="back-button" onClick={onBack}>
        ← {t('back')}
      </button>
      <h2 className="step-title">{t('enterOtp')}</h2>
      <p style={{ marginBottom: '1.5rem', color: 'var(--gray-500)' }}>
        {t('otpMessage')}
      </p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              name={`otp-${index}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="input-field"
              style={{
                width: '3rem',
                height: '3rem',
                textAlign: 'center',
                fontSize: '1.5rem',
                padding: '0.5rem'
              }}
            />
          ))}
        </div>

        {error && <p className="error-message">{error}</p>}

        <button
          type="submit"
          className="button button-primary"
          disabled={otp.some(digit => digit === '')}
        >
          {t('verify')}
        </button>
      </form>

      <p style={{ 
        marginTop: '1rem', 
        fontSize: '0.875rem', 
        color: 'var(--gray-500)',
        textAlign: 'center'
      }}>
        {t('didntReceive')} <button 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--primary-black)',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
          onClick={() => setError(t('defaultOtpMessage'))}
        >
          {t('resend')}
        </button>
      </p>
    </motion.div>
  );
};

export default OtpVerification; 