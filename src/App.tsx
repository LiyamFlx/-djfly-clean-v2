import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MusicProvider } from '@/contexts/MusicContext';
import ApiStatusIndicator from '@/components/ApiStatusIndicator';
import MobileNav from '@/components/Layout/MobileNav';

// --- Page Imports ---
// Using React.lazy for code-splitting and improved performance.

// Main Pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const StudioPage = lazy(() => import('@/pages/StudioPage'));
const MagicMatchPage = lazy(() => import('@/pages/MagicMatchPage'));
const MagicSetPage = lazy(() => import('@/pages/MagicSetPage'));
const PlayerPage = lazy(() => import('@/pages/PlayerPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const ProducerPage = lazy(() => import('@/pages/ProducerPage'));
const DocsPage = lazy(() => import('@/pages/DocsPage'));

// Auth Pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const SpotifyCallbackPage = lazy(() => import('@/pages/auth/SpotifyCallbackPage'));

// Legal Pages
const TermsPage = lazy(() => import('@/pages/legal/TermsPage'));
const PrivacyPage = lazy(() => import('@/pages/legal/PrivacyPage'));

// Support Pages
const HelpPage = lazy(() => import('@/pages/support/HelpPage'));
const ContactPage = lazy(() => import('@/pages/support/ContactPage'));

// Error Pages
const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'));

// --- Components ---

// A reusable loading spinner for Suspense fallback.
const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="min-h-screen bg-black-gradient flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple mb-4"></div>
      <p className="text-gray-300">{message}</p>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <MusicProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-pure-black">
            <ApiStatusIndicator />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Main Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/studio" element={<StudioPage />} />
                <Route path="/studio/match" element={<MagicMatchPage />} />
                <Route path="/studio/set" element={<MagicSetPage />} />
                <Route path="/player" element={<PlayerPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/producer" element={<ProducerPage />} />
                <Route path="/docs" element={<DocsPage />} />

                {/* Authentication Routes */}
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/signup" element={<SignupPage />} />
                <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
                <Route path="/auth/spotify/callback" element={<SpotifyCallbackPage />} />

                {/* Legal Pages */}
                <Route path="/legal/terms" element={<TermsPage />} />
                <Route path="/legal/privacy" element={<PrivacyPage />} />

                {/* Support Pages */}
                <Route path="/support/help" element={<HelpPage />} />
                <Route path="/support/contact" element={<ContactPage />} />

                {/* 404 Page */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </div>
          <MobileNav />
        </BrowserRouter>
      </MusicProvider>
    </ThemeProvider>
  );
}

export default App;
