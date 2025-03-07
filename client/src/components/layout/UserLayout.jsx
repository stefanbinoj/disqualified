 
 import React from 'react';
 import Header from './Header'; 
 const UserLayout = ({ children }) => {
   return (
     <div className="min-h-screen bg-gray-50">
       <Header />
       <main className="pt-14 pb-16"> {/* pt-14 for header, pb-16 for bottom navigation */}
         {children}
       </main>
     </div>
   );
 }; 
export default UserLayout; 