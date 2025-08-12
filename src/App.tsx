import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MusicProvider, useMusicContext } from '@/contexts/MusicContext';
import ApiStatusIndicator from '@/components/ApiStatusIndicator';
import MobileNav from '@/components/Layout/MobileNav';
import MiniPlayer from '@/components/player/MiniPlayer';

// --- Page Imports ---
const HomePage = lazy(() => import('@/pages/HomePage'));
const StudioPage = lazy(() => import('@/pages/StudioPage'));
const MagicMatchPage = lazy(() => import('@/pages/MagicMatchPage'));
const MagicSetPage = lazy(() => import('@/pages/MagicSetPage'));
const PlayerPage = lazy(() => import('@/pages/PlayerPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const ProducerPage = lazy(() => import('@/pages/ProducerPage'));
const DocsPage = lazy(() => import('@/pages/DocsPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const SpotifyCallbackPage = lazy(() => import('@/pages/auth/SpotifyCallbackPage'));
const TermsPage = lazy(() => import('@/pages/legal/TermsPage'));
const PrivacyPage = lazy(() => import('@/pages/legal/PrivacyPage'));
const HelpPage = lazy(() => import('@/pages/support/HelpPage'));
const ContactPage = lazy(() => import('@/pages/support/ContactPage'));
const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'));

// --- Components ---
const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="min-h-screen bg-black-gradient flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple mb-4"></div>
      <p className="text-gray-300">{message}</p>
    </div>
  </div>
);

const AppRoutes = () => {
  const { queue } = useMusicContext();

  return (
    <>
      <div className="min-h-screen bg-pure-black pb-24"> {/* Add padding for mini-player */}
        <ApiStatusIndicator />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/studio" element={<StudioPage />} />
            <Route path="/studio/match" element={<MagicMatchPage />} />
            <Route path="/studio/set" element={<MagicSetPage />} />
            <Route path="/player" element={<PlayerPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/producer" element={<ProducerPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/spotify/callback" element={<SpotifyCallbackPage />} />
            <Route path="/legal/terms" element={<TermsPage />} />
            <Route path="/legal/privacy" element={<PrivacyPage />} />
            <Route path="/support/help" element={<HelpPage />} />
            <Route path="/support/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
      <MobileNav />
      {queue.length > 0 && <MiniPlayer />}
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <MusicProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </MusicProvider>
    </ThemeProvider>
  );
}

export default App;
