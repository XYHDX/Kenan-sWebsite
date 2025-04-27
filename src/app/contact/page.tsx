'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Send, Phone, Mail, MapPin, ExternalLink, Loader2 } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/localStorage';

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

interface ContactData {
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  githubUrl?: string;
  showContactForm: boolean;
}

const defaultContactData: ContactData = {
  email: '',
  phone: '',
  location: '',
  showContactForm: true
};

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [contactInfo, _, isLoadingContactInfo] = useLocalStorage<ContactData>(
    STORAGE_KEYS.CONTACT, 
    defaultContactData
  );

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
      // Send data to the API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json() as { 
        success?: boolean; 
        message?: string; 
        error?: string 
      };
      
      if (response.ok && data.success) {
        setSubmitStatus({ success: true, message: data.message || 'Your message has been sent successfully!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus({ 
          success: false, 
          message: data.error || 'Failed to send message. Please try again.' 
        });
      }
    } catch (_error) {
      setSubmitStatus({ success: false, message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-white">
      <Header />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary dark:text-primary">Contact Me</h1>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-12">
              Have a question or want to work together? Feel free to reach out.
            </p>

            {isLoadingContactInfo ? (
              <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary dark:text-primary" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center text-center">
                  <div className="bg-secondary dark:bg-secondary p-4 rounded-full mb-4">
                    <Mail size={28} className="text-secondary-foreground dark:text-secondary-foreground" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email</h2>
                  <a href={`mailto:${contactInfo.email}`} className="text-primary dark:text-primary hover:underline flex items-center break-all">
                    {contactInfo.email || 'Not Available'}
                    <ExternalLink size={16} className="ml-1 flex-shrink-0" />
                  </a>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center text-center">
                  <div className="bg-secondary dark:bg-secondary p-4 rounded-full mb-4">
                    <Phone size={28} className="text-secondary-foreground dark:text-secondary-foreground" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Phone</h2>
                  <a href={`tel:${contactInfo.phone}`} className="text-primary dark:text-primary hover:underline flex items-center">
                    {contactInfo.phone || 'Not Available'}
                    <ExternalLink size={16} className="ml-1 flex-shrink-0" />
                  </a>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center text-center">
                  <div className="bg-secondary dark:bg-secondary p-4 rounded-full mb-4">
                    <MapPin size={28} className="text-secondary-foreground dark:text-secondary-foreground" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Location</h2>
                  <p className="text-gray-700 dark:text-gray-300">{contactInfo.location || 'Not Available'}</p>
                </div>
              </div>
            )}

            {!isLoadingContactInfo && contactInfo.showContactForm && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Send a Message</h2>

                {submitStatus && (
                  <div className={`mb-6 p-4 rounded-md ${submitStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {submitStatus.message}
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:ring-primary focus:border-ring dark:bg-gray-700 dark:text-white`}
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:ring-primary focus:border-ring dark:bg-gray-700 dark:text-white`}
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-ring dark:bg-gray-700 dark:text-white"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:ring-primary focus:border-ring dark:bg-gray-700 dark:text-white`}
                      placeholder="Your message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                    {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <><Send size={18} className="mr-2" /> Send Message</>
                    )}
                  </button>
                </form>
              </div>
            )}
            
            {!isLoadingContactInfo && !contactInfo.showContactForm && (
              <div className="text-center text-gray-500 dark:text-gray-400 italic">Contact form is currently disabled.</div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
