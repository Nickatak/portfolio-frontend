'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import ScheduleCallSection from '@/components/ScheduleCallSection';

interface ContactLink {
  icon: string;
  title: string;
  description: string;
  href: string;
}

interface ContactClientProps {
  contactLinks: ContactLink[];
}

export default function ContactClient({ contactLinks }: ContactClientProps) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <main className="min-h-screen">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-12 md:pt-32 md:pb-20">
          <section className="mb-16 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Let's Talk</h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full mb-6" />
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
              I'm always open to new opportunities and collaborations. Whether you have a project in mind or just want to chat about web development, feel free to reach out.
            </p>
          </section>

          <ScheduleCallSection onBooking={() => {}} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              {contactLinks.map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  target={contact.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={contact.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className="block glass-effect rounded-lg p-6 border border-zinc-100/50 dark:border-zinc-800/50 hover:border-zinc-200/80 dark:hover:border-zinc-700/80 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="text-3xl mb-3 group-hover:animate-float">{contact.icon}</div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">{contact.title}</h3>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {contact.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
    </GoogleOAuthProvider>
  );
}
