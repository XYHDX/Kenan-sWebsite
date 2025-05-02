'use client'; // This stays, because you're using hooks

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Raleway } from 'next/font/google';
import './globals.css';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/localStorage';
import { applyTheme } from '@/lib/themeUtils';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteLanguage: string;
  enableDarkMode: boolean;
  enableSEO: boolean;
  customTheme: string;
  maintenanceMode: boolean;
}

const defaultSettings: SiteSettings = {
  siteName: 'Kenan Younes Saoud - CV',
  siteDescription: 'The personal CV website for Kenan Younes Saoud.',
  siteLanguage: 'en',
  enableDarkMode: false,
  enableSEO: true,
  customTheme: 'blue',
  maintenanceMode: false,
};

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '600', '700'],
});

// Simple Maintenance Component
const MaintenancePage = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' }}>
    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Under Maintenance</h1>
    <p style={{ color: '#4b5563' }}>This site is currently undergoing scheduled maintenance. Please check back later.</p>
  </div>
);

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [settings, _, isLoadingSettings] = useLocalStorage<SiteSettings>(
    STORAGE_KEYS.SETTINGS,
    defaultSettings
  );

  useEffect(() => {
    if (!isLoadingSettings) {
      // Update document metadata
      document.documentElement.lang = settings.siteLanguage || defaultSettings.siteLanguage;
      document.title = settings.siteName || defaultSettings.siteName;

      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', settings.siteDescription || defaultSettings.siteDescription);

      let metaRobots = document.querySelector('meta[name="robots"]');
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', settings.enableSEO ? 'index, follow' : 'noindex, nofollow');

      // Apply theme using the utility function
      const customTheme = settings.customTheme || defaultSettings.customTheme;
      applyTheme(customTheme);
    }
  }, [settings, isLoadingSettings]);

  const themeClass = settings.customTheme ? `theme-${settings.customTheme}` : `theme-${defaultSettings.customTheme}`;
  const darkModeClass = settings.enableDarkMode ? "dark" : "";
  const combinedClasses = `${themeClass} ${darkModeClass}`.trim();

  if (!isLoadingSettings && settings.maintenanceMode && pathname && !pathname.startsWith('/admin')) {
    return (
      <html 
        lang={settings.siteLanguage || defaultSettings.siteLanguage} 
        className={combinedClasses}
        suppressHydrationWarning
      >
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    const storedSettings = localStorage.getItem('site_settings');
                    let theme = 'blue'; // Default theme
                    if (storedSettings) {
                      const settings = JSON.parse(storedSettings);
                      if (settings && settings.customTheme) {
                        theme = settings.customTheme;
                      }
                    }
                    const themeClassName = 'theme-' + theme;
                    // Add the theme class to the html element
                    document.documentElement.classList.add(themeClassName);

                    // Also handle dark mode based on localStorage setting
                    if (storedSettings) {
                       const settings = JSON.parse(storedSettings);
                       if (settings && settings.enableDarkMode) {
                         document.documentElement.classList.add('dark');
                       } else {
                         // Optional: explicitly remove dark if it's disabled
                         document.documentElement.classList.remove('dark');
                       }
                    } else {
                      // Default behavior if no settings found (matches defaultSettings)
                      // document.documentElement.classList.add('dark'); // Removed default dark
                    }

                  } catch (error) {
                    console.error('Error applying theme from localStorage:', error);
                    // Apply default theme and remove dark mode as fallback
                    document.documentElement.classList.add('theme-blue');
                    // document.documentElement.classList.add('dark'); // Removed fallback dark
                  }
                })();
              `,
            }}
          />
        </head>
        <body className={`${raleway.variable} antialiased`}>
          <MaintenancePage />
        </body>
      </html>
    );
  }

  return (
    <html 
      lang={settings.siteLanguage || defaultSettings.siteLanguage} 
      className={combinedClasses}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Inline script to set theme from localStorage */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedSettings = localStorage.getItem('site_settings');
                  let theme = 'blue'; // Default theme
                  if (storedSettings) {
                    const settings = JSON.parse(storedSettings);
                    if (settings && settings.customTheme) {
                      theme = settings.customTheme;
                    }
                  }
                  const themeClassName = 'theme-' + theme;
                  // Add the theme class to the html element
                  document.documentElement.classList.add(themeClassName);

                  // Also handle dark mode based on localStorage setting
                  if (storedSettings) {
                     const settings = JSON.parse(storedSettings);
                     if (settings && settings.enableDarkMode) {
                       document.documentElement.classList.add('dark');
                     } else {
                       // Optional: explicitly remove dark if it's disabled
                       document.documentElement.classList.remove('dark');
                     }
                  } else {
                    // Default behavior if no settings found (matches defaultSettings)
                    // document.documentElement.classList.add('dark'); // Removed default dark
                  }

                } catch (error) {
                  console.error('Error applying theme from localStorage:', error);
                  // Apply default theme and remove dark mode as fallback
                  document.documentElement.classList.add('theme-blue');
                  // document.documentElement.classList.add('dark'); // Removed fallback dark
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${raleway.variable} antialiased`}>
        {!isLoadingSettings ? children : null}
      </body>
    </html>
  );
}
