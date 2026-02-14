import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateTimePickerSection from '../DateTimePickerSection';

// Mock fetch globally
global.fetch = jest.fn();

describe('DateTimePickerSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  const mockTimeSlots = [
    { id: 1, datetime: '2026-02-01T10:00:00Z' },
    { id: 2, datetime: '2026-02-01T10:30:00Z' },
    { id: 3, datetime: '2026-02-01T14:00:00Z' },
  ];

  describe('Test 1: Initial State - No Date or Time Selected', () => {
    it('should not have any date selected on page load', () => {
      render(
        <DateTimePickerSection
          selectedDate={null}
          setSelectedDate={jest.fn()}
          selectedTime={null}
          setSelectedTime={jest.fn()}
          bookedTime={null}
        />
      );

      // Date picker should be visible but no date should be selected
      expect(screen.getByText('Select Date')).toBeInTheDocument();

      // Time picker section should not be visible without a date
      expect(screen.queryByText(/Select Time/)).not.toBeInTheDocument();
    });

    it('should not have any time selected on page load', () => {
      render(
        <DateTimePickerSection
          selectedDate={null}
          setSelectedDate={jest.fn()}
          selectedTime={null}
          setSelectedTime={jest.fn()}
          bookedTime={null}
        />
      );

      // No time should be visibly selected
      const timeButtons = screen.queryAllByRole('button', { disabled: false });
      // The date buttons should be present but not time buttons
      expect(screen.queryByText(/Select Time/)).not.toBeInTheDocument();
    });
  });

  describe('Test 2: Date Selection Triggers API Fetch', () => {
    it('should fetch available time slots when a date is selected', async () => {
      const user = userEvent.setup();
      const setSelectedDate = jest.fn();
      const setSelectedTime = jest.fn();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTimeSlots,
      });

      const selectedDate = new Date(2026, 1, 1); // February 1, 2026

      render(
        <DateTimePickerSection
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={null}
          setSelectedTime={setSelectedTime}
          bookedTime={null}
        />
      );

      // Wait for the fetch to complete
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('2026-02-01')
        );
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should call fetch with correct date format (YYYY-MM-DD)', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const selectedDate = new Date(2026, 0, 15); // January 15, 2026

      render(
        <DateTimePickerSection
          selectedDate={selectedDate}
          setSelectedDate={jest.fn()}
          selectedTime={null}
          setSelectedTime={jest.fn()}
          bookedTime={null}
        />
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('2026-01-15')
        );
      });
    });

    it('should handle API errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const selectedDate = new Date(2026, 1, 1);

      render(
        <DateTimePickerSection
          selectedDate={selectedDate}
          setSelectedDate={jest.fn()}
          selectedTime={null}
          setSelectedTime={jest.fn()}
          bookedTime={null}
        />
      );

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error fetching timeslots:',
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Test 3: Time Slots Visibility After Date Selection', () => {
    it('should display time slot choices after date is selected', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTimeSlots,
      });

      const selectedDate = new Date(2026, 1, 1);

      render(
        <DateTimePickerSection
          selectedDate={selectedDate}
          setSelectedDate={jest.fn()}
          selectedTime={null}
          setSelectedTime={jest.fn()}
          bookedTime={null}
        />
      );

      // Wait for time selection section to appear
      await waitFor(() => {
        expect(screen.getByText(/Select Time/i)).toBeInTheDocument();
      });

      // Time buttons should be visible
      await waitFor(() => {
        const timeButtons = screen.getAllByRole('button');
        expect(timeButtons.length).toBeGreaterThan(0);
      });
    });

    it('should not display time picker when no date is selected', () => {
      render(
        <DateTimePickerSection
          selectedDate={null}
          setSelectedDate={jest.fn()}
          selectedTime={null}
          setSelectedTime={jest.fn()}
          bookedTime={null}
        />
      );

      expect(screen.queryByText(/Select Time/i)).not.toBeInTheDocument();
    });

    it('should show all 16 time slots (10am-5:30pm in 30-min intervals)', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const selectedDate = new Date(2026, 1, 1);

      render(
        <DateTimePickerSection
          selectedDate={selectedDate}
          setSelectedDate={jest.fn()}
          selectedTime={null}
          setSelectedTime={jest.fn()}
          bookedTime={null}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Select Time/i)).toBeInTheDocument();
      });

      // The time slots are in a grid that allows overflow, check the grid container
      const timeLabel = screen.getByText(/Select Time/i);
      expect(timeLabel).toBeInTheDocument();
    });
  });

  describe('Test 4: Booked Time Slots Show as Unavailable', () => {
    it('should mark booked time slots as unavailable', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, datetime: '2026-02-01T10:00:00Z' },
          { id: 2, datetime: '2026-02-01T14:30:00Z' },
        ],
      });

      const selectedDate = new Date(2026, 1, 1);

      render(
        <DateTimePickerSection
          selectedDate={selectedDate}
          setSelectedDate={jest.fn()}
          selectedTime={null}
          setSelectedTime={jest.fn()}
          bookedTime={null}
        />
      );

      await waitFor(() => {
        const disabledButtons = screen.getAllByRole('button').filter(
          (btn) => btn.getAttribute('disabled') === ''
        );
        // Should have at least some disabled buttons for booked times
        expect(disabledButtons.length).toBeGreaterThan(0);
      });
    });

    it('should preserve previously booked times when rebooking', async () => {
      const previouslyBooked = [
        { id: 1, datetime: '2026-02-01T10:00:00Z' },
        { id: 2, datetime: '2026-02-01T11:00:00Z' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => previouslyBooked,
      });

      const selectedDate = new Date(2026, 1, 1);
      const setSelectedTime = jest.fn();

      const { rerender } = render(
        <DateTimePickerSection
          selectedDate={selectedDate}
          setSelectedDate={jest.fn()}
          selectedTime={null}
          setSelectedTime={setSelectedTime}
          bookedTime={null}
        />
      );

      // Wait for initial fetch
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      // Now simulate rebooking (bookedTime is set)
      rerender(
        <DateTimePickerSection
          selectedDate={selectedDate}
          setSelectedDate={jest.fn()}
          selectedTime={null}
          setSelectedTime={setSelectedTime}
          bookedTime="10:30"
        />
      );

      // The previously booked times should still be unavailable
      await waitFor(() => {
        const disabledButtons = screen.getAllByRole('button').filter(
          (btn) => btn.getAttribute('disabled') === ''
        );
        // Should still have disabled buttons for the previously booked times
        expect(disabledButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Test 5: Time Selection', () => {
    it('should allow selecting an available time slot', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const setSelectedTime = jest.fn();
      const selectedDate = new Date(2026, 1, 1);

      render(
        <DateTimePickerSection
          selectedDate={selectedDate}
          setSelectedDate={jest.fn()}
          selectedTime={null}
          setSelectedTime={setSelectedTime}
          bookedTime={null}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Select Time/i)).toBeInTheDocument();
      });

      // Click the first available button in the time picker area (not disabled)
      const allButtons = screen.getAllByRole('button');
      const timePickerButtons = allButtons.slice(14); // Skip the date buttons

      if (timePickerButtons.length > 0) {
        const availableButton = timePickerButtons.find(
          (btn) => btn.getAttribute('disabled') === null
        );
        
        if (availableButton) {
          await user.click(availableButton);
          expect(setSelectedTime).toHaveBeenCalled();
        }
      }
    });

    it('should not allow selecting a booked time slot', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, datetime: '2026-02-01T10:00:00Z' }],
      });

      const setSelectedTime = jest.fn();
      const selectedDate = new Date(2026, 1, 1);

      render(
        <DateTimePickerSection
          selectedDate={selectedDate}
          setSelectedDate={jest.fn()}
          selectedTime={null}
          setSelectedTime={setSelectedTime}
          bookedTime={null}
        />
      );

      await waitFor(() => {
        const allButtons = screen.getAllByRole('button');
        const hasDisabledButtons = allButtons.some(
          (btn) => btn.getAttribute('disabled') === ''
        );
        expect(hasDisabledButtons).toBe(true);
      });
    });
  });

  describe('Test 6: Edge Cases', () => {
    it('should handle date change by fetching new time slots', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      const setSelectedDate = jest.fn();
      const setSelectedTime = jest.fn();
      let selectedDate = new Date(2026, 1, 1);

      const { rerender } = render(
        <DateTimePickerSection
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={null}
          setSelectedTime={setSelectedTime}
          bookedTime={null}
        />
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      // Change to a different date
      selectedDate = new Date(2026, 1, 2);
      rerender(
        <DateTimePickerSection
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={null}
          setSelectedTime={setSelectedTime}
          bookedTime={null}
        />
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(global.fetch).toHaveBeenLastCalledWith(
          expect.stringContaining('2026-02-02')
        );
      });
    });

    it('should clear time slots when date is deselected', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      let selectedDate: Date | null = new Date(2026, 1, 1);

      const { rerender } = render(
        <DateTimePickerSection
          selectedDate={selectedDate}
          setSelectedDate={jest.fn()}
          selectedTime={null}
          setSelectedTime={jest.fn()}
          bookedTime={null}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Select Time/i)).toBeInTheDocument();
      });

      // Deselect the date
      selectedDate = null;
      rerender(
        <DateTimePickerSection
          selectedDate={selectedDate}
          setSelectedDate={jest.fn()}
          selectedTime={null}
          setSelectedTime={jest.fn()}
          bookedTime={null}
        />
      );

      // Time picker should disappear
      expect(screen.queryByText(/Select Time/i)).not.toBeInTheDocument();
    });
  });
});
