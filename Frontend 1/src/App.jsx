
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Common Pages
import LandingPage from './pages/LandingPage';
import HallDetailsPage from './pages/HallDetailsPage';
import BookingForm from './pages/BookingForm';
import BookingConfirmation from './pages/BookingConfirmation';
import AdminLogin from './pages/AdminLogin';
import OTPTestPage from './pages/OTPTestPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import BookingApprovalPage from './pages/BookingApprovalPage';
import SectionMasterPage from './pages/SectionMasterPage';
import HallManagementPage from './pages/HallManagementPage';
import AdminCreationPage from './pages/AdminCreationPage';
import OfficeMasterPage from './pages/OfficeMasterPage';


// Super Admin Pages (placeholders)
// import SuperAdminDashboard from './pages/SuperAdminDashboard';
// import AddAdmin from './pages/AddAdmin';
// import Reports from './pages/Reports';

// Auth
import ProtectedRoute from './components/ProtectedRoute';
import SlotManagement from './pages/SlotManagement';
import HistoryPage from './pages/HistoryPage';
import HistoryLogin from './pages/HistoryLogin';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/halls/:id" element={<BookingForm />} />
        <Route path="/confirmation/:bookingId" element={<BookingConfirmation />} />
        <Route path="/hallssss" element={<HallDetailsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/history-login" element={<HistoryLogin />} />
<Route path="/otp-test" element={<OTPTestPage />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="approvals" element={<BookingApprovalPage />} />
          <Route path="section-master" element={<SectionMasterPage />} />
          <Route path="halls" element={<HallManagementPage />} />
          <Route path="create-admin" element={<AdminCreationPage />} />
          <Route path="slot" element={ <SlotManagement/> } />
          <Route path="office-master" element={<OfficeMasterPage />} />
          
        </Route>

        {/* Super Admin Routes would go here */}

      </Routes>
    </AnimatePresence>
  );
}

export default App;
