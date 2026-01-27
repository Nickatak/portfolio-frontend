'use client';

import { useState } from 'react';
import DateTimePickerSection from './DateTimePickerSection';
import AuthenticationSection from './AuthenticationSection';
import ContactFormSection from './ContactFormSection';

interface ScheduleCallSectionProps {
  onBooking?: () => void;
}

export default function ScheduleCallSection({ onBooking }: ScheduleCallSectionProps) {
  const [useForm, setUseForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedTime, setBookedTime] = useState<string | null>(null);
  const [lastSelectedDate, setLastSelectedDate] = useState<Date | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('');
  const [googleUser, setGoogleUser] = useState<any>(null);

  const handleGoogleSuccess = (credentialResponse: any) => {
    console.log('Login Success:', credentialResponse);
    setGoogleUser(credentialResponse);

    // Decode JWT to extract user info
    if (credentialResponse.credential) {
      try {
        const base64Url = credentialResponse.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const decodedToken = JSON.parse(jsonPayload);

        // Auto-fill form with Google data
        setFirstName(decodedToken.given_name || '');
        setLastName(decodedToken.family_name || '');
        setEmail(decodedToken.email || '');

        // Show the form with pre-filled information
        setUseForm(true);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  };



  const handleBookAnother = () => {
    // Restore the selected date and reset time, then show form again
    setSelectedDate(lastSelectedDate);
    setSelectedTime(null);
    setUseForm(true);
  };

  const handleBookingSuccess = (date: Date, time: string) => {
    // Save the booked date and time
    setLastSelectedDate(date);
    setBookedTime(time);
    // Keep form fields for next booking (no clearing)
    setGoogleUser(null);
  };

  return (
    <div className="glass-effect rounded-xl p-8 border border-zinc-100/50 dark:border-zinc-800/50 flex flex-col mb-16">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Schedule a Call</h2>
      <p className="text-zinc-700 dark:text-zinc-300 mb-6">
        Pick a time that works best for you. I'm available for 30-minute discovery calls to discuss your project or opportunities.
      </p>
      <div className="space-y-6">
        {/* Date/Time Picker - Always Visible */}
        <DateTimePickerSection
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          bookedTime={bookedTime}
        />

        {/* Authentication or Form Section */}
        {useForm ? (
          <ContactFormSection
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            topic={topic}
            setTopic={setTopic}
            onReset={handleBookAnother}
            onBack={() => setUseForm(false)}
            onBookingSuccess={handleBookingSuccess}
          />
        ) : selectedDate && selectedTime ? (
          <AuthenticationSection onUseForm={() => setUseForm(true)} onGoogleSuccess={handleGoogleSuccess} />
        ) : null}
      </div>
    </div>
  );
}
