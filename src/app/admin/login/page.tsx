'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

// For demo purposes; in a real app, this would be handled server-side
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Load login attempts from localStorage on component mount
  useEffect(() => {
    const storedAttempts = localStorage.getItem('loginAttempts');
    const storedLockTime = localStorage.getItem('lockedUntil');
    
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts));
    }
    
    if (storedLockTime) {
      const lockTime = parseInt(storedLockTime);
      if (lockTime > Date.now()) {
        setLockedUntil(lockTime);
      } else {
        // Reset if lock time has expired
        localStorage.removeItem('lockedUntil');
        localStorage.removeItem('loginAttempts');
      }
    }
  }, []);

  // Update countdown timer for lockout
  useEffect(() => {
    if (!lockedUntil) return;

    const timer = setInterval(() => {
      const now = Date.now();
      if (now >= lockedUntil) {
        setLockedUntil(null);
        setLoginAttempts(0);
        localStorage.removeItem('lockedUntil');
        localStorage.removeItem('loginAttempts');
        clearInterval(timer);
        return;
      }

      const remaining = Math.ceil((lockedUntil - now) / 1000);
      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      setTimeRemaining(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [lockedUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if account is locked
    if (lockedUntil && lockedUntil > Date.now()) {
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // In production, use environment variables and a server API call
      // const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL; 
      
      // For demo purposes only - in production, NEVER use hardcoded credentials or expose in client-side code
      // Replace this with a serverless function or API route to validate credentials securely
      if (email === 'yahyademeriah@gmail.com' && password === 'admin123') {
        // Successful login - reset attempts
        setLoginAttempts(0);
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lockedUntil');
        
        // Set authentication token (in a real app, this would be a JWT)
        sessionStorage.setItem('isLoggedIn', 'true');
        if (rememberMe) {
          localStorage.setItem('isLoggedIn', 'true');
        }
        
        // Redirect to admin dashboard
        window.location.href = '/admin';
      } else {
        // Failed login attempt
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('loginAttempts', newAttempts.toString());
        
        // Lock account after max attempts
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          const lockTime = Date.now() + LOCKOUT_TIME;
          setLockedUntil(lockTime);
          localStorage.setItem('lockedUntil', lockTime.toString());
          setError(`Too many failed login attempts. Account locked for 15 minutes.`);
        } else {
          setError(`Invalid email or password. ${MAX_LOGIN_ATTEMPTS - newAttempts} attempts remaining.`);
        }
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage your CV website
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {lockedUntil && lockedUntil > Date.now() ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Account locked due to too many failed attempts. 
                  <br />Try again in {timeRemaining}.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-gray-800"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{color: '#1f2937'}}
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-gray-800"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{color: '#1f2937'}}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/admin/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || (lockedUntil !== null && lockedUntil > Date.now())}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isLoading || (lockedUntil !== null && lockedUntil > Date.now()) 
                    ? 'bg-blue-400' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
                Return to website
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
