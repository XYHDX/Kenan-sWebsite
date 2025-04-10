'use client';

import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Contact Me</h2>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Get In Touch</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Mail size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Email</h4>
                  <a href="mailto:yahyademeriah@gmail.com" className="text-blue-600 hover:underline">
                    yahyademeriah@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Phone size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Phone</h4>
                  <a href="tel:+971 58 127 7542" className="text-blue-600 hover:underline">
                    +971 58 127 7542
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <MapPin size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Location</h4>
                  <p className="text-gray-700">Dubai, UAE</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Send a Message</h3>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Subject"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your message"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
              >
                Send Message <Send size={16} className="ml-2" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
