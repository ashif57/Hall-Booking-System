
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-primary-deep-navy text-background-ivory-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
           <span>
            <img
              src="/orig.png"
              className="h-14 w-auto"
            />
          </span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-accent-champagne">&copy; {new Date().getFullYear()} HalliFy. All rights reserved.</p>
            <p className="text-sm text-accent-champagne">Simplifying reservations for everyone.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
