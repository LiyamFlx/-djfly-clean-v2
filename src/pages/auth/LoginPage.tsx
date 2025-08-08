import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { secureAuthService, validateEmail, validatePassword } from '@/services/secureAuth';
import { sanitizeError, RateLimiter } from '@/utils/security';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  
  // Initialize rate limiter
  const rateLimiter = new RateLimiter(5, 15 * 60 * 1000, 60 * 60 * 1000);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    setIsLoading(true);

    // Input validation
    const errors: { email?: string; password?: string } = {};
    
    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    // Rate limiting check
    if (!rateLimiter.isAllowed(formData.email)) {
      setError('Too many login attempts. Please try again later.');
      setIsLoading(false);
      return;
    }

    try {
      rateLimiter.recordAttempt(formData.email);
      
      // Use secure auth service
      await secureAuthService.login({
        email: formData.email,
        password: formData.password,
      });
      
      rateLimiter.resetAttempts(formData.email);
      navigate('/');
    } catch (err) {
      const errorMessage = sanitizeError(err, 'Login');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'spotify' | 'apple') => {
    try {
      // OAuth login would be handled by secure auth service
      setError('OAuth login is not available in secure mode');
    } catch (err) {
      const errorMessage = sanitizeError(err, 'OAuth Login');
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800 rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-400 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400">
              Log in to your DJfly account to access your mixes and playlists
            </p>
          </div>

          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-4 mb-6">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (validationErrors.email) {
                    setValidationErrors({ ...validationErrors, email: undefined });
                  }
                }}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none transition-colors ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                }`}
                placeholder="your@email.com"
                required
              />
              {validationErrors.email && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (validationErrors.password) {
                    setValidationErrors({ ...validationErrors, password: undefined });
                  }
                }}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none transition-colors ${
                  validationErrors.password ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                }`}
                placeholder="Enter your password"
                required
              />
              {validationErrors.password && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="accent-blue-500 mr-2" />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-800 px-4 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleOAuthLogin('google')}
                className="flex items-center justify-center py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <span className="text-lg">🎵</span>
              </button>
              <button
                onClick={() => handleOAuthLogin('spotify')}
                className="flex items-center justify-center py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <span className="text-lg">🎧</span>
              </button>
              <button
                onClick={() => handleOAuthLogin('apple')}
                className="flex items-center justify-center py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <span className="text-lg">🍎</span>
              </button>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/auth/signup"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
