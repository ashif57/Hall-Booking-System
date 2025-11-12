import React, { useMemo, useState, useEffect } from 'react';
import './BookingFormFloatingInput.css';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, Wifi, Monitor, Presentation, Speaker, Home } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { createBooking, fetchHallDetails, fetchSessions, fetchBookedSlots, fetchBlockedDates } from '../api/axios';
import apiClient from '../api/axios';
import SimilarSpaces from '../components/booking/SimilarSpaces';
import Select from 'react-select';
import Amenities from '../components/Amenities';

const BookingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 60);

  const todayStr = useMemo(() => today.toISOString().split('T')[0], [today]);

  const [hall, setHall] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState({ from: today, to: today });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]); // For storing blocked dates from backend
  const [otpState, setOtpState] = useState({ sent: false, verified: false, value: '' });
  const [otpTimer, setOtpTimer] = useState(0); // Timer in seconds

  const [bookingDetails, setBookingDetails] = useState({
    emp_code: '',
    emp_name: '',
    emp_email_id: '',
    emp_mobile_no: '',
    team_name: '',
    session: '',
    description: '',
    shift: '',
    it_support: false,
    hr_support: false,
    fin_support: false,
    cafeteria: false,
    wifi: false,
    tv: false,
    whiteboard: false,
    speaker: false,
    mic: false,
    extension_power_box: false,
    stationaries: false,
    chairs_tables: false
  });

  useEffect(() => {
    const loadHallDetails = async () => {
      setLoading(true);
      try {
        const data = await fetchHallDetails(id);
        setHall(data);
      } catch (err) {
        console.error('Failed to load hall details:', err);
        toast.error('Failed to load hall details.');
      } finally {
        setLoading(false);
      }
    };

    const loadSessions = async () => {
      try {
        const data = await fetchSessions();
        setSessions(data);
      } catch (err) {
        console.error('Failed to load sessions:', err);
        toast.error('Failed to load sessions.');
      }
    };

    if (id) {
      loadHallDetails();
    }
    loadSessions();
  }, [id]);

  // OTP timer effect
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0 && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  useEffect(() => {
    const loadBookedSlots = async () => {
      if (selectedRange && selectedRange.from && hall) {
        try {
          // Format date as YYYY-MM-DD in local timezone
          const dateStr = selectedRange.from.toLocaleDateString('en-CA'); // 'en-CA' locale formats as YYYY-MM-DD
          const data = await fetchBookedSlots(hall.id, dateStr);
          setBookedSlots(data);
        } catch (err) {
          console.error('Failed to load booked slots:', err);
          toast.error('Failed to load booked slots.');
        }
      }
    };
    loadBookedSlots();
  }, [selectedRange, hall]);

  // Load blocked dates when hall and selected range change
  useEffect(() => {
    const loadBlockedDates = async () => {
      if (hall) {
        try {
            const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString().split('T')[0];
            const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString().split('T')[0];
          const data = await fetchBlockedDates(hall.id, firstDay, lastDay);
          setBlockedDates(data);
        } catch (err) {
          console.error('Failed to load blocked dates:', err);
        }
      }
    };
    loadBlockedDates();
  }, [hall, currentMonth]);

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    setBookingDetails((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const sendOtp = async () => {
    if (!bookingDetails.emp_email_id) {
      return toast.error("Enter email first");
    }
    try {
      await apiClient.post('/send-otp/', { email: bookingDetails.emp_email_id });
      toast.success("OTP sent to email");
      setOtpState((p) => ({ ...p, sent: true }));
      setOtpTimer(120); // Set timer to 2 minutes (120 seconds)
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = async () => {
    try {
      await apiClient.post('/verify-otp/', { email: bookingDetails.emp_email_id, otp: otpState.value });
      toast.success("Email verified!");
      setOtpState((p) => ({ ...p, verified: true }));
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return toast.error("Please wait for details to load.");
    if (!hall) return toast.error("Hall details could not be loaded. Please try again.");
    if (!otpState.verified) return toast.error("Verify email before booking");
    if (selectedSlots.length === 0) return toast.error("Please select at least one time slot");
    if (!selectedRange || !selectedRange.from || !selectedRange.to) return toast.error("Please select a date range");

    const toastId = toast.loading("Submitting booking...");
    try {
      const dates = getDatesInRange(selectedRange.from, selectedRange.to);
      let lastBookingId = null;

      for (const date of dates) {
        for (const slot of selectedSlots) {
          const payload = {
            slot_date: date.toLocaleDateString('en-CA'), // 'en-CA' locale formats as YYYY-MM-DD
            slot_time: slot,
            emp_code: bookingDetails.emp_code,
            emp_name: bookingDetails.emp_name,
            emp_email_id: bookingDetails.emp_email_id,
            emp_mobile_no: bookingDetails.emp_mobile_no,
            team_name: bookingDetails.team_name,
            office: hall.office,
            hall: hall.id,
            session: bookingDetails.session,
            description: bookingDetails.description,
            shift: bookingDetails.shift,
            it_support: bookingDetails.it_support,
            hr_support: bookingDetails.hr_support,
            fin_support: bookingDetails.fin_support,
            caf_support: bookingDetails.cafeteria,
            wifi: bookingDetails.wifi,
            tv: bookingDetails.tv,
            whiteboard: bookingDetails.whiteboard,
            speaker: bookingDetails.speaker,
            mic: bookingDetails.mic,
            extension_power_box: bookingDetails.extension_power_box,
            stationaries: bookingDetails.stationaries,
            chairs_tables: bookingDetails.chairs_tables
          };
           const response = await createBooking(payload);
          lastBookingId = response.id;
        }
      }

      toast.success("Booking submitted successfully!", { id: toastId });
      if (lastBookingId) {
        navigate(`/confirmation/${lastBookingId}`);
      } else {
        navigate('/'); // Fallback if no booking was made
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.non_field_errors) {
        toast.error(error.response.data.non_field_errors[0], { id: toastId });
      } else {
        toast.error("Booking failed. Please try again.", { id: toastId });
      }
    }
  };

  const generateSlots = (startHour = 0, endHour = 23) => {
    const slots = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let min of [0, 30]) {
        const formatTime = (h, m) => {
          const ampm = h >= 12 ? "PM" : "AM";
          const displayHour = h % 12 === 0 ? 12 : h % 12;
          const displayMin = m === 0 ? "00" : m;
          return `${displayHour}:${displayMin} ${ampm}`;
        };

        const startTime = formatTime(hour, min);
        
        let endHour = hour;
        let endMin = min + 30;
        if (endMin === 60) {
          endHour = hour + 1;
          endMin = 0;
        }
        const endTime = formatTime(endHour, endMin);
        
        slots.push(`${startTime} - ${endTime}`);
      }
    }
    return slots;
  };

  const allSlots = generateSlots(0, 23); // Generate slots for full 24 hours

  // Check if a date is blocked
  const isDateBlocked = (date) => {
    if (!blockedDates || blockedDates.length === 0) return false;
    
    const dateStr = date.toLocaleDateString('en-CA');
    return blockedDates.some(blockedDate => blockedDate.blocked_date === dateStr);
  };

  // Custom modifier for DayPicker to disable blocked dates
  const disabledDays = {
    before: today,
    ...(blockedDates && blockedDates.length > 0
      ? {
          after: new Date(0), // This is a workaround to allow multiple disabled dates
        }
      : {}),
  };

  // Custom disabled function for DayPicker
  const isDayDisabled = (date) => {
    // Disable past dates
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    if (date < todayDate) return true;

    // Disable dates after 60 days
    if (date > maxDate) return true;
    
    // Disable blocked dates
    if (isDateBlocked(date)) return true;
    
    return false;
  };

  const isSlotDisabled = (slot) => {
    const booking = bookedSlots.find(b => b.slot_time === slot);
    if (booking && booking.status === 'Approved') {
      return true;
    }

    const now = new Date();
    const isToday = selectedRange?.from && selectedRange.from.toDateString() === now.toDateString();

    if (!isToday) {
      return false; // Not today, so no time-based restriction
    }

    try {
      const slotTimeString = slot.split(' - ')[0];
      const [time, period] = slotTimeString.split(' ');
      let [hour, minute] = time.split(':').map(Number);

      if (period.toLowerCase() === 'pm' && hour !== 12) hour += 12;
      if (period.toLowerCase() === 'am' && hour === 12) hour = 0;

      if (isNaN(hour) || isNaN(minute)) {
        return false;
      }

      const slotDateTime = new Date(selectedRange.from);
      slotDateTime.setHours(hour, minute, 0, 0);

      return slotDateTime < now;
    } catch (e) {
      return false;
    }
  };

  const toggleSlot = (slot) => {
    // Find booking status for this slot
    const booking = bookedSlots.find(b => b.slot_time === slot);
    const status = booking ? booking.status : null;
    
    // If it's a pending slot, show confirmation
    if (status === 'Pending') {
      const confirmed = window.confirm(`This slot is already booked by ${booking.emp_name || 'someone else'} and is waiting for approval. Are you sure you want to book it?`);
      if (!confirmed) {
        return;
      }
    }
    
    setSelectedSlots((prev) => {
      const newSlots = prev.includes(slot)
        ? prev.filter((s) => s !== slot)
        : [...prev, slot];
      return newSlots.sort(); // or custom sort
    });
  };

  const shiftOptions = [
    { value: 'Day', label: 'Day' },
    { value: 'Mid', label: 'Mid' },
    { value: 'Night', label: 'Night' },
   ];

  const teamOptions = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Ajay Sharma', label: 'Ajay Sharma' },
  { value: 'ALDAR', label: 'ALDAR' },
  { value: 'Abirami Ramdoss', label: 'Abirami Ramdoss' },
  { value: 'Arshad', label: 'Arshad' },
  { value: 'Arun Franklin', label: 'Arun Franklin' },
  { value: 'Avishek Ganguly', label: 'Avishek Ganguly' },
  { value: 'Azharuddin', label: 'Azharuddin' },
  { value: 'Balaji R', label: 'Balaji R' },
  { value: 'Bobby', label: 'Bobby' },
  { value: 'BUH', label: 'BUH' },
  { value: 'Business Development', label: 'Business Development' },
  { value: 'CFO', label: 'CFO' },
  { value: 'CHR', label: 'CHR' },
  { value: 'Corporate Finance', label: 'Corporate Finance' },
  { value: 'Corporate HR', label: 'Corporate HR' },
  { value: 'Corporate HR - HRBP', label: 'Corporate HR - HRBP' },
  { value: 'Corporate HR - MY', label: 'Corporate HR - MY' },
  { value: 'Corporate HR - Ops', label: 'Corporate HR - Ops' },
  { value: 'Corporate HR - TAG', label: 'Corporate HR - TAG' },
  { value: 'Corporate HR - UAE', label: 'Corporate HR - UAE' },
  { value: 'CSR', label: 'CSR' },
  { value: 'Customer Success', label: 'Customer Success' },
 { value: 'CX Team', label: 'CX Team' },
  { value: 'David Sexton', label: 'David Sexton' },
  { value: 'Delivery and Excellence', label: 'Delivery and Excellence' },
  { value: 'Digital Practice - Mohr', label: 'Digital Practice - Mohr' },
  { value: 'Digital Transformation', label: 'Digital Transformation' },
  { value: 'Dilawar', label: 'Dilawar' },
  { value: 'Dimiour', label: 'Dimiour' },
  { value: 'Dimiour - Contract', label: 'Dimiour - Contract' },
  { value: 'Dimiour - Digital Practice', label: 'Dimiour - Digital Practice' },
  { value: 'Dimiour - GE', label: 'Dimiour - GE' },
  { value: 'Dimiour - HR Ops', label: 'Dimiour - HR Ops' },
  { value: 'Dimiour - Intern', label: 'Dimiour - Intern' },
  { value: 'Dimiour - TAG', label: 'Dimiour - TAG' },
  { value: 'Dimiour - TAG/Recruitment', label: 'Dimiour - TAG/Recruitment' },
  { value: 'Dimiour - Toy', label: 'Dimiour - Toy' },
  { value: 'Dimiour - VGO', label: 'Dimiour - VGO' },
  { value: 'Dimiour (Malaysia)', label: 'Dimiour (Malaysia)' },
  { value: 'Dinakaran G', label: 'Dinakaran G' },
  { value: 'Dino Zeoff', label: 'Dino Zeoff' },
  { value: 'Don Blessing Nelson S', label: 'Don Blessing Nelson S' },
  { value: 'Financial Planning and Analytics', label: 'Financial Planning and Analytics' },
  { value: 'GE - Contract Toyota -', label: 'GE - Contract Toyota -' },
  { value: 'GE Toyota -', label: 'GE Toyota -' },
  { value: 'Global Finance', label: 'Global Finance' },
  { value: 'Guna Sekaran. S', label: 'Guna Sekaran. S' },
  { value: 'HR', label: 'HR' },
  { value: 'IBEX', label: 'IBEX' },
  { value: 'Ibrahim', label: 'Ibrahim' },
  { value: 'Information Security', label: 'Information Security' },
  { value: 'Innovation Hub', label: 'Innovation Hub' },
  { value: 'Innovation Hub - Intern', label: 'Innovation Hub - Intern' },
  { value: 'Internal IT', label: 'Internal IT' },
  { value: 'Jack Sherman', label: 'Jack Sherman' },
  { value: 'Seliyan', label: 'Seliyan' },
  { value: 'John David G', label: 'John David G' },
  { value: 'Karthik M', label: 'Karthik M' },
  { value: 'Kimberly Clark', label: 'Kimberly Clark' },
  { value: 'Lance Taylor', label: 'Lance Taylor' },
  { value: 'Lingaprasanth', label: 'Lingaprasanth' },
  { value: 'LnD', label: 'LnD' },
  { value: 'Manoj BG', label: 'Manoj BG' },
  { value: 'Market Operations', label: 'Market Operations' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Max Taylor', label: 'Max Taylor' },
  { value: 'Mgmt', label: 'Mgmt' },
  { value: 'Michael Romeo', label: 'Michael Romeo' },
  { value: 'Mohamed Irfan Peeran', label: 'Mohamed Irfan Peeran' },
  { value: 'Mohanavelu K A', label: 'Mohanavelu K A' },
  { value: 'Mohr Partner - IT', label: 'Mohr Partner - IT' },
  { value: 'Mubashir', label: 'Mubashir' },
  { value: 'Murugesan S', label: 'Murugesan S' },
  { value: 'Narasimman S', label: 'Narasimman S' },
  { value: 'Narayan G', label: 'Narayan G' },
  { value: 'Naveen Senthilkumar', label: 'Naveen Senthilkumar' },
  { value: 'Oliver Sam', label: 'Oliver Sam' },
  { value: 'Omar Mohamed', label: 'Omar Mohamed' },
  { value: 'Pal Nila', label: 'Pal Nila' },
  { value: 'Prasanna J', label: 'Prasanna J' },
  { value: 'Prassanna Kumar', label: 'Prassanna Kumar' },
  { value: 'Praveen', label: 'Praveen' },
  { value: 'Premkumar', label: 'Premkumar' },
  { value: 'Priya', label: 'Priya' },
  { value: 'Projects', label: 'Projects' },
  { value: 'Projects - Contract', label: 'Projects - Contract' },
  { value: 'Rahul Ashok Kumar Mishra', label: 'Rahul Ashok Kumar Mishra' },
  { value: 'Sastha Karthick Murugan', label: 'Sastha Karthick Murugan' },
  { value: 'Rajkeran A', label: 'Rajkeran A' },
  { value: 'Recr-VDSS DS', label: 'Recr-VDSS DS' },
  { value: 'Recr-VDSS DS - Contract', label: 'Recr-VDSS DS - Contract' },
  { value: 'Revathi B', label: 'Revathi B' },
  { value: 'RevMedia', label: 'RevMedia' },
  { value: 'Rima Ghosh', label: 'Rima Ghosh' },
  { value: 'Rohit', label: 'Rohit' },
  { value: 'Saral', label: 'Saral' },
  { value: 'Shenbagapriya S', label: 'Shenbagapriya S' },
  { value: 'Siddahmed', label: 'Siddahmed' },
  { value: 'Sini Mary X', label: 'Sini Mary X' },
  { value: 'Solomon Sebastian', label: 'Solomon Sebastian' },
  { value: 'Strategic Transformation', label: 'Strategic Transformation' },
  { value: 'Supply Relationship Management', label: 'Supply Relationship Management' },
  { value: 'Suriya Senthilnathan', label: 'Suriya Senthilnathan' },
  { value: 'Toyota', label: 'Toyota' },
  { value: 'Toyota - Administration', label: 'Toyota - Administration' },
  { value: 'Toyota - Cloud DevOps - HXF', label: 'Toyota - Cloud DevOps - HXF' },
  { value: 'Toyota - Elixir', label: 'Toyota - Elixir' },
  { value: 'Toyota - IDP', label: 'Toyota - IDP' },
  { value: 'Toyota - IDP - Contract', label: 'Toyota - IDP - Contract' },
  { value: 'Toyota - IIM', label: 'Toyota - IIM' },
  { value: 'Toyota - Mobile App', label: 'Toyota - Mobile App' },
  { value: 'Toyota - Onboarding', label: 'Toyota - Onboarding' },
  { value: 'Toyota - QA', label: 'Toyota - QA' },
  { value: 'Toyota - (not Vdart payroll)', label: 'Toyota - (not Vdart payroll)' },
  { value: 'Unique', label: 'Unique' },
  { value: 'Unique IT', label: 'Unique IT' },
  { value: 'Vandhana Ramakrishnan', label: 'Vandhana Ramakrishnan' },
  { value: 'Vdart Academy', label: 'Vdart Academy' },
  { value: 'VDart Gulf FZE', label: 'VDart Gulf FZE' },
  { value: 'VDart Malaysia SDN BHD', label: 'VDart Malaysia SDN BHD' },
  { value: 'VDSS DS', label: 'VDSS DS' },
  { value: 'VDSS DS-HCL TnD', label: 'VDSS DS-HCL TnD' },
  { value: 'Verifone', label: 'Verifone' },
  { value: 'Vijay', label: 'Vijay' },
  { value: 'Vinay', label: 'Vinay' },
  { value: 'Vouch', label: 'Vouch' },
  { value: 'RFP', label: 'RFP' },
  { value: 'Guru Samy Nagarajan', label: 'Guru Samy Nagarajan' },
  { value: 'Martin Raj Arockiasamy', label: 'Martin Raj Arockiasamy' },
  { value: 'Umera Ismail Khan', label: 'Umera Ismail Khan' },
  { value: 'Recruitment DS', label: 'Recruitment DS' },
  { value: 'Internal Marketing', label: 'Internal Marketing' },
  { value: 'Business Lead Generation', label: 'Business Lead Generation' },
  { value: 'Syed Ahmed (Sidd)', label: 'Syed Ahmed (Sidd)' },
  { value: 'IKAROS', label: 'IKAROS' },
  { value: 'Celestine Soosai Manickam', label: 'Celestine Soosai Manickam' },
  { value: 'Maheshwari Marimuthu', label: 'Maheshwari Marimuthu' },
  { value: 'Melina', label: 'Melina' },
  { value: 'Johnathan', label: 'Johnathan' },
  { value: 'Felix', label: 'Felix' },
  { value: 'Faisal Ahamed', label: 'Faisal Ahamed' },
  { value: 'Others', label: 'Others' }
];


  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-full px-0 mx-auto sm:px-4 md:max-w-8xl">
      {/* <div className="mx-auto max-w-7xl"> */}
        <div className="p-4 bg-white rounded-lg shadow-xl sm:p-6 md:p-8">
        {/* <div className="p-6 bg-white rounded-lg shadow-xl md:p-8"> */}
          {/* Header with hall name and back button */}

          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b">
            {/* Title: allow to shrink/truncate so the button doesn't wrap */}
            {/* <h1
              className="flex-1 min-w-0 mr-4 text-2xl font-bold text-gray-800"
              title={hall?.hall_name}
            >
              <span className="block truncate">{hall?.hall_name}</span>
            </h1> */}

           <h1
              className="flex-1 min-w-0 mr-4"
              title={hall?.hall_name}
              aria-label={hall?.hall_name}
            >
              {/* Responsive font sizes + controlled wrapping/truncation */}
              <style>{`
                /* On very small screens allow the name to wrap up to 2 lines */
                @media (max-width: 420px) {
                  .hall-name-clamp {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    white-space: normal;
                  }
                }
                /* On >= 420px, use single-line truncation to keep compact layout */
                @media (min-width: 421px) {
                  .hall-name-clamp {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                }
              `}</style>
              <span
                className="block text-lg font-bold leading-tight text-gray-800 hall-name-clamp sm:text-xl md:text-2xl lg:text-3xl"
              >
                {hall?.hall_name || 'Hall Details'}
              </span>
            </h1>






            {/* keep your style block as-is */}
            <style>{`
              .btn-3d {
                position: relative;
                background: linear-gradient(180deg, #ffffff 0%, #e6eef9 100%);
                border: 1px solid rgba(2,6,23,0.06);
                box-shadow: 0 8px 18px rgba(2,6,23,0.12), inset 0 1px 0 rgba(255,255,0.6);
                border-radius: 0.5rem;
                transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s;
                overflow: visible;
              }
              .btn-3d::after {
                content: "";
                position: absolute;
                left: 6px;
                right: 6px;
                bottom: -8px;
                height: 8px;
                background: linear-gradient(90deg, rgba(2,6,23,0.08), rgba(2,6,23,0.02));
                filter: blur(6px);
                border-radius: 0.5rem;
                z-index: -1;
                pointer-events: none;
              }
              .btn-3d:active {
                transform: translateY(3px);
                box-shadow: 0 4px 10px rgba(2,6,23,0.08), inset 0 1px 0 rgba(255,255,0.35);
              }
              .btn-3d .btn-icon {
                transition: transform 0.18s ease;
                display: inline-flex;
                align-items: center;
              }
              .btn-3d:active .btn-icon {
                transform: translateY(1px) scale(0.98);
              }
              .btn-3d:focus {
                outline: none;
                box-shadow: 0 8px 18px rgba(2,6,23,0.12), 0 0 0 4px rgba(59,130,246,0.12);
              }
              .btn-3d:hover {
                background: linear-gradient(to right, #3b82f6, #1e40af);
                color: #fff;
              }
            `}</style>

            {/* Button: prevent it from shrinking so it stays on the same row */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center flex-shrink-0 px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 rounded-lg md:text-base btn-3d"
              aria-label="Back to home"
            >
              <span className="mr-2 btn-icon">
                <Home size={18} />
              </span>
              <span className="hidden sm:inline">Home</span>
            </button>
          </div>

          
          {/* Main content grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Column - Hall Info */}
            <div className="lg:col-span-1">
              {hall?.image ? (
                <img
                  src={
                    hall.image.startsWith('http') ?
                      hall.image : // Already a full URL
                    hall.image.startsWith('/media/') ?
                      `http://localhost:8000${hall.image}` : // Has /media/ prefix
                      `http://localhost:8000/media/${hall.image}` // Add /media/ prefix
                  }
                  alt={hall.hall_name || "Hall"}
                  className="w-full mb-4 rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/hall image.jpg";
                  }}
                  style={{padding:"10%"}}
                />
              ) : (
                <img
                  src="/hall image.jpg"
                  alt="Hall"
                  className="w-full mb-4 rounded-lg shadow-md"
                  style={{padding:"10%"}}
                />
              )}

              <h2 className="mb-2 text-xl font-bold text-text-charcoal" style={{fontSize: '14px'}}>{hall?.hall_name || "Hall Details"}</h2>
              <p className="mb-4 text-gray-600" style={{fontSize: '12px'}}>
                {hall?.about || "This hall is ideal for conferences, workshops, and events. Fully equipped with modern amenities to make your sessions productive"}
              </p>

              <h2 className="mb-2 text-xl font-bold text-text-charcoal" style={{fontSize: '14px'}}>Hall Amenities</h2>
              <div className="p-4">
             <Amenities availableAmenities={{
              wifi: hall?.wifi,
              tv: hall?.tv,
              speaker: hall?.speaker,
              mic: hall?.mic,
              whiteboard: hall?.whiteboard,
              stationaries: hall?.stationaries,
              chairs_tables: hall?.chairs_tables,
              extension_power_box: hall?.extension_power_box
            }} /></div>
            </div>

            {/* Right Column - Booking Form */}
            {/* Right Column - Booking Form */


            /* Right Column - Booking Form */}
            {/* Right Column - Booking Form */}
            {/* Right Column - Booking Form */}


                    <div className="lg:col-span-1">
                      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                        <h2 className="mb-4 text-2xl font-bold text-gray-800" style={{fontSize: '14px'}}>Booking Information</h2>
                        
                        <form onSubmit={handleSubmit}>
                          {/* Employee ID */}
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-2" style={{marginBlock:"-10px"}}>
                            <div className="floating-input-wrapper">
                              <input
                                type="text"
                                name="emp_code"
                                value={bookingDetails.emp_code}
                                onChange={handleInputChange}
                                className="floating-input"
                                placeholder=" "
                                autoComplete="off"
                              />
                              <span className="floating-label" style={{fontSize: '12px'}}>Employee ID</span>
                            </div>
                            
                            {/* Employee Name */}
                            <div className="floating-input-wrapper">
                              <input
                                type="text"
                                name="emp_name"
                                value={bookingDetails.emp_name}
                                onChange={handleInputChange}
                                className="floating-input"
                                placeholder=" "
                                autoComplete="off"
                              />
                              <span className="floating-label" style={{fontSize: '12px'}}>Employee Name</span>
                            </div>
                            
                            {/* Employee Mobile */}
                            <div className="floating-input-wrapper">
                              <input
                                type="text"
                                name="emp_mobile_no"
                                value={bookingDetails.emp_mobile_no}
                                onChange={handleInputChange}
                                className="floating-input"
                                placeholder=" "
                                autoComplete="off"
                              />
                              <span className="floating-label" style={{fontSize: '12px'}}>Employee Mobile</span>
                            </div>

                            {/* Employee Email & OTP */}
                            <div>
                                <div className="floating-input-wrapper">
                                  <input
                                    type="email"
                                    name="emp_email_id"
                                    value={bookingDetails.emp_email_id}
                                    onChange={handleInputChange}
                                    className="floating-input"
                                    placeholder=" "
                                    autoComplete="off"
                                  />
                                  <span className="floating-label" style={{fontSize: '12px'}}>Employee Email</span>

                                  {/* OTP Section & Team Dropdown in the same row */}
                                  <div className="flex flex-col mt-2 space-y-2">
                                    {/* OTP Section */}
                                    
                                      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:items-center">
                                        {!otpState.sent ? (
                                          <div>
                                          <button 
                                            type="button" 
                                            onClick={sendOtp} 
                                            className="px-2 py-1 text-xs text-white transition-colors bg-secondary-royal-gold rounded-lg text-size-sm hover:bg-accent-champagne whitespace-nowrap"
                                          >
                                            Send OTP
                                          </button>
                                          </div>
                                        ) : (
                                          <div>
                                            <div className="flex-1 mt-2 mr-2 floating-input-wrapper">
                                              <input
                                                type="text"
                                                placeholder=" "
                                                value={otpState.value}
                                                onChange={(e) => setOtpState((p) => ({ ...p, value: e.target.value }))}
                                                className="floating-input"
                                                autoComplete="off"
                                              />
                                              <span className="floating-label " style={{fontSize: '12px'}}>Enter OTP</span>
                                            </div>
                                            <button 
                                              type="button" 
                                              onClick={verifyOtp} 
                                              className="px-2 py-1 text-xs text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 whitespace-nowrap"
                                            >
                                              Verify
                                            </button>
                                          </div>
                                        )}
                                        {otpState.sent && otpTimer > 0 && (
                                        <div className="mt-2 text-sm text-gray-500">
                                          Resend OTP in {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}
                                        </div>
                                      )}
                                      {otpState.sent && otpTimer === 0 && (
                                        <button
                                          type="button"
                                          onClick={sendOtp}
                                          className="px-4 py-2 mt-2 text-sm text-white transition-colors bg-secondary-royal-gold rounded-lg hover:bg-accent-champagne"
                                        >
                                          Resend OTP``
                                        </button>
                                      )}
                                      </div> 
                                    
                                  </div>
                                </div>
                                
                            </div>
                            
                            {/* Team Dropdown */}
                            <div>
                                  <label className="block mb-1 text-sm font-medium text-text-charcoal">Team</label>
                                  <Select
                                    options={teamOptions}
                                    value={teamOptions.find((option) => option.value === bookingDetails.team_name)}
                                    onChange={(selectedOption) =>
                                      setBookingDetails((prev) => ({ ...prev, team_name: selectedOption?.value || '' }))
                                    }
                                    isClearable
                                    placeholder="Select or search team..."
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    styles={{
                                      control: (provided) => ({
                                        ...provided,
                                        padding: '0.25rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        minHeight: '36px',
                                        fontSize: '12px',
                                        lineHeight: '1.25rem',
                                        '&:hover': {
                                          borderColor: '#d1d5db',
                                        }
                                      }),
                                      input: (provided) => ({
                                        ...provided,
                                        margin: 0,
                                        padding: 0,
                                      }),
                                      valueContainer: (provided) => ({
                                        ...provided,
                                        padding: '0 0.5rem',
                                      }),
                                      indicatorsContainer: (provided) => ({
                                        ...provided,
                                        padding: '0 0.25rem',
                                      }),
                                      placeholder: (provided) => ({
                                        ...provided,
                                        fontSize: '12px',
                                      }),
                                    }}
                                  />
                            </div> 
                                  
                            {/* Select session */}
                            <div>
                                  <label
                                    className="block mb-1 font-medium text-text-charcoal"
                                    style={{ fontSize: '14px' }}
                                  >
                                    Select session
                                  </label>
                                  <Select
                                    options={sessions.map((s) => ({ value: s.id, label: s.session_type }))}
                                    value={sessions
                                      .map((s) => ({ value: s.id, label: s.session_type }))
                                      .find((option) => option.value === bookingDetails.session)}
                                    onChange={(selectedOption) =>
                                      setBookingDetails((prev) => ({
                                        ...prev,
                                        session: selectedOption?.value || '',
                                      }))
                                    }
                                    isClearable
                                    placeholder="Select or search session..."
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    styles={{
                                      control: (provided) => ({
                                        ...provided,
                                        padding: '0.25rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        minHeight: '36px',
                                        fontSize: '12px',
                                        '&:hover': {
                                          borderColor: '#d1d5db',
                                        },
                                      }),
                                      valueContainer: (provided) => ({
                                        ...provided,
                                        padding: '0 0.5rem',
                                      }),
                                      indicatorsContainer: (provided) => ({
                                        ...provided,
                                        padding: '0 0.25rem',
                                      }),
                                      placeholder: (provided) => ({
                                        ...provided,
                                        fontSize: '12px',
                                      }),
                                      input: (provided) => ({
                                        ...provided,
                                        margin: 0,
                                        padding: 0,
                                      }),
                                    }}
                                  />
                            </div>

                            {/* Shift Dropdown */}
                            <div>
                                  <label
                                    className="block mb-1 font-medium text-text-charcoal"
                                    style={{ fontSize: '14px' }}
                                  >
                                    Select Shift
                                  </label>
                                  <Select
                                    options={shiftOptions}
                                    value={shiftOptions.find((option) => option.value === bookingDetails.shift)}
                                    onChange={(selectedOption) =>
                                      setBookingDetails((prev) => ({
                                        ...prev,
                                        shift: selectedOption?.value || '',
                                      }))
                                    }
                                    isClearable
                                    placeholder="Select or search shift..."
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    styles={{
                                      control: (provided) => ({
                                        ...provided,
                                        padding: '0.25rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        minHeight: '36px',
                                        fontSize: '12px',
                                        '&:hover': {
                                          borderColor: '#d1d5db',
                                        },
                                      }),
                                      valueContainer: (provided) => ({
                                        ...provided,
                                        padding: '0 0.5rem',
                                      }),
                                      indicatorsContainer: (provided) => ({
                                        ...provided,
                                        padding: '0 0.25rem',
                                      }),
                                      placeholder: (provided) => ({
                                        ...provided,
                                        fontSize: '12px',
                                      }),
                                      input: (provided) => ({
                                        ...provided,
                                        margin: 0,
                                        padding: 0,
                                      }),
                                    }}
                                  />
                            </div>

                            {/* Four toggles */}
                            <div className="grid grid-cols-1 row-span-2 gap-4 p-4 mt-6 md:grid-cols-2">
                                <div className="flex items-center justify-between"> 
                                  <label htmlFor="it_support" className="font-medium text-text-charcoal" style={{fontSize: '14px'}}>IT Support Needed</label>
                                  <input
                                    type="checkbox"
                                    name="it_support"
                                    id="it_support"
                                    checked={bookingDetails.it_support}
                                    onChange={handleInputChange}
                                    className="toggle-checkbox"
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <label htmlFor="hr_support" className="font-medium text-text-charcoal" style={{fontSize: '14px'}}>HR Team</label>
                                  <input
                                    type="checkbox"
                                    name="hr_support"
                                    id="hr_support"
                                    checked={bookingDetails.hr_support}
                                    onChange={handleInputChange}
                                    className="toggle-checkbox"
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <label htmlFor="fin_support" className="font-medium text-text-charcoal" style={{fontSize: '14px'}}>Finance Team</label>
                                  <input
                                    type="checkbox"
                                    name="fin_support"
                                    id="fin_support"
                                    checked={bookingDetails.fin_support}
                                    onChange={handleInputChange}
                                    className="toggle-checkbox"
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <label htmlFor="cafeteria" className="font-medium text-text-charcoal" style={{fontSize: '14px'}}>Cafeteria</label>
                                  <input
                                    type="checkbox"
                                    name="cafeteria"
                                    id="cafeteria"
                                    checked={bookingDetails.cafeteria}
                                    onChange={handleInputChange}
                                    className="toggle-checkbox"
                                  />
                                </div>
                            </div>  

                            {/* Description */}
                            <div className="mt-6">
                                <label className="block mb-2 font-medium text-text-charcoal" style={{fontSize: '14px'}}>Description</label>
                                <textarea
                                  name="description"
                                  value={bookingDetails.description}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  rows="3"
                                  placeholder="Any additional information or special requests"
                                />
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>






          {/* Date and Time Selection */}
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold text-text-charcoal" style={{fontSize: '14px'}}>Select Date & T ime</h2>
                
                <style>{`
                  .blocked-date {
                    background-color: #e5e7eb !important;
                    color: #9ca3af !important;
                    cursor: not-allowed !important;
                  }
                  .blocked-date:hover {
                    background-color: #e5e7eb !important;
                  }
                `}</style>
                
                <div className="flex flex-col gap-6 md:flex-row">
                  {/* Calendar */}
                  <div className="p-4 mx-auto border rounded-lg md:w-fit">
                    <DayPicker
                      mode="range"
                      selected={selectedRange}
                      onSelect={(range, day, modifiers) => {
                        if (modifiers.disabled) {
                          toast.error('This date is not available for booking.');
                          return;
                        }
                        setSelectedRange(range);
                      }}
                      disabled={isDayDisabled}
                      onMonthChange={setCurrentMonth}
                      modifiers={{
                        blocked: (date) => isDateBlocked(date)
                      }}
                      modifiersClassNames={{
                        blocked: 'blocked-date'
                      }}
                      className="scale-90 sm:scale-10"
                      footer={
                        selectedRange && selectedRange.from && selectedRange.to
                          ? `Selected from ${selectedRange.from.toLocaleDateString()} to ${selectedRange.to.toLocaleDateString()}`
                          : 'Please select a date range'
                      }
                    />
                  </div>

                  {/* Time slots with scrollable container */}
                  <div className="flex-1 p-4 border rounded-lg" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <h3 className="mb-3 font-medium text-text-charcoal" style={{fontSize: '14px'}}>Available Time Slots</h3>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6">
                      {allSlots.map((slot) => {
                        const booking = bookedSlots.find(b => b.slot_time === slot);
                        const status = booking ? booking.status : null;
                        const disabled = isSlotDisabled(slot);

                        let bgColor = 'bg-green-100 text-green-800';
                        if (disabled) {
                          bgColor = 'bg-gray-300 text-text-charcoal';
                        } else if (status === 'Pending') {
                          bgColor = 'bg-yellow-200 text-yellow-800';
                        }
                        
                        const isSelected = selectedSlots.includes(slot);
                        let buttonBg = isSelected && !disabled ? 'bg-secondary-royal-gold text-white' : bgColor;
                        if (disabled) buttonBg = 'bg-gray-400';
                        
                        return (
                          <button
                            key={slot}
                            className={`w-full py-2 text-center border rounded-lg flex items-center justify-center text-xs sm:text-sm ${buttonBg} ${disabled ? 'cursor-not-allowed' : ''}`}
                            onClick={() => toggleSlot(slot)}
                            disabled={disabled}
                            type="button"
                            style={{fontSize: '12px'}}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                    
                    {selectedSlots.length > 0 && (
                      <button
                        className="px-4 py-2 mt-4 text-white bg-red-600 rounded-lg"
                        onClick={() => setSelectedSlots([])}
                        type="button"
                      >
                        Clear All Slots
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="mt-6">
                  <button
                    type="submit" 
                    className="w-full py-3 text-white bg-secondary-royal-gold rounded-lg hover:bg-accent-champagne disabled:bg-gray-400"
                    disabled={loading || !hall}
                    onClick={handleSubmit}
                  >
                    {loading ? 'Loading Hall Details...' : 'Submit Booking'}
                  </button> 
                </div>
              </div>

          <SimilarSpaces />
        </div>
      </div>
    </motion.div>
  );
};

export default BookingForm;
