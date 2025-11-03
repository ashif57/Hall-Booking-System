
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
           <span>
            <img
              src="/whitelogo.svg"
            />
          </span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} VDart Inc. All rights reserved.</p>
            <p className="text-sm text-gray-500">Simplifying reservations for everyone.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
