'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Header />
      <main className="flex-grow py-12 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12 text-primary dark:text-primary">About Me</h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-12">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3 flex justify-center">
                <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <Image
                    src="/images/profile-pic.png"
                    alt="Yahya Demeriah"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="md:w-2/3">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Yahya Demeriah</h2>
                <h3 className="text-xl text-primary dark:text-primary font-medium mb-6">IT Engineer & Robotics Specialist</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Mail size={18} className="text-primary dark:text-primary mr-3" />
                    <a href="mailto:yahyademeriah@gmail.com" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                      yahyademeriah@gmail.com
                    </a>
                  </div>

                  <div className="flex items-center">
                    <Phone size={18} className="text-primary dark:text-primary mr-3" />
                    <a href="tel:+971581277542" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                      +971 58 127 7542
                    </a>
                  </div>

                  <div className="flex items-center">
                    <MapPin size={18} className="text-primary dark:text-primary mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Dubai, UAE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-900 dark:text-white">
              <User size={24} className="mr-2 text-primary dark:text-primary" />
              Professional Summary
            </h2>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 md:p-8">
              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                <p className="mb-4">
                  As a Co-founder and CTO at RoboTronics, I&apos;ve spearheaded the launch of Syria&apos;s first solar panel
                  cleaning robot, enhancing renewable energy maintenance solutions. I&apos;ve also managed the design
                  and production of PCBs and 3D printed parts, optimizing manufacturing processes for efficiency
                  and cost-effectiveness.
                </p>

                <p className="mb-4">
                  In my role as a Full-Time Lecturer at Syrian Private University, I develop and instruct lab
                  courses including ROS, MATLAB, Proteus, Processing, 8086 Emulator, mikroC, and Arduino C.
                  I also mentor junior projects, guiding students in project design, implementation, and technical
                  presentation.
                </p>

                <p>
                  I&apos;m passionate about robotics education and developing next-generation technology solutions.
                  My experience in mentoring teams for competitions like ARC, WRO, and Future Science Challenge
                  has allowed me to share my knowledge and help develop the next generation of engineers and
                  robotics specialists.
                </p>

                <p className="mb-4">
                  I believe in a hands-on, practical approach to engineering and robotics. My methodology combines
                  theoretical knowledge with real-world application, ensuring that solutions are not only technically
                  sound but also practical and efficient.
                </p>

                <p className="mb-4">
                  Cross-functional collaboration is at the heart of my work philosophy. I enjoy working with diverse
                  teams to bring different perspectives and expertise to solve complex problems. This collaborative
                  approach has been particularly effective in my roles at SEE (Syrian Engineers Expo) and RoboTronics.
                </p>

                <p>
                  I&apos;m committed to continuous learning and staying at the forefront of technological advancements.
                  This commitment drives me to constantly expand my skills and knowledge, allowing me to bring
                  innovative solutions to every project I undertake.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;