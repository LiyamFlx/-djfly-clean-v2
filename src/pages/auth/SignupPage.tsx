import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { secureAuthService, validateEmail, validatePassword } from '@/services/secureAuth';
import { sanitizeError, validatePasswordStrength } from '@/utils/security';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ 
    name?: string; 
    email?: string; 
    password?: string; 
    confirmPassword?: string;
    passwordStrength?: string[];
  }>({});
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; feedback: string[] }>({ score: 0, feedback: [] });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    // Input validation
    const errors: { 
      name?: string; 
      email?: string; 
      password?: string; 
      confirmPassword?: string;
    } = {};
    
    if (formData.name.length < 2 || formData.name.length > 50) {
      errors.name = 'Name must be between 2 and 50 characters';
    }
    
    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Password strength validation
    const strength = validatePasswordStrength(formData.password);
    if (!strength.isValid) {
      errors.passwordStrength = strength.feedback;
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      await secureAuthService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/');
    } catch (err) {
      const errorMessage = sanitizeError(err, 'Signup');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
              Create Account
            </h1>
            <p className="text-gray-400">
              Join DJfly to create amazing mixes and discover new music
            </p>
          </div>

          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-4 mb-6">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (validationErrors.name) {
                    setValidationErrors({ ...validationErrors, name: undefined });
                  }
                }}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none transition-colors ${
                  validationErrors.name ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                }`}
                placeholder="Your full name"
                required
              />
              {validationErrors.name && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>
              )}
            </div>

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
                  // Update password strength
                  const strength = validatePasswordStrength(e.target.value);
                  setPasswordStrength(strength);
                }}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none transition-colors ${
                  validationErrors.password ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                }`}
                placeholder="Create a strong password"
                required
              />
              {validationErrors.password && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.password}</p>
              )}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          passwordStrength.score <= 2 ? 'bg-red-500' :
                          passwordStrength.score <= 3 ? 'bg-yellow-500' :
                          passwordStrength.score <= 4 ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {passwordStrength.score}/5
                    </span>
                  </div>
                  {passwordStrength.feedback.length > 0 && (
                    <ul className="text-xs text-gray-400 mt-1 space-y-1">
                      {passwordStrength.feedback.map((feedback, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                          {feedback}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (validationErrors.confirmPassword) {
                    setValidationErrors({ ...validationErrors, confirmPassword: undefined });
                  }
                }}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none transition-colors ${
                  validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                }`}
                placeholder="Confirm your password"
                required
              />
              {validationErrors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="accent-blue-500 mr-3 mt-1"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-400">
                I agree to the{' '}
                <Link
                  to="/legal/terms"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  to="/legal/privacy"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
