
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container flex items-center justify-between px-6 py-4 mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <span>
            <img
              src="/logo.svg"
              alt="VDart Logo"
            />
          </span>
         
        </Link>
        <nav className="flex items-center space-x-8">


          <NavLink
            to="/history-login" 
            className="px-4 py-2 text-sm font-semibold text-gray-700 transition duration-300 bg-gray-100 rounded-md hover:bg-blue-600 hover:text-white"
          >
            User Login
          </NavLink>

          <NavLink
            to="/admin/login" 
            className="px-4 py-2 text-sm font-semibold text-gray-700 transition duration-300 bg-gray-100 rounded-md hover:bg-blue-600 hover:text-white"
          >
            Admin Login
          </NavLink>

          
        </nav>
      </div>
    </header>
  );
};

export default Header;
