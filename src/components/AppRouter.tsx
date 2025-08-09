import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

// Layout
import AppLayout from './Layout/AppLayout';

// Static imports - Main app pages
import HomePage from '@/pages/HomePage';
import StudioPage from '@/pages/StudioPage';
import MagicSetPage from '@/pages/MagicSetPage';
import MagicMatchPage from '@/pages/MagicMatchPage';
import PlayerPage from '@/pages/PlayerPage';
import ProducerPage from '@/pages/ProducerPage';
import ProfilePage from '@/pages/ProfilePage';
import LibraryPage from '@/pages/LibraryPage';
import DocsPage from '@/pages/DocsPage';

// Static imports - Legal and support
import PrivacyPage from '@/pages/legal/PrivacyPage';
import TermsPage from '@/pages/legal/TermsPage';
import ContactPage from '@/pages/support/ContactPage';
import HelpPage from '@/pages/support/HelpPage';

// Static imports - Auth
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';

// Static imports - Errors
import NotFoundPage from '@/pages/errors/NotFoundPage';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
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
        <Route
          path={`${ROUTES.RESET_PASSWORD}/:token`}
          element={<ResetPasswordPage />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
