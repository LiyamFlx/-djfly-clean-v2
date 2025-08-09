import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { spotifyService } from '@/services/spotify';
import { authService } from '@/services/auth';

const SpotifyCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('Connecting to Spotify...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');

        if (error) {
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('No authorization code received');
          return;
        }

        setMessage('Exchanging code for access token...');

        // Exchange code for token
        const success = await spotifyService.exchangeCodeForToken(code);

        if (success) {
          setStatus('success');
          setMessage('Successfully connected to Spotify!');

          // Redirect to player after short delay
          setTimeout(() => {
            navigate('/player');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Failed to authenticate with Spotify');
        }
      } catch (error) {
        console.error('Spotify callback error:', error);
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
              {status === 'loading' && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              )}
              {status === 'success' && (
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {status === 'error' && (
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>

            <h1 className="text-2xl font-bold mb-4">
              {status === 'loading' && 'Connecting to Spotify'}
              {status === 'success' && 'Successfully Connected!'}
              {status === 'error' && 'Connection Failed'}
            </h1>

            <p className="text-gray-300 mb-6">{message}</p>

            {status === 'error' && (
              <button
                onClick={() => navigate('/player')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Continue to Player
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyCallbackPage;
