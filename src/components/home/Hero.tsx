'use client';

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
}

const Hero = () => {
  // Default profile data
  const defaultProfile: ProfileData = {
    name: 'Yahya Demeriah',
    title: 'IT Engineer & Robotics Specialist',
    summary: 'Results-driven professional with over 3 years of experience leading teams, designing robotic systems, and optimizing IT infrastructures. Passionate about innovation and technology education.'
  };

  // Use our custom hook to get profile data
  const [profileData, _, isLoading] = useLocalStorage<ProfileData>(
    STORAGE_KEYS.PROFILE,
    defaultProfile
  );

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-gradient-to-r from-blue-50 to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Profile Image */}
          <div className="w-full md:w-2/5 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <Image
                src="/images/profile-pic.png"
                alt={profileData.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Hero Content */}
          <div className="w-full md:w-3/5 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              {profileData.name}
            </h1>
            <h2 className="text-xl md:text-2xl text-blue-600 font-medium mb-6">
              {profileData.title}
            </h2>
            <p className="text-gray-700 text-lg mb-8 max-w-2xl">
              {profileData.summary}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link 
                href="/contact" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Contact Me
              </Link>
              <Link 
                href="/experience" 
                className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 px-6 py-3 rounded-md font-medium transition-colors"
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
