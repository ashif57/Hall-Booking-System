
// import React, { useEffect, useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { LayoutDashboard, CheckSquare, Settings, Building, LogOut, X, UserPlus, Clock } from 'lucide-react';
// import  { jwtDecode }  from 'jwt-decode';

// const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
//   const navigate = useNavigate();
//   const [userRole, setUserRole] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       const decodedToken = jwtDecode(token);
//       setUserRole(decodedToken.role);
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     navigate('/admin/login');
//   };

//   const navLinkClasses = ({ isActive }) =>
//     `flex items-center px-4 py-2 rounded-lg transition-colors duration-200 \${
//       isActive
//         ? 'bg-blue-600 text-white'
//         : 'text-gray-600 hover:bg-gray-200'
//     }`;

//   return (
//     <>
//       <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden \${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
//       <aside className={`fixed lg:relative inset-y-0 left-0 bg-white w-64 p-4 space-y-6 transform \${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 flex flex-col shadow-lg`}>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center ">
//             <img src="/logo.svg" alt="VDart Logo"/>
//           </div>
//           <button onClick={() => setSidebarOpen(false)} className="text-gray-500 lg:hidden">
//             <X size={24} />
//           </button>
//         </div>

//         <nav className="flex-1">
//           <NavLink to="/admin/dashboard" className={navLinkClasses}>
//             <LayoutDashboard className="mr-3" size={20} />
//             Dashboard
//           </NavLink>
//           <NavLink to="/admin/approvals" className={navLinkClasses}>
//             <CheckSquare className="mr-3" size={20} />
//             Approvals
//           </NavLink>
//           <NavLink to="/admin/halls" className={navLinkClasses}>
//             <Building className="mr-3" size={20} />
//             Halls
//           </NavLink>
//           <NavLink to="/admin/section-master" className={navLinkClasses}>
//             <Settings className="mr-3" size={20} />
//             Session Master
//           </NavLink>
//           <NavLink to="/admin/slot" className={navLinkClasses}>
//               <Clock className="mr-3" size={20} />
//               Slot Management
//             </NavLink>
//           {userRole === 'SUPERADMIN' && (
//             <NavLink to="/admin/create-admin" className={navLinkClasses}>
//               <UserPlus className="mr-3" size={20} />
//               Create Admin
//             </NavLink>
//           )}
//         </nav>

//         <div>
//           <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-gray-600 transition-colors duration-200 rounded-lg hover:bg-red-600 hover:text-white">
//             <LogOut className="mr-3" size={20} />
//             Logout
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;



import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Settings, Building, LogOut, X, UserPlus, Clock, Briefcase } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';


const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
      } catch (err) {
        console.warn('Invalid token', err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/admin/login');
  };

  // helper so the active/inactive styles are defined in one place
  const navLinkClasses = (isActive) =>
    `flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-secondary-royal-gold text-white shadow-sm ring-1 ring-blue-700/20'
        : 'text-text-charcoal hover:bg-accent-champagne'
    }`;

  return (
    <>
      {/* overlay for small screens */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />

      <aside
        className={`fixed lg:relative inset-y-0 left-0 bg-background-ivory-white w-64 p-4 space-y-6 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 flex flex-col shadow-lg`}
        aria-hidden={!sidebarOpen && window.innerWidth < 1024}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.svg" alt="VDart Logo" className="w-auto h-8" />
          </div>

          {/* close on small screens */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-gray-500 rounded lg:hidden hover:bg-accent-champagne"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) => navLinkClasses(isActive)}
          >
            <LayoutDashboard className="mr-3" size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/approvals"
            className={({ isActive }) => navLinkClasses(isActive)}
          >
            <CheckSquare className="mr-3" size={18} />
            Approvals
          </NavLink>

          <NavLink
            to="/admin/halls"
            className={({ isActive }) => navLinkClasses(isActive)}
          >
            <Building className="mr-3" size={18} />
            Halls
          </NavLink>
            {userRole === 'SUPERADMIN' && (
            <NavLink
              to="/admin/office-master"
              className={({ isActive }) => navLinkClasses(isActive)}
            >
              <Briefcase className="mr-3" size={18} />
              Office Master
            </NavLink>
          )}
          <NavLink
            to="/admin/section-master"
            className={({ isActive }) => navLinkClasses(isActive)}
          >
            <Settings className="mr-3" size={18} />
            Session Master
          </NavLink>

          <NavLink to="/admin/slot" className={({ isActive }) => navLinkClasses(isActive)}>
            <Clock className="mr-3" size={18} />
            Slot Management
          </NavLink>

      

          {userRole === 'SUPERADMIN' && (
            <NavLink
              to="/admin/create-admin"
              className={({ isActive }) => navLinkClasses(isActive)}
            >
              <UserPlus className="mr-3" size={18} />
              Create Admin
            </NavLink>
          )}
        </nav>

        <div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-600 transition-colors duration-200 rounded-lg hover:bg-red-600 hover:text-white"
          >
            <LogOut className="mr-3" size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
