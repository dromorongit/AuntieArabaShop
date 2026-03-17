'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface SiteSettings {
  siteLocked: boolean;
  lockHeading: string;
  lockMessage: string;
  enableCountdown: boolean;
  countdownDateTime: string | null;
  backgroundImage: string;
}

export default function LockedPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!settings?.enableCountdown || !settings?.countdownDateTime) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const difference = new Date(settings.countdownDateTime!).getTime() - Date.now();
      
      if (difference <= 0) {
        // Countdown finished - auto unlock
        setTimeLeft(null);
        handleAutoUnlock();
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [settings?.enableCountdown, settings?.countdownDateTime]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/site-settings');
      const data = await response.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoUnlock = async () => {
    try {
      await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteLocked: false }),
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Error auto-unlocking:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  const backgroundImage = settings?.backgroundImage || '/LADYSTANDARD.PNG';
  const heading = settings?.lockHeading || 'We Are Coming Soon';
  const message = settings?.lockMessage || 'We are preparing something extraordinary for you. Stay tuned!';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/80 via-purple-900/80 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl"
        >
          {/* Glassmorphism Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
            {/* Logo */}
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-3xl">A</span>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {heading}
            </h1>

            {/* Message */}
            {message && (
              <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
                {message}
              </p>
            )}

            {/* Countdown Timer */}
            {timeLeft && settings?.enableCountdown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <p className="text-white/60 text-sm uppercase tracking-wider mb-4">
                  We're Coming Back In
                </p>
                <div className="flex justify-center gap-3 md:gap-4">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Minutes', value: timeLeft.minutes },
                    { label: 'Seconds', value: timeLeft.seconds },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 md:p-4 min-w-[70px] md:min-w-[90px]"
                    >
                      <div className="text-2xl md:text-4xl font-bold text-white">
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <div className="text-xs md:text-sm text-white/60 uppercase tracking-wider">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Social Links / Contact */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-white/60 text-sm">
                Follow us on social media for updates
              </p>
              <div className="flex gap-4">
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors border border-white/20"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-white/40 text-sm">
            © {new Date().getFullYear()} Auntie Araba Shop. All rights reserved.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
