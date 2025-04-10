'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">Contact Me</h1>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">Get In Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-4 rounded-full mr-4">
                    <Mail size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                    <a href="mailto:yahyademeriah@gmail.com" className="text-blue-600 hover:underline">
                      yahyademeriah@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-4 rounded-full mr-4">
                    <Phone size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                    <a href="tel:+971581277542" className="text-blue-600 hover:underline">
                      +971 58 127 7542
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-4 rounded-full mr-4">
                    <MapPin size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Location</h3>
                    <p className="text-gray-700">Dubai, UAE</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Connect With Me</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://www.linkedin.com/in/yahya-demeriah"
                    className="bg-gray-100 text-gray-700 p-3 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                  </a>
                  <a
                    href="https://github.com/XYHDX"
                    className="bg-gray-100 text-gray-700 p-3 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                    aria-label="GitHub"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                  </a>
                  <a
                    href="https://x.com/yahyadmeriah"
                    className="bg-gray-100 text-gray-700 p-3 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                    aria-label="Twitter"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4.01c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.88-2.37 8.48 8.48 0 0 1-2.7 1.03 4.23 4.23 0 0 0-7.2 3.86A12 12 0 0 1 3 3.86a4.23 4.23 0 0 0 1.31 5.64 4.2 4.2 0 0 1-1.92-.53v.05a4.24 4.24 0 0 0 3.4 4.15 4.24 4.24 0 0 1-1.91.07 4.23 4.23 0 0 0 3.95 2.94A8.5 8.5 0 0 1 2 19.54a12 12 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.35-.01-.53A8.34 8.34 0 0 0 22 4.01z" /></svg>
                  </a>
                  <a
                    href="https://www.instagram.com/yahya.demeriah"
                    className="bg-gray-100 text-gray-700 p-3 rounded-full hover:bg-pink-500 hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">Send a Message</h2>

              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your email"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Subject"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your message"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
                >
                  Send Message <Send size={18} className="ml-2" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
