'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12 text-center">
      <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">
        Something went wrong!
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        {error?.message || 'An unexpected error occurred'}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md transition-colors duration-300"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 text-blue-600 bg-white hover:bg-gray-100 rounded-md shadow-md border border-blue-600 transition-colors duration-300"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
} 