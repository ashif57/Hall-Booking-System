import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://hall-booking-system-bpgs.onrender.com/api', // Update this to your Django backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchOffices = async () => {
  try {
    const response = await apiClient.get('/offices/');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching offices:', error);
    return [];
  }
};

export const fetchAdminUsers = async () => {
  try {
    const response = await apiClient.get('/admin-users/');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }
};

export const fetchEntities = async () => {
  try {
    const response = await apiClient.get('/entities/');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching entities:', error);
    return [];
  }
};

export const addOffice = async (officeData) => {
  try {
    const response = await apiClient.post('/offices/', officeData);
    return response.data;
  } catch (error) {
    console.error('Error adding office:', error.response?.data || error.message);
    throw error;
  }
};

export const updateOffice = async (officeId, officeData) => {
  try {
    const response = await apiClient.patch(`/offices/${officeId}/`, officeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating office ${officeId}:`, error.response?.data || error.message);
    throw error;
  }
};

export const deleteOffice = async (officeId) => {
  try {
    const response = await apiClient.delete(`/offices/${officeId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting office ${officeId}:`, error.response?.data || error.message);
    throw error;
  }
};

export const updateAdminUser = async (adminId, userData) => {
  try {
    const response = await apiClient.patch(`/admin-users/${adminId}/`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating admin user ${adminId}:`, error.response?.data || error.message);
    throw error;
  }
};

export const fetchHalls = async (officeId) => {
  try {
    const response = await apiClient.get(`/offices/${officeId}/halls/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching halls:', error);
    return [];
  }
};

export const fetchAllHalls = async () => {
  try {
    const response = await apiClient.get('/halls/');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching all halls:', error);
    return [];
  }
};

export const postHall = async (hallData) => {
  try {
    const response = await apiClient.post('/halls/', hallData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error posting hall:', error.response?.data || error.message);
    throw error;
  }
};
export const updateHall = async (hallId, hallData) => {
  try {
    const response = await apiClient.patch(`/halls/${hallId}/`, hallData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating hall ${hallId}:`, error.response?.data || error.message);
    throw error;
  }
};

export default apiClient;
export const createBooking = async (bookingData) => {
  try {
    const response = await apiClient.post('/bookings/', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error.response?.data || error.message);
    throw error;
  }};
export const fetchHallDetails = async (hallId) => {
  try {
    const response = await apiClient.get(`/halls/${hallId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hall details:', error);
    throw error;
  }
};

export const fetchSessions = async () => {
  try {
    const response = await apiClient.get('/sessions/');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
};
export const fetchBookedSlots = async (hallId, date) => {
  try {
    const response = await apiClient.get(`/halls/${hallId}/booked_slots/?date=${date}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    return [];
  }
};
export const fetchAllBookings = async () => {
  try {
    const response = await apiClient.get('/bookings/');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return [];
  }
};

export const approveBooking = async (bookingId) => {
  try {
    const response = await apiClient.post(`/bookings/${bookingId}/approve/`);
    return response.data;
  } catch (error) {
    console.error(`Error approving booking ${bookingId}:`, error);
    throw error;
  }
};

export const rejectBooking = async (bookingId, reason = '') => {
  try {
    const response = await apiClient.post(`/bookings/${bookingId}/reject/`, { reason });
    return response.data;
  } catch (error) {
    console.error(`Error rejecting booking ${bookingId}:`, error);
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const response = await apiClient.post(`/bookings/${bookingId}/cancel/`);
    return response.data;
  } catch (error) {
    console.error(`Error cancelling booking ${bookingId}:`, error);
    throw error;
  }
};

export const updateBooking = async (bookingId, bookingData) => {
  try {
    const response = await apiClient.patch(`/bookings/${bookingId}/`, bookingData);
    return response.data;
  } catch (error) {
    console.error(`Error updating booking ${bookingId}:`, error.response?.data || error.message);
    throw error;
  }
};
export const fetchBookingStats = async () => {
  try {
    const response = await apiClient.get('/booking-stats/');
    return response.data;
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    throw error;
  }
};

export const fetchDashboardStats = async (officeId, slotDate, category, sessionId) => {
  try {
    const params = new URLSearchParams();
    if (officeId) {
      params.append('office_id', officeId);
    }
    if (slotDate) {
      params.append('slot_date', slotDate);
    }
    if (category) {
      params.append('category', category);
    }
    if (sessionId) {
      params.append('session_id', sessionId);
    }
    
    const response = await apiClient.get(`/dashboard-stats/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const fetchSessionsWithHalls = async () => {
  try {
    const sessionsResponse = await apiClient.get('/sessions/');
    const hallsResponse = await apiClient.get('/halls/');
    
    const sessions = Array.isArray(sessionsResponse.data) ? sessionsResponse.data : [];
    const halls = Array.isArray(hallsResponse.data) ? hallsResponse.data : [];
    
    return { sessions, halls };
 } catch (error) {
    console.error('Error fetching sessions and halls:', error);
    return { sessions: [], halls: [] };
  }
};

export const updateSessionHallMapping = async (sessionId, hallId, preferenceLevel) => {
 try {
    const sessionData = {};
    
    if (preferenceLevel === 1) {
      sessionData.preferred_hall_1 = hallId;
    } else if (preferenceLevel === 2) {
      sessionData.preferred_hall_2 = hallId;
    } else if (preferenceLevel === 3) {
      sessionData.preferred_hall_3 = hallId;
    }
    
    const response = await apiClient.patch(`/sessions/${sessionId}/`, sessionData);
    return response.data;
  } catch (error) {
    console.error(`Error updating session ${sessionId} hall mapping:`, error.response?.data || error.message);
    throw error;
  }
};

export const fetchCurrentWorkingHalls = async () => {
  try {
    const response = await apiClient.get('/current-working-halls/');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching current working halls:', error);
    return [];
  }
};

export const fetchPendingApprovals = async () => {
  try {
    const response = await apiClient.get('/pending-approvals/');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    return [];
  }
};

export const fetchBlockedDates = async (hallId, startDate, endDate) => {
  try {
    // If hallId is 'all', fetch blocked dates for all halls
    // Otherwise, fetch blocked dates for the specific hall
    const hallParam = hallId === 'all' ? 'all' : hallId;
    const response = await apiClient.get(`/blocked-dates/by_date/?hall=${hallParam}&start_date=${startDate}&end_date=${endDate}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching blocked dates:', error);
    return [];
  }
};

export const createBlockedDate = async (blockedDateData) => {
  try {
    const response = await apiClient.post('/blocked-dates/', blockedDateData);
    return response.data;
  } catch (error) {
    console.error('Error creating blocked date:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteBlockedDate = async (blockedDateId) => {
  try {
    const response = await apiClient.delete(`/blocked-dates/${blockedDateId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting blocked date ${blockedDateId}:`, error.response?.data || error.message);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await apiClient.get('/hall-categories/');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchBookingsByEmail = async (email) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/bookings-by-email/?emp_email=${email}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching bookings by email:', error);
    return [];
  }
};
