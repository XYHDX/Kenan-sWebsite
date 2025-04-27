'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/localStorage';

interface ContactData {
  email: string;
  phone: string;
  location: string;
}

const defaultContactData: ContactData = {
  email: 'yahyademeriah@gmail.com',
  phone: '+971 58 127 7542',
  location: 'Dubai, UAE'
};

const AboutPage = () => {
  // Use our custom hook to get contact data from localStorage as fallback
  const [localContactData] = useLocalStorage<ContactData>(
    STORAGE_KEYS.CONTACT, 
    defaultContactData
  );
  
  // State for API data
  const [contactData, setContactData] = useState<ContactData>(defaultContactData);
  const [profileData, setProfileData] = useState<{ profileImage?: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch contact and profile data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch contact data
        const contactResponse = await fetch('/api/contact/data');
        if (contactResponse.ok) {
          const data = await contactResponse.json() as ContactData;
          setContactData(data);
        } else {
          // Fallback to localStorage if API fails
          setContactData(localContactData);
        }
        
        // Fetch profile data for the image
        const profileResponse = await fetch('/api/admin/profile', { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (profileResponse.ok) {
          const data = await profileResponse.json() as any;
          if (data && typeof data === 'object' && 'profileImage' in data && data.profileImage) {
            console.log('About: Got profile image from API');
            setProfileData({
              profileImage: data.profileImage
            });
          } else {
            console.log('About: No profile image in API response');
          }
        }
      } catch (error) {
        console.error('Error fetching data for about page:', error);
        // Fallback to localStorage if API fails
        setContactData(localContactData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [localContactData]);

  // Default image path to use if no custom image is set
  const profileImageSrc = profileData.profileImage || '/images/profile-pic.png';

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="flex-grow py-12 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary dark:text-primary">About Me</h1>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-12">
                <div className="p-6 md:p-8 lg:p-10 flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/3 flex justify-center">
                    <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary">
                      <Image 
                        src={profileImageSrc}
                        alt="Yahya Demeriah"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                      />
                    </div>
                  </div>

                  <div className="md:w-2/3">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Yahya Demeriah</h2>
                    <h3 className="text-xl text-primary dark:text-primary font-medium mb-6">IT Engineer & Robotics Specialist</h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center">
                        <Mail size={18} className="text-primary dark:text-primary mr-3" />
                        <a href={`mailto:${contactData.email}`} className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                          {contactData.email}
                        </a>
                      </div>

                      <div className="flex items-center">
                        <Phone size={18} className="text-primary dark:text-primary mr-3" />
                        <a href={`tel:${contactData.phone}`} className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                          {contactData.phone}
                        </a>
                      </div>

                      <div className="flex items-center">
                        <MapPin size={18} className="text-primary dark:text-primary mr-3" />
                        <span className="text-gray-700 dark:text-gray-300">{contactData.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-8">
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Professional Summary</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Highly skilled and innovative IT Engineer with experience in robotics, automation, and software development.
                  Passionate about creating solutions that drive efficiency and technological advancement.
                  Strong problem-solving abilities with a track record of successfully delivering complex technical projects.
                </p>
              </section>

              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Key Skills</h2>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Full-stack web development</li>
                  <li>Robotics programming and control systems</li>
                  <li>Automation solutions</li>
                  <li>Cloud infrastructure</li>
                  <li>Project management</li>
                  <li>Problem-solving and analytical thinking</li>
                </ul>
              </section>

              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Personal Interests</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Outside of my professional work, I enjoy staying up-to-date with emerging technologies,
                  contributing to open-source projects, and participating in hackathons. I'm also passionate
                  about mentoring aspiring engineers and sharing knowledge through technical workshops.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;