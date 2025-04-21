'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Send, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface SubmitStatus {
  success: boolean;
  message: string;
}

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // In a production app, you would send data to your backend here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      setSubmitStatus({ success: true, message: 'Your message has been sent successfully!' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus({ success: false, message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-blue-600">Contact Me</h1>
            <p className="text-gray-600 text-center mb-12">
              Have a question or want to work together? Feel free to reach out.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col items-center text-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Mail size={28} className="text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Email</h2>
                <a href="mailto:yahyademeriah@gmail.com" className="text-blue-600 hover:underline flex items-center">
                  yahyademeriah@gmail.com
                  <ExternalLink size={16} className="ml-1" />
                </a>
              </div>

              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col items-center text-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Phone size={28} className="text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Phone</h2>
                <a href="tel:+971 58 127 7542" className="text-blue-600 hover:underline flex items-center">
                  +971 58 127 7542
                  <ExternalLink size={16} className="ml-1" />
                </a>
              </div>

              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col items-center text-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <MapPin size={28} className="text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Location</h2>
                <p className="text-gray-700">Dubai, UAE</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">Send a Message</h2>

              {submitStatus && (
                <div className={`mb-6 p-4 rounded-md ${submitStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {submitStatus.message}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
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
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Your message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                  {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center disabled:bg-blue-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={18} className="ml-2" />
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
