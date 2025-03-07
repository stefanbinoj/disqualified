import React, { useState } from 'react';
import { XMarkIcon } from 'lucide-react';
import Modal from './Modal';

const FilterModal = ({ isOpen, onClose }) => {
  const [paymentFilter, setPaymentFilter] = useState({
    type: null,
    min: 0,
    max: 0
  });
  const [selectedLocation, setSelectedLocation] = useState('');

  const cities = [
    "Ahmedabad",
    "Bangalore",
    "Chennai",
    "Coimbatore",
    "Delhi",
    "Ernakulam",
    "Hyderabad",
    "Indore",
    "Jaipur",
    "Kochi",
    "Kolkata",
    "Lucknow",
    "Mumbai",
    "Mysore",
    "Nagpur",
    "Pune",
    "Surat",
    "Thiruvananthapuram",
    "Thrissur",
    "Visakhapatnam"
  ];

  const handlePaymentFilterChange = (type, min, max) => {
    setPaymentFilter({
      type,
      min,
      max
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-w-md w-full bg-white rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Filter Jobs</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Payment Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Payment Type</label>
            <div className="flex gap-4">
              <button
                className={`px-4 py-2 rounded-lg ${
                  paymentFilter.type === 'wage'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => handlePaymentFilterChange('wage', 300, 1200)}
              >
                Daily Wage
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  paymentFilter.type === 'salary'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => handlePaymentFilterChange('salary', 8000, 40000)}
              >
                Monthly Salary
              </button>
            </div>
          </div>

          {/* Salary Range */}
          {paymentFilter.type === 'salary' && (
            <div>
              <label className="block text-sm font-medium mb-2">Monthly Salary Range</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Min Salary (₹)</label>
                  <input
                    type="range"
                    min="8000"
                    max="40000"
                    step="1000"
                    value={paymentFilter.min}
                    onChange={(e) => handlePaymentFilterChange('salary', Number(e.target.value), paymentFilter.max)}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">₹{paymentFilter.min}</span>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Max Salary (₹)</label>
                  <input
                    type="range"
                    min="8000"
                    max="40000"
                    step="1000"
                    value={paymentFilter.max}
                    onChange={(e) => handlePaymentFilterChange('salary', paymentFilter.min, Number(e.target.value))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">₹{paymentFilter.max}</span>
                </div>
              </div>
            </div>
          )}

          {/* Daily Wage Range */}
          {paymentFilter.type === 'wage' && (
            <div>
              <label className="block text-sm font-medium mb-2">Daily Wage Range</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Min Wage (₹)</label>
                  <input
                    type="range"
                    min="300"
                    max="1200"
                    step="50"
                    value={paymentFilter.min}
                    onChange={(e) => handlePaymentFilterChange('wage', Number(e.target.value), paymentFilter.max)}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">₹{paymentFilter.min}</span>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Max Wage (₹)</label>
                  <input
                    type="range"
                    min="300"
                    max="1200"
                    step="50"
                    value={paymentFilter.max}
                    onChange={(e) => handlePaymentFilterChange('wage', paymentFilter.min, Number(e.target.value))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">₹{paymentFilter.max}</span>
                </div>
              </div>
            </div>
          )}

          {/* Location Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setPaymentFilter({ type: null, min: 0, max: 0 });
                setSelectedLocation('');
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={() => {
                const filters = {
                  payment: paymentFilter,
                  location: selectedLocation,
                };
                console.log('Applied filters:', filters);
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal; 