'use client';

import { useState, useEffect } from 'react';
import { formatDateDisplay, convertPSTToLocal, extractTimeFromISO } from './utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

interface TimeSlot {
  time: string;
  pstTime: string;
  available: boolean;
}

interface DateTimePickerSectionProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
  bookedTime?: string | null;
}

export default function DateTimePickerSection({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  bookedTime,
}: DateTimePickerSectionProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [previouslyBookedTimes, setPreviouslyBookedTimes] = useState<any[]>([]);

  // Generate initial time slots (without availability data)
  const generateInitialTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 10; hour < 18; hour++) {
      for (let minute of [0, 30]) {
        const pstTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const localTime = convertPSTToLocal(hour, minute);
        slots.push({
          time: localTime,
          pstTime,
          available: true,
        });
      }
    }
    return slots;
  };

  // Update availability based on booked times
  const updateSlotAvailability = (slots: TimeSlot[], bookedTimes: any[], justBookedTime: string | null) => {
    return slots.map((slot) => {
      const isBooked = bookedTimes.some((bookedTime) => {
        const timeFromDatetime = extractTimeFromISO(bookedTime.datetime);
        return timeFromDatetime === slot.pstTime;
      });
      const isJustBooked = justBookedTime === slot.time;
      return {
        ...slot,
        available: !isBooked && !isJustBooked,
      };
    });
  };

  // Fetch booked timeslots for selected date
  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([]);
      setPreviouslyBookedTimes([]);
      return;
    }

    // Initialize slots on date change
    setTimeSlots(generateInitialTimeSlots());
    setIsLoadingSlots(true);

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`; // Format as YYYY-MM-DD in local timezone
    fetch(`${API_BASE_URL}/api/timeslots/by-day?date=${formattedDate}`)
      .then((res) => res.json())
      .then((bookedTimes) => {
        console.log(bookedTimes);
        setPreviouslyBookedTimes(bookedTimes);
        setTimeSlots((prevSlots) => updateSlotAvailability(prevSlots, bookedTimes, bookedTime ?? null));
      })
      .catch((error) => {
        console.error('Error fetching timeslots:', error);
      })
      .finally(() => {
        setIsLoadingSlots(false);
      });
  }, [selectedDate]);

  // Update availability when bookedTime changes (preserve previously booked times)
  useEffect(() => {
    setTimeSlots((prevSlots) => updateSlotAvailability(prevSlots, previouslyBookedTimes, bookedTime ?? null));
  }, [bookedTime, previouslyBookedTimes]);
  const today = new Date();
  const nextDays = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    return date;
  });

  // Group dates by month for visual organization
  const datesByMonth = nextDays.reduce((acc, date) => {
    const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(date);
    return acc;
  }, {} as Record<string, Date[]>);

  return (
    <div className="space-y-6">
      {/* Date Picker */}
      <div>
        <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-3">
          Select Date
        </label>
        {Object.entries(datesByMonth).map(([month, dates]) => (
          <div key={month} className="mb-6">
            <h3 className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-3">
              {month}
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
              {dates.map((date, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`py-3 px-2 rounded-lg font-medium transition-all duration-200 text-center ${
                    selectedDate?.toDateString() === date.toDateString()
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  <div className="text-xs opacity-75">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-sm">{date.getDate()}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Time Picker */}
      {selectedDate && (
        <div>
          <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-3">
            Select Time ({formatDateDisplay(selectedDate)}) - Times below are shown in your timezone
          </label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
            {timeSlots.map((slot) => (
              <button
                key={slot.pstTime}
                onClick={() => setSelectedTime(slot.time)}
                disabled={!slot.available}
                className={`py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
                  !slot.available
                    ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 cursor-not-allowed'
                    : selectedTime === slot.time
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
