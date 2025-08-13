import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authService.signIn({ email, password });

      if (result.success) {
        navigate('/player');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch {
      setError('An unexpected error occurred');
      await authService.mockLogin(formData.email);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpotifyLogin = () => {
    const authUrl = authService.getSpotifyAuthUrl();
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400 mb-2">DJfly</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>
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

        <div className="bg-gray-800 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-600 text-white p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              <label
                className="block text-sm font-medium mb-2 text-ui-text-dim"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-ui-bg-hover border border-ui-border rounded-lg focus:border-electric-blue focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2 text-ui-text-dim"
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 bg-ui-bg-hover border border-ui-border rounded-lg focus:border-electric-blue focus:outline-none transition-colors"
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="••••••••"
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
                <span className="px-2 bg-gray-800 text-gray-400">
                <span className="bg-ui-bg px-4 text-ui-text-dim">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              onClick={handleSpotifyLogin}
              className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.659-2.24-9.239-2.759-13.561-1.5-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.6 10.561 19.8 13.2c.361.181.54.78.361 1.26zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              Continue with Spotify
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/auth/forgot-password"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="mt-4 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/auth/signup"
              className="text-blue-400 hover:text-blue-300"
            >
              Sign up
            </Link>
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
      </div>
    </div>
  );
};

export default LoginPage;
