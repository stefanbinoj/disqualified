import React from 'react';
import Header from './components/Header';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add any logout logic here (clearing tokens, state, etc.)
    navigate('/');
  };

  const settingsOptions = [
    {
      title: 'App Settings',
      items: [
        { label: 'Language', link: '/settings/language' },
        { label: 'Notifications', link: '/settings/notifications' },
        { label: 'Dark Mode', link: '/settings/appearance' },
      ]
    },
    {
      title: 'Support',
      items: [
        { label: 'Help Center', link: '/help' },
        { label: 'Contact Us', link: '/contact' },
        { label: 'Terms & Conditions', link: '/terms' },
        { label: 'Privacy Policy', link: '/privacy' },
      ]
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Custom Header with Back Button */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 px-4 py-3 flex items-center border-b">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold ml-2">Settings</h1>
      </div>
      
      <div className="pt-14 px-4 pb-4">
        <div className="space-y-6">
          {settingsOptions.map((section, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-medium mb-2">{section.title}</h2>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => {
                      // Handle navigation or action
                      console.log(`Clicked: ${item.label}`);
                    }}
                  >
                    <span className="text-gray-700">{item.label}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button 
          className="w-full mt-6 p-4 text-red-600 bg-white rounded-xl shadow-sm font-medium"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Settings; 