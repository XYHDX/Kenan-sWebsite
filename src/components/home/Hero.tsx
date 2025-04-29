'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { STORAGE_KEYS } from '@/lib/localStorage';
import useLocalStorage from '@/hooks/useLocalStorage';

interface ProfileData {
  name: string;
  title: string;
  summary: string;
  email?: string;
  phone?: string;
  location?: string;
  profileImage?: string;
}

const Hero = () => {
  // Default profile data
  const defaultProfile: ProfileData = {
    name: 'Kenan Younes Saoud',
    title: 'Doctor of Dental Surgery',
    summary: 'Specialized dental surgeon with PhD degree and extensive experience in oral and maxillofacial surgery (OMFS) and dental implantology.',
    email: 'kenan.saoud@outlook.com',
    phone: '09639666005656',
    location: 'Damascus - Syria',
    profileImage: '/images/profile-pic.png'
  };

  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfile);
  
  // Use our custom hook to get profile data from localStorage as fallback
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [localProfileData] = useLocalStorage<ProfileData>(
    STORAGE_KEYS.PROFILE,
    defaultProfile
  );

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch('/api/admin/profile', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (response.ok) {
          const data = await response.json() as Partial<ProfileData>;
          console.log('Hero: Fetched profile data from API', data ? Object.keys(data) : 'empty data');
          
          if (data && typeof data === 'object' && 'name' in data && data.name) {
            setProfileData(data as ProfileData);
          } else {
            console.log('Hero: API returned empty data, using localStorage fallback');
            setProfileData(localProfileData);
          }
        } else {
          console.log('Hero: API request failed, using localStorage fallback');
          setProfileData(localProfileData);
        }
      } catch (error) {
        console.error('Hero: Error fetching profile data:', error);
        setProfileData(localProfileData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [localProfileData]);

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Use profileImage from API if available, otherwise use default
  const profileImageSrc = profileData.profileImage || '/images/profile-pic.png';
  console.log('Hero: Using profile image:', profileImageSrc);

  return (
    <section className="py-12 md:py-20 bg-secondary dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Profile Image */}
          <div className="w-full md:w-2/5 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
              <Image
                src={profileImageSrc}
                alt={profileData.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Hero Content */}
          <div className="w-full md:w-3/5 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              {profileData.name}
            </h1>
            <h2 className="text-xl md:text-2xl text-primary font-medium mb-6">
              {profileData.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 max-w-2xl">
              {profileData.summary}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link 
                href="/contact" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors"
              >
                Contact Me
              </Link>
              <Link 
                href="/experience" 
                className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-primary border border-primary px-6 py-3 rounded-md font-medium transition-colors"
              >
                View Experience
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
