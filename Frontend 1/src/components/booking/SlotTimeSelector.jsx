// SlotTimeSelector.jsx
import React, { useMemo, useState } from 'react';

const to12h = (h, m) => {
  const hours24 = h;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const h12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const mm = String(m).padStart(2, '0');
  return `${h12}:${mm} ${ampm}`;
};

// Create half-hour slots across the day like the sheet (3:30 AM .. 11:30 PM etc.)
function generateSlots() {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const start = to12h(h, m);
      let h2 = h;
      let m2 = m + 30;
      if (m2 >= 60) {
        h2 = (h2 + 1) % 24;
        m2 = 0;
      }
      const end = to12h(h2, m2);
      slots.push(`${start} - ${end}`);
    }
  }
  return slots;
}

const ALL_SLOTS = generateSlots();

/**
 * Props:
 * - selectedDate (Date)
 * - selectedSlot (string "HH:MM AM - HH:MM AM")
 * - setSelectedSlot (fn)
 * - bookedSlots (array of objects with slot_time and status) optional to disable
 */
const SlotTimeSelector = ({
  selectedDate,
  selectedSlot,
  setSelectedSlot,
  bookedSlots = [], // pass from API for date+hall
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [slotToBook, setSlotToBook] = useState(null);
  const todayLabel = useMemo(() => selectedDate.toDateString(), [selectedDate]);

  // Function to get booking status for a slot
  const getBookingStatus = (slotLabel) => {
    const booking = bookedSlots.find(booking => booking.slot_time === slotLabel);
    return booking ? booking.status : null;
  };

  // Function to get CSS classes based on booking status
  const getSlotClasses = (slotLabel, isSelected) => {
    const status = getBookingStatus(slotLabel);
    
    if (status === 'Approved') {
      // Grey for approved bookings
      return 'bg-gray-300 text-text-charcoal cursor-not-allowed';
    } else if (status === 'Pending') {
      // Yellow for pending bookings - now clickable
      return 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300 cursor-pointer relative';
    } else if (status) {
      // Red for other booked slots (backward compatibility)
      return 'bg-red-100 text-red-500 cursor-not-allowed';
    } else {
      // Available slots
      return 'bg-green-10 text-green-800 hover:bg-green-200 cursor-pointer';
    }
  };

  // Handle slot click with confirmation for pending slots
  const handleSlotClick = (slotLabel) => {
    const status = getBookingStatus(slotLabel);
    
    // If it's an approved slot, don't allow booking
    if (status === 'Approved') {
      return;
    }
    
    // If it's a pending slot, show confirmation
    if (status === 'Pending') {
      setSlotToBook(slotLabel);
      setShowConfirmation(true);
    } else {
      // For available slots, just select
      setSelectedSlot(slotLabel);
    }
  };

  // Confirm booking for a pending slot
  const confirmBooking = () => {
    if (slotToBook) {
      setSelectedSlot(slotToBook);
      setShowConfirmation(false);
      setSlotToBook(null);
    }
  };

  // Cancel booking confirmation
  const cancelBooking = () => {
    setShowConfirmation(false);
    setSlotToBook(null);
  };

  return (
    <div className="p-4 bg-white border rounded-lg h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm tracking-wide uppercase text-gray-600">
          Slot Time
        </h3>
        <div className="text-xs text-gray-500">For: {todayLabel}</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[420px] overflow-auto pr-1">
        {ALL_SLOTS.map((label) => {
          const status = getBookingStatus(label);
          const isApproved = status === 'Approved';
          const isSelected = selectedSlot === label;
          const isPending = status === 'Pending';
          
          // Create title text for the button
          let titleText = label;
          if (isPending) {
            titleText += " - Already booked by someone. Click to book anyway.";
          } else if (isApproved) {
            titleText += " - Already approved.";
          }
          
          return (
            <button
              key={label}
              type="button"
              onClick={() => handleSlotClick(label)}
              disabled={isApproved}
              className={`px-2 py-2 rounded-md text-xs font-medium text-center transition
                ${getSlotClasses(label, isSelected)}
                ${isSelected ? '!bg-secondary-royal-gold text-white ring-2 ring-blue-500' : ''}
                ${isPending ? 'group' : ''}
              `}
              title={titleText}
            >
              <span className="relative">
                {label}
                {isPending && (
                  <span className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-yellow-400 bg-opacity-90 text-xs text-yellow-900 font-bold rounded-md p-1">
                    Click to book anyway
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Confirm Booking</h3>
            <p className="mb-4">
              This time slot is already booked by someone else. Are you sure you want to proceed with the booking?
              The admin will decide whether to approve or reject your booking.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelBooking}
                className="px-4 py-2 text-gray-600 hover:bg-background-ivory-white rounded-md transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="px-4 py-2 bg-secondary-royal-gold text-white rounded-md hover:bg-accent-champagne transition"
              >
                Book Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-4 text-xs">
        <div className="flex items-center">
          <span className="w-3.5 h-3.5 rounded-full bg-green-10 border mr-2" /> Available
        </div>
        <div className="flex items-center">
          <span className="w-3.5 h-3.5 rounded-full bg-yellow-200 border mr-2" /> Pending
        </div>
        <div className="flex items-center">
          <span className="w-3.5 h-3.5 rounded-full bg-gray-300 border mr-2" /> Approved
        </div>
        <div className="flex items-center">
          <span className="w-3.5 h-3.5 rounded-full bg-secondary-royal-gold border mr-2" /> Selected
        </div>
      </div>
    </div>
  );
};

export default SlotTimeSelector;
