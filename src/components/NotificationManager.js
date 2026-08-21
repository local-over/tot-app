'use client';

import { useEffect } from 'react';
import { useUser } from '@/context/UserContext';

export default function NotificationManager() {
  const { profile } = useUser();

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    // Request permission if not already granted or denied
    if (Notification.permission === 'default') {
      // Small delay so we don't bombard them instantly
      setTimeout(() => {
        Notification.requestPermission();
      }, 5000);
    }

    if (Notification.permission !== 'granted' || !profile?.readingTime) return;

    // Check reading time preference
    // 'morning' -> 8 AM
    // 'afternoon' -> 1 PM
    // 'night' -> 8 PM

    const checkTimeAndNotify = () => {
      const now = new Date();
      const currentHour = now.getHours();
      
      let targetHour = 8;
      if (profile.readingTime === 'afternoon') targetHour = 13;
      if (profile.readingTime === 'night') targetHour = 20;

      // Check if it is EXACTLY the target hour, and we haven't notified today
      const lastNotified = localStorage.getItem('tot_last_notified');
      const todayStr = now.toLocaleDateString();

      if (currentHour === targetHour && lastNotified !== todayStr) {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('Time to read! 📖', {
              body: 'Your daily TOT is ready. Tap to read it now.',
              icon: '/logo.png',
              badge: '/logo_black.png',
              vibrate: [200, 100, 200]
            });
          });
        } else {
          new Notification('Time to read! 📖', {
            body: 'Your daily TOT is ready. Tap to read it now.',
            icon: '/logo.png',
          });
        }
        localStorage.setItem('tot_last_notified', todayStr);
      }
    };

    // Check immediately, then every 5 minutes
    checkTimeAndNotify();
    const interval = setInterval(checkTimeAndNotify, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [profile]);

  return null;
}
