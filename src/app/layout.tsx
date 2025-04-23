'use client'; // This stays, because you're using hooks

import { useEffect } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/localStorage';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteLanguage: string;
  enableDarkMode: boolean;
}

const defaultSettings: SiteSettings = {
  siteName: 'Yahya Demeriah - CV',
  siteDescription: 'The personal CV website for Yahya Demeriah.',
  siteLanguage: 'en',
  enableDarkMode: true,
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const [settings, _, isLoadingSettings] = useLocalStorage<SiteSettings>(
    STORAGE_KEYS.SETTINGS,
    defaultSettings
  );

  useEffect(() => {
    if (!isLoadingSettings) {
      if (settings.enableDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      document.documentElement.lang = settings.siteLanguage || defaultSettings.siteLanguage;
      document.title = settings.siteName || defaultSettings.siteName;

      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', settings.siteDescription || defaultSettings.siteDescription);
    }
  }, [settings, isLoadingSettings]);

  return (
    <html lang={defaultSettings.siteLanguage} className={defaultSettings.enableDarkMode ? "dark" : ""}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
