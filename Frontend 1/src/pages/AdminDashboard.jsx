import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { Building, Clock, CheckCircle, XCircle, Settings, PlusCircle, Users, Calendar } from 'lucide-react';
import { fetchDashboardStats, fetchCurrentWorkingHalls, fetchPendingApprovals, fetchOffices, fetchCategories, fetchSessions } from "../api/axios";
import { jwtDecode}  from 'jwt-decode';

const StatCard = ({ title, value, icon, color }) => (
  <div className="flex items-center p-2 bg-white rounded-lg shadow-md">
    <div className={`rounded-full p-3 mr-4 ${color}`} style={{borderTopLeftRadius: "12px"}}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-base font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [stats, setStats] = useState({
    total_halls: 0,
    available_halls: 0,
    working_halls: 0,
    upcoming_booked_halls: 0,
    upcoming_bookings: [],
    pending_bookings: 0,
    approved_bookings: 0,
    rejected_bookings: 0,
    cancelled_bookings: 0,
  });
  const [currentWorkingHalls, setCurrentWorkingHalls] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState('');
  const [categories, setCategories] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSession, setSelectedSession] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role) {
      setUserRole(role);
    }

    const getOffices = async () => {
      try {
        const data = await fetchOffices();
        setOffices(data);
      } catch (error) {
        console.error("Failed to fetch offices", error);
      }
    };

    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    const getSessions = async () => {
      try {
        const data = await fetchSessions();
        setSessions(data);
      } catch (error) {
        console.error("Failed to fetch sessions", error);
      }
    };

    getOffices();
    getCategories();
    getSessions();
  }, []);

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchDashboardStats(selectedOffice, selectedDate, selectedCategory, selectedSession);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };

    const getCurrentWorkingHalls = async () => {
      try {
        const data = await fetchCurrentWorkingHalls();
        setCurrentWorkingHalls(data);
      } catch (error) {
        console.error("Failed to fetch current working halls", error);
      }
    };

    const getPendingApprovals = async () => {
      try {
        const data = await fetchPendingApprovals();
        setPendingApprovals(data);
      } catch (error) {
        console.error("Failed to fetch pending approvals", error);
      }
    };

    // Fetch all data initially
    getStats();
    getCurrentWorkingHalls();
    getPendingApprovals();

    // Set up interval to refresh data every 30 minutes (180000 milliseconds)
    const interval = setInterval(() => {
      getStats();
      getCurrentWorkingHalls();
      getPendingApprovals();
    }, 1800000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [selectedOffice, selectedDate, selectedCategory, selectedSession]);

  const restrictedRoles = ["HR", "CAFFETERIA", "IT_SUPPORT"];
  const isRestricted = userRole && restrictedRoles.includes(userRole);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* <h1 className="mb-6 text-3xl font-bold text-gray-800">Dashboard</h1> */}

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-4">
        {/* Office Filter */}
        <div>
          <label htmlFor="office-filter" className="block text-sm font-medium text-text-charcoal">Filter by Office</label>
          <select
            id="office-filter"
            name="office-filter"
            className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedOffice}
            onChange={(e) => setSelectedOffice(e.target.value)}
          >
            <option value="">All Offices</option>
            {offices.map((office) => (
              <option key={office.id} value={office.id}>
                {office.office_name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label htmlFor="date-filter" className="block text-sm font-medium text-text-charcoal">Filter by Date</label>
          <input
            type="date"
            id="date-filter"
            name="date-filter"
            className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-text-charcoal">Filter by Category</label>
          <select
            id="category-filter"
            name="category-filter"
            className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Session Filter */}
        <div>
          <label htmlFor="session-filter" className="block text-sm font-medium text-text-charcoal">Filter by Session</label>
          <select
            id="session-filter"
            name="session-filter"
            className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
          >
            <option value="">All Sessions</option>
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.session_type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stat Tiles */}
      <div className="grid grid-cols-1 gap-4 mb-3 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Halls"
          value={stats.total_halls}
          icon={<Building className="text-white" size={24}/>}
          color="bg-blue-500"
        />
        <StatCard
          title="Available Halls"
          value={stats.available_halls}
          icon={<CheckCircle className="text-white" size={24}/>}
          color="bg-violet-900"
        />
        <StatCard
          title="Maintenance"
          value={stats.working_halls}
          icon={<Settings className="text-white" size={24}/>}
          color="bg-yellow-900"
        />
        <StatCard
          title="Upcoming Booked Halls"
          value={stats.upcoming_booked_halls}
          icon={<Calendar className="text-white" size={24}/>}
          color="bg-purple-500"
        />
         <StatCard
          title="Pending Bookings"
          value={stats.pending_bookings}
          icon={<Clock className="text-white" size={24} />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Approved Bookings"
          value={stats.approved_bookings}
          icon={<CheckCircle className="text-white" size={24} />}
          color="bg-green-500"
        />
        <StatCard
          title="Rejected Bookings"
          value={stats.rejected_bookings}
          icon={<XCircle className="text-white" size={24} />}
          color="bg-red-500"
        />
              <StatCard
          title="Cancelled Bookings"
          value={stats.cancelled_bookings}
          icon={<XCircle className="text-white" size={24} />}
          color="bg-gray-500"
        />
      </div>


      {/* Quick Actions */}
      {/* {!isRestricted && (
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => navigate("/admin/approvals")}
              className="flex items-center justify-center p-4 text-text-charcoal transition-colors bg-white rounded-lg shadow-md hover:bg-gray-50"
            >
              <CheckCircle size={20} className="mr-2" />
              Manage Approvals
            </button>
            <button
              onClick={() => navigate("/admin/halls")}
              className="flex items-center justify-center p-4 text-text-charcoal transition-colors bg-white rounded-lg shadow-md hover:bg-gray-50"
            >
              <Settings size={20} className="mr-2" />
              Manage Halls
            </button>
          </div>
        </div>
      )} */}

      {/* Two-column layout for current working halls and upcoming bookings */}
      <div className="grid grid-cols-1 gap-3 mb-8 lg:grid-cols-2">
        {/* Current Working Halls */}
        <div>
          <h2 className="flex items-center mb-2 text-base font-bold text-gray-800">
            {/* <Users className="mr-2" size={24} /> */}
            Current Working Halls
          </h2>
          <div className="p-3 bg-white rounded-lg shadow-md">
            {currentWorkingHalls.length > 0 ? (
              <ul>
                {currentWorkingHalls.map((hall, index) => (
                  <li key={index} className="py-2 border-b last:border-0">
                    <p className="font-semibold">{hall.hall_name}</p>
                    <p className="text-sm text-gray-600" style={{fontSize:"12px"}}>Team: {hall.team_name}</p>
                    <p className="text-sm text-gray-600" style={{fontSize:"12px"}}>Booked by: {hall.emp_name} at {hall.slot_time}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500" style={{fontSize:"12px"}}>No halls currently in use.</p>
            )}
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div>
          <h2 className="mb-2 text-base font-bold text-gray-800">Upcoming Approved Bookings</h2>
          <div className="p-3 bg-white rounded-lg shadow-md">
            {stats.upcoming_bookings.length > 0 ? (
              <ul>
                {stats.upcoming_bookings.map((booking) => (
                  <li key={booking.id} className="py-2 border-b last:border-0">
                    <p className="font-semibold" style={{fontSize:"12px"}}>{booking.hall_name} - {booking.slot_date} at {booking.slot_time}</p>
                    <p className="text-sm text-gray-600" style={{fontSize:"12px"}}>Booked by: {booking.emp_name}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500" style={{fontSize:"12px"}}>No upcoming approved bookings.</p>
            )}
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      {!isRestricted && (
        <div className="mb-8">
          <h2 className="flex items-center mb-4 text-base font-bold text-gray-800">
              Pending Approvals
          </h2>
          <div className="p-3 bg-white rounded-lg shadow-md">
            {pendingApprovals.length > 0 ? (
              <ul>
                {pendingApprovals.map((booking) => (
                  <li key={booking.id} className="py-2 border-b last:border-0">
                    <p className="font-semibold" style={{fontSize:"12px"}}>{booking.hall_name} - {booking.slot_date} at {booking.slot_time}</p>
                    <p className="text-sm text-gray-600" style={{fontSize:"12px"}}>TEAM: {booking.team_name}</p>
                    <p className="text-sm text-gray-600" style={{fontSize:"12px"}}>BOOKED BY: {booking.emp_name}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500" style={{fontSize:"12px"}}>No pending approvals.</p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
