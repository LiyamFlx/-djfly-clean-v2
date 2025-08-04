import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

// Layout
import AppLayout from './Layout/AppLayout';

// Lazy-loaded pages - Main app pages
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const StudioPage = React.lazy(() => import('@/pages/StudioPage'));
const MagicSetPage = React.lazy(() => import('@/pages/MagicSetPage'));
const MagicMatchPage = React.lazy(() => import('@/pages/MagicMatchPage'));
const PlayerPage = React.lazy(() => import('@/pages/PlayerPage'));
const ProducerPage = React.lazy(() => import('@/pages/ProducerPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const LibraryPage = React.lazy(() => import('@/pages/LibraryPage'));
const DocsPage = React.lazy(() => import('@/pages/DocsPage'));

// Lazy-loaded pages - Legal and support
const PrivacyPage = React.lazy(() => import('@/pages/legal/PrivacyPage'));
const TermsPage = React.lazy(() => import('@/pages/legal/TermsPage'));
const ContactPage = React.lazy(() => import('@/pages/support/ContactPage'));
const HelpPage = React.lazy(() => import('@/pages/support/HelpPage'));

// Lazy-loaded pages - Auth
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = React.lazy(() => import('@/pages/auth/SignupPage'));
const ForgotPasswordPage = React.lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('@/pages/auth/ResetPasswordPage'));

// Lazy-loaded pages - Errors
const NotFoundPage = React.lazy(() => import('@/pages/errors/NotFoundPage'));

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-club-gradient flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin mb-4 mx-auto"></div>
      <p className="text-gray-300">Loading DJfly...</p>
    </div>
  </div>
);

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Main app routes with layout */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            
            {/* Studio routes */}
            <Route path={ROUTES.STUDIO} element={<StudioPage />}>
              <Route path="set" element={<MagicSetPage />} />
              <Route path="match" element={<MagicMatchPage />} />
            </Route>
            
            {/* Main app pages */}
            <Route path={ROUTES.PLAYER} element={<PlayerPage />} />
            <Route path={ROUTES.PRODUCER} element={<ProducerPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.LIBRARY} element={<LibraryPage />} />
            <Route path={ROUTES.DOCS} element={<DocsPage />} />
            
            {/* Legal pages */}
            <Route path={ROUTES.PRIVACY} element={<PrivacyPage />} />
            <Route path={ROUTES.TERMS} element={<TermsPage />} />
            
            {/* Support pages */}
            <Route path={ROUTES.CONTACT} element={<ContactPage />} />
            <Route path={ROUTES.HELP} element={<HelpPage />} />
            
            {/* 404 - Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          
          {/* Auth routes (without main layout) */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={`${ROUTES.RESET_PASSWORD}/:token`} element={<ResetPasswordPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;