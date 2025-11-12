
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-[#f7fbbf] shadow-md">
      <div className="container flex items-center justify-between px-6 py-2 mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <span>
            <img
              src="/orig.png"
              alt="Logo"
              className="h-12 w-auto"
            />
          </span>
         
        </Link>
        <nav className="flex items-center space-x-8">


          <NavLink
            to="/history-login" 
            className="px-4 py-2 text-sm font-semibold text-text-charcoal transition duration-300 bg-accent-champagne rounded-md hover:bg-secondary-royal-gold hover:text-white"
          >
            User Login
          </NavLink>

          <NavLink
            to="/admin/login" 
            className="px-4 py-2 text-sm font-semibold text-text-charcoal transition duration-300 bg-accent-champagne rounded-md hover:bg-secondary-royal-gold hover:text-white"
          >
            Admin Login
          </NavLink>

          
        </nav>
      </div>
    </header>
  );
};

export default Header;
