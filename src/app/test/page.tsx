'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Test Page</h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        This is a test page to verify that Next.js rendering is working properly.
      </p>
      
      <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-2">Environment Check</h2>
        <p>Rendering on: <strong>{isClient ? 'Client' : 'Server'}</strong></p>
        <p>Next.js Version: <strong>15.1.4</strong></p>
      </div>
      
      <Link 
        href="/" 
        className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md transition-colors duration-300"
      >
        Return Home
      </Link>
    </div>
  );
} 