# Contact Page Test Suite

## Overview
Comprehensive test suite for the ScheduleCallSection component and its sub-components, covering all specified requirements and edge cases.

## Test Files Created

### 1. `src/components/ScheduleCallSection/__tests__/ScheduleCallSection.test.tsx`
Tests for the main ScheduleCallSection component that manages the entire booking flow.

**Key Test Groups:**
- **Initial State**: Verifies no date/time is selected on page load
- **Date Selection & Time Visibility**: Confirms time slots appear after date selection
- **Form/OAuth Prompt**: Validates authentication section appears after both date and time are selected
- **Form vs OAuth Flow**: Tests switching between form and Google authentication
- **Booking & Rebooking**: Verifies the booking flow and ability to book multiple appointments
- **State Preservation**: Ensures user information is maintained during rebooking

**Total Tests: 9 passing**

### 2. `src/components/ScheduleCallSection/__tests__/DateTimePickerSection.test.tsx`
In-depth tests for the DateTimePickerSection component, including API mocking.

**Key Test Groups:**

1. **Initial State**
   - ✓ No date selected on page load
   - ✓ No time selected on page load

2. **Date Selection Triggers API Fetch**
   - ✓ Fetches available time slots when date is selected
   - ✓ Uses correct date format (YYYY-MM-DD) for API calls
   - ✓ Handles API errors gracefully

3. **Time Slots Visibility**
   - ✓ Displays time slot choices after date selection
   - ✓ Doesn't show time picker without a date
   - ✓ Shows all 16 time slots (10am-5:30pm in 30-min intervals)

4. **Booked Time Slots**
   - ✓ Marks booked time slots as unavailable
   - ✓ **Preserves previously booked times when rebooking** (addresses the original bug fix)

5. **Time Selection**
   - ✓ Allows selecting available time slots
   - ✓ Prevents selecting booked time slots

6. **Edge Cases**
   - ✓ Handles date changes by fetching new time slots
   - ✓ Clears time slots when date is deselected

**Total Tests: 14 passing**

## Test Coverage Summary

| Requirement | Test | Status |
|-------------|------|--------|
| 1. No date/time on initial load | `Test 1: Initial State` | ✅ Passing |
| 2. Fetch time slots on date selection | `Test 2: Date Selection Triggers API Fetch` | ✅ Passing |
| 3. Display time choices after date selection | `Test 3: Time Slots Visibility` | ✅ Passing |
| 4. Show form/OAuth prompt after time selection | `Test 4: Form/OAuth Prompt After Time Selection` | ✅ Passing |

## Running the Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run specific test file
npm test -- DateTimePickerSection.test
npm test -- ScheduleCallSection.test
```

## Key Features Tested

- ✅ Initial state validation
- ✅ API integration with mocked fetch calls
- ✅ Component visibility based on user actions
- ✅ Time slot availability management
- ✅ Previously booked times persistence (bug fix verification)
- ✅ User flow from date/time selection to authentication
- ✅ Form submission and rebooking capability
- ✅ Error handling

## Test Configuration

- **Framework**: Jest
- **Testing Library**: React Testing Library
- **User Interaction**: @testing-library/user-event
- **Environment**: jest-environment-jsdom

Configuration files created:
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Jest setup file with testing-library matchers
