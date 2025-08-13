import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '@/services/auth';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authService.signIn(formData);

      if (result.success) {
        navigate('/player');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      // Fallback to mock login for demo purposes
      try {
        await authService.mockLogin(formData.email);
        navigate('/');
      } catch {
        setError(err instanceof Error ? err.message : 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    if (provider === 'spotify') {
      const authUrl = authService.getSpotifyAuthUrl();
      window.location.href = authUrl;
    } else {
      // Mock OAuth for demo
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-ui-bg-deep text-ui-text flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-ui-bg rounded-xl p-8 shadow-2xl border border-ui-border/50">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-electric-blue mb-2">
              Welcome Back
            </h1>
            <p className="text-ui-text-dim">Log in to your DJfly account</p>
          </div>

          {error && (
            <div className="bg-error/20 border border-error/50 rounded-lg p-3 mb-6">
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-sm font-medium mb-2 text-ui-text-dim"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-ui-bg-hover border border-ui-border rounded-lg focus:border-electric-blue focus:outline-none transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2 text-ui-text-dim"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 bg-ui-bg-hover border border-ui-border rounded-lg focus:border-electric-blue focus:outline-none transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="accent-electric-blue mr-2" />
                <span className="text-sm text-ui-text-dim">Remember me</span>
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-sm text-electric-blue hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-electric-blue to-bright-turquoise text-rich-black rounded-lg font-semibold transition-transform hover:scale-105 disabled:bg-ui-bg-hover disabled:text-ui-text-dim disabled:scale-100"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ui-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-ui-bg px-4 text-ui-text-dim">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleOAuthLogin('google')}
                  className="flex items-center justify-center py-2 px-4 bg-ui-bg-hover hover:bg-ui-border rounded-lg transition-colors"
                  aria-label="Log in with Google"
                >
                  <span className="text-lg">🎵</span>
                </button>
                <button
                  onClick={() => handleOAuthLogin('spotify')}
                  className="flex items-center justify-center py-2 px-4 bg-ui-bg-hover hover:bg-ui-border rounded-lg transition-colors"
                  aria-label="Log in with Spotify"
                >
                  <span className="text-lg">🎧</span>
                </button>
                <button
                  onClick={() => handleOAuthLogin('apple')}
                  className="flex items-center justify-center py-2 px-4 bg-ui-bg-hover hover:bg-ui-border rounded-lg transition-colors"
                  aria-label="Log in with Apple"
                >
                  <span className="text-lg">🍎</span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-ui-text-dim">
              Don't have an account?{' '}
              <Link
                to="/auth/signup"
                className="text-electric-blue hover:underline font-medium"
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
