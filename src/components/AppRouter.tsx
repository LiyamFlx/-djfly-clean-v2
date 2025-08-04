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
import LibraryPage from '@/pages/LibraryPage';
import ProfilePage from '@/pages/ProfilePage';
import ProtectedRoute from './ProtectedRoute';

// Static imports - Auth
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';

// Static imports - Errors
import NotFoundPage from '@/pages/errors/NotFoundPage';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
          {/* Main app routes with layout */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              {/* Studio routes */}
              <Route path={ROUTES.STUDIO} element={<StudioPage />}>
                <Route path="set" element={<MagicSetPage />} />
                <Route path="match" element={<MagicMatchPage />} />
              </Route>

              {/* Main app pages */}
              <Route path={ROUTES.PLAYER} element={<PlayerPage />} />
              <Route path={ROUTES.LIBRARY} element={<LibraryPage />} />
              <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            </Route>
            
            {/* 404 - Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          
          {/* Auth routes (without main layout) */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
        </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;