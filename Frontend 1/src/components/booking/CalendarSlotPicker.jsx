// CalendarSlotPicker.jsx
import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfWeekMonday(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // 0 => Monday
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

const CalendarSlotPicker = ({ selectedDate, setSelectedDate }) => {
  const [monthCursor, setMonthCursor] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  const { gridDays, monthLabel } = useMemo(() => {
    const firstOfMonth = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
    const lastOfMonth = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0);

    const gridStart = startOfWeekMonday(firstOfMonth);
    // ensure 6 rows like spreadsheet
    const totalCells = 42;
    const days = Array.from({ length: totalCells }).map((_, i) => {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      return d;
    });

    return {
      gridDays: days,
      monthLabel: `${firstOfMonth.toLocaleString('default', { month: 'long' })} ${firstOfMonth.getFullYear()}`,
    };
  }, [monthCursor]);

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm tracking-wide uppercase text-gray-600">Slot Date</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              setMonthCursor(
                new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1)
              )
            }
            className="p-1 rounded hover:bg-background-ivory-white"
            aria-label="Previous Month"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() =>
              setMonthCursor(
                new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1)
              )
            }
            className="p-1 rounded hover:bg-background-ivory-white"
            aria-label="Next Month"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center mb-2">
        <div className="text-sm font-semibold text-gray-800">{monthLabel}</div>
      </div>

      <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500">
        {dayNames.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mt-1">
        {gridDays.map((d, idx) => {
          const inMonth = d.getMonth() === monthCursor.getMonth();
          const isSelected = sameDay(d, selectedDate);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedDate(new Date(d))}
              className={`h-9 rounded-md text-sm
                ${inMonth ? 'hover:bg-background-ivory-white' : 'text-gray-300'}
                ${isSelected ? 'bg-secondary-royal-gold text-white hover:bg-secondary-royal-gold' : ''}
              `}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarSlotPicker;
