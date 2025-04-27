'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
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
  showContactForm: boolean;
}

const defaultContactData: ContactData = {
  email: '',
  phone: '',
  location: '',
  showContactForm: true
};

const Contact = () => {
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
    <section className="py-12 bg-secondary dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Get In Touch</h2>
        
        {isLoadingContactInfo ? (
          <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
        ) : (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 p-6 md:p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Contact Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-secondary dark:bg-gray-600 p-3 rounded-full mr-4">
                    <Mail size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Email</h4>
                    <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline break-all">
                      {contactInfo.email || 'Not Available'}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-secondary dark:bg-gray-600 p-3 rounded-full mr-4">
                    <Phone size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Phone</h4>
                    <a href={`tel:${contactInfo.phone}`} className="text-primary hover:underline">
                      {contactInfo.phone || 'Not Available'}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-secondary dark:bg-gray-600 p-3 rounded-full mr-4">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Location</h4>
                    <p className="text-gray-700 dark:text-gray-300">{contactInfo.location || 'Not Available'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form (Conditional) */}
            {contactInfo.showContactForm ? (
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 p-6 md:p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Send a Message</h3>
                
                {submitStatus && (
                  <div className={`mb-6 p-4 rounded-md ${submitStatus.success ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                    {submitStatus.message}
                  </div>
                )}
                
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">
                      Name <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-500'} rounded-md focus:ring-primary focus:border-primary dark:bg-gray-600 dark:text-white`}
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">
                      Email <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-500'} rounded-md focus:ring-primary focus:border-primary dark:bg-gray-600 dark:text-white`}
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-600 dark:text-white"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">
                      Message <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className={`w-full px-4 py-2 border ${errors.message ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-500'} rounded-md focus:ring-primary focus:border-primary dark:bg-gray-600 dark:text-white`}
                      placeholder="Your message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                    {errors.message && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.message}</p>}
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center disabled:opacity-70"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={16} className="ml-2" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 p-6 md:p-8 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400 italic text-center">The contact form is currently disabled. Please use the contact details provided.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
