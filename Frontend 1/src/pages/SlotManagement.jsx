import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { createBlockedDate, deleteBlockedDate, fetchBlockedDates, fetchAllHalls } from '../api/axios';
import Select from 'react-select';

const SlotManagement = () => {
  const [selectedRange, setSelectedRange] = useState({ from: null, to: null });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState([]);
  const [halls, setHalls] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter halls based on selected office
  const filteredHalls = selectedOffice === 'all'
    ? halls
    : halls.filter(hall => hall.office_name === selectedOffice);

  const officeOptions = [
    { value: 'all', label: 'All Offices' },
    ...[...new Set(halls.map(hall => hall.office_name).filter(Boolean))].map(office => ({
      value: office,
      label: office
    }))
  ];

  // Format date to YYYY-MM-DD consistently
  const formatDateToAPI = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Load all halls when component mounts
  useEffect(() => {
    const loadHalls = async () => {
      try {
        const data = await fetchAllHalls();
        setHalls(data);
      } catch (error) {
        console.error('Error loading halls:', error);
        setError('Failed to load halls. Please try again later.');
      }
    };
    
    loadHalls();
  }, []);

  // Load blocked dates when currentMonth or selectedOffice changes
  useEffect(() => {
    loadBlockedDates();
  }, [currentMonth, selectedOffice]);

  // Load blocked dates from backend
  const loadBlockedDates = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Calculate start and end of the current month
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      // Fetch all blocked dates for the current month
      const allBlockedDates = await fetchBlockedDates(
        'all',
        formatDateToAPI(startOfMonth),
        formatDateToAPI(endOfMonth)
      );
      
      // Filter blocked dates to only include halls from the selected office
      const officeHalls = filteredHalls.map(hall => hall.id);
      const filteredBlockedDates = allBlockedDates.filter(bd => 
        officeHalls.includes(bd.hall)
      );
      
      setBlockedDates(filteredBlockedDates);
    } catch (error) {
      console.error('Error loading blocked dates:', error);
      setError('Failed to load blocked dates. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth, filteredHalls]);

  // Function to block dates in the backend
  const blockDatesInBackend = async (startDate, endDate) => {
    if (filteredHalls.length === 0) {
      setError('No halls available for the selected office.');
      return;
    }
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;
    
    const datesToBlock = [];
    const current = new Date(start);
    
    while (current <= end) {
      datesToBlock.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    try {
      setError(null);
      for (const hall of filteredHalls) {
        for (const date of datesToBlock) {
          const dateStr = formatDateToAPI(date);
          await createBlockedDate({
            office: hall.office,
            hall: hall.id,
            blocked_date: dateStr,
            reason: 'Admin blocked'
          });
        }
      }
    } catch (error) {
      console.error('Error blocking date:', error);
      setError('Failed to block some dates. Please try again.');
      throw error;
    }
  };

  // Function to unblock dates in the backend
  const unblockDatesInBackend = async (startDate, endDate) => {
    if (filteredHalls.length === 0) {
      setError('No halls available for the selected office.');
      return;
    }
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;
    
    try {
      setError(null);
      // Get all blocked dates for the selected range
      const allBlockedDates = await fetchBlockedDates(
        'all',
        formatDateToAPI(start),
        formatDateToAPI(end)
      );
      
      // Filter to only include dates for the selected office's halls
      const hallIds = filteredHalls.map(hall => hall.id);
      const blockedDatesToDelete = allBlockedDates.filter(bd => 
        hallIds.includes(bd.hall)
      );
      
      // Delete each blocked date
      for (const blockedDate of blockedDatesToDelete) {
        await deleteBlockedDate(blockedDate.id);
      }
    } catch (error) {
      console.error('Error unblocking date:', error);
      setError('Failed to unblock some dates. Please try again.');
      throw error;
    }
  };

  // Check if a date is blocked for the current view
  const isDateBlocked = (date) => {
    if (!blockedDates || blockedDates.length === 0) return false;
    
    const dateStr = formatDateToAPI(date);
    
    // Check if any hall in the selected office has this date blocked
    return blockedDates.some(blockedDate => blockedDate.blocked_date === dateStr);
  };

  // Check if a date is in the selected range
  const isInSelectedRange = (date) => {
    if (!selectedRange.from) return false;
    if (!selectedRange.to) return date.getTime() === selectedRange.from.getTime();
    return date >= selectedRange.from && date <= selectedRange.to;
  };

  // Check if a date is in the past
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getSelectedRangeStatus = useCallback(() => {
    if (!selectedRange.from) return null;

    const from = new Date(selectedRange.from);
    const to = selectedRange.to ? new Date(selectedRange.to) : from;

    let hasOpen = false;
    let hasBlocked = false;

    const current = new Date(from);
    while (current <= to) {
      if (isDateBlocked(current)) {
        hasBlocked = true;
      } else {
        hasOpen = true;
      }
      current.setDate(current.getDate() + 1);
    }

    return { hasOpen, hasBlocked };
  }, [selectedRange, isDateBlocked]);

  const selectedStatus = getSelectedRangeStatus();

  // Handle date selection
  const handleDateClick = (date) => {
    if (isPastDate(date) || isLoading) return;

    if (selectedRange.from && date.getTime() === selectedRange.from.getTime() && !selectedRange.to) {
      setSelectedRange({ from: null, to: null });
      return;
    }

    if (selectedRange.to && date.getTime() === selectedRange.to.getTime()) {
      setSelectedRange({ from: selectedRange.from, to: null });
      return;
    }

    if (!selectedRange.from) {
      setSelectedRange({ from: date, to: null });
    } else if (!selectedRange.to && date >= selectedRange.from) {
      setSelectedRange({ ...selectedRange, to: date });
    } else {
      setSelectedRange({ from: date, to: null });
    }
  };

  // Handle opening slots for the selected range
  const handleSlotOpen = async () => {
    if (!selectedRange.from) return;

    try {
      setIsLoading(true);
      const from = new Date(selectedRange.from);
      const to = selectedRange.to ? new Date(selectedRange.to) : from;

      await unblockDatesInBackend(from, to);
      await loadBlockedDates();
      setSelectedRange({ from: null, to: null });
    } catch (error) {
      console.error('Error opening slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle blocking slots for the selected range
  const handleSlotBlock = async () => {
    if (!selectedRange.from) return;

    try {
      setIsLoading(true);
      const from = new Date(selectedRange.from);
      const to = selectedRange.to ? new Date(selectedRange.to) : from;

      await blockDatesInBackend(from, to);
      await loadBlockedDates();
      setSelectedRange({ from: null, to: null });
    } catch (error) {
      console.error('Error blocking slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split('T')[0];
      const isSelected = isInSelectedRange(date);
      const isPast = isPastDate(date);
      const isBlocked = isDateBlocked(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={dateKey}
          className={`h-10 flex items-center justify-center rounded-full cursor-pointer transition-all
            ${isPast ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800'}
            ${isSelected ? 'bg-blue-200 ring-2 ring-blue-400' : ''}
            ${isBlocked ? 'bg-gray-300 text-gray-600 font-semibold' : ''}
            ${isToday ? 'ring-2 ring-blue-500' : ''}
            ${!isPast && !isBlocked && !isLoading ? 'hover:bg-blue-100' : ''}
            ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
          `}
          onClick={() => !isLoading && handleDateClick(date)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const prevMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(newMonth);
  };
  
  const nextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(newMonth);
  };
  
  const formatDisplayDate = (date) => date ? date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '';
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-50 md:p-8"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-2 text-3xl font-bold text-center text-gray-800">Slot Management System</h1>
        <p className="mb-8 text-center text-gray-600">Select dates to manage unavailability</p>

        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
            {error}
            <button 
              className="float-right font-bold" 
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex-1 p-6 bg-white shadow-lg rounded-xl">
            <div className="flex items-center justify-between mb-6">
              {/* <h2 className="text-xl font-semibold text-gray-800">Calendar</h2> */}
              {isLoading && (
                <div className="text-sm text-blue-600">Loading...</div>
              )}
            </div>
         
            <div className="grid grid-cols-1 gap-4 mb-6">
              {/* Filter by Office */}
              <div>
                <label className="block mb-2 font-medium text-text-charcoal">Select Office:</label>
                <Select 
                  value={officeOptions.find(option => option.value === selectedOffice)}
                  onChange={(selectedOption) => {
                    setSelectedOffice(selectedOption?.value || 'all');
                  }}
                  options={officeOptions}
                  isClearable={false}
                  isSearchable={true}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      padding: '0.2rem 0',
                      '&:hover': {
                        borderColor: '#d1d5db',
                      },
                    }),
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 text-blue-800 bg-blue-100 rounded-lg">
                Click to Block dates
              </span>

              <div className="flex items-center gap-2">
                <button 
                  onClick={prevMonth} 
                  disabled={isLoading}
                  className="p-2 transition rounded-full hover:bg-background-ivory-white disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold text-gray-800">{monthName}</h3>
                <button 
                  onClick={nextMonth} 
                  disabled={isLoading}
                  className="p-2 transition rounded-full hover:bg-background-ivory-white disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-2 font-medium text-center text-gray-600">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">{generateCalendarDays()}</div>

            <div className="p-4 mt-6 rounded-lg bg-blue-50">
              <p className="mb-2 text-sm text-text-charcoal">
                {selectedRange.from ? `Selected: ${formatDisplayDate(selectedRange.from)}${selectedRange.to ? ` to ${formatDisplayDate(selectedRange.to)}` : ''}` : 'Select a date or range'}
              </p>
              <p className="mb-4 text-sm text-gray-600">
                Click a start date, then an end date to select a range. Click a selected date again to unselect.
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleSlotOpen}
                  disabled={!selectedRange.from || (selectedStatus && !selectedStatus.hasBlocked) || isLoading}
                  className="px-4 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Open Slots
                </button>
                <button
                  onClick={handleSlotBlock}
                  disabled={!selectedRange.from || (selectedStatus && !selectedStatus.hasOpen) || isLoading}
                  className="px-4 py-2 text-white transition bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Block Slots
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-start gap-4 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 border-gray-400 rounded-full"></div>
                <span className="text-sm">Blocked by admin</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded-full"></div>
                <span className="text-sm">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 rounded-full"></div>
                <span className="text-sm">Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SlotManagement;