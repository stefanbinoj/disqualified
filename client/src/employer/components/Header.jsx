import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const Header = () => {
  const { t } = useLanguage();

  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-50 px-4 py-3 flex items-center justify-between border-b">
      <h1 className="text-lg font-semibold">Employer Portal</h1>
    </div>
  );
};

export default Header; 