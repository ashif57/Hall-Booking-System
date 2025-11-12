
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { Menu, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role) {
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    navigate('/admin/login');
  };

  const restrictedRoles = ["HR", "CAFFETERIA", "IT_SUPPORT"];
  const isRestricted = userRole && restrictedRoles.includes(userRole);

  return (
    <div className="flex h-screen bg-background-ivory-white">
      {!isRestricted && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
      <div className={`flex-1 flex flex-col overflow-hidden ${isRestricted ? 'w-full' : ''}`}>
        <header className="flex justify-between items-center p-4  ">
          <div className="flex items-center">
            {/* <h1 className="text-xl font-semibold">Admin Panel</h1> */}
            {!isRestricted && (
              <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none lg:hidden ml-4">
                <Menu size={24} />
              </button>
            )}
          </div>
          {isRestricted && (
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 font-medium text-gray-600 transition-colors duration-300 rounded-md hover:bg-red-500 hover:text-white"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          )}
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background-ivory-white p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
