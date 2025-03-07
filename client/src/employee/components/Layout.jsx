import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-14 pb-16">
        {children}
      </main>
    </div>
  );
};

export default Layout;