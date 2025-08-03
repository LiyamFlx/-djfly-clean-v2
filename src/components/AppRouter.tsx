import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

// Layout
import AppLayout from './Layout/AppLayout';

// Lazy-loaded pages
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const StudioPage = React.lazy(() => import('@/pages/StudioPage'));
const MagicSetPage = React.lazy(() => import('@/pages/MagicSetPage'));
const MagicMatchPage = React.lazy(() => import('@/pages/MagicMatchPage'));
const PlayerPage = React.lazy(() => import('@/pages/PlayerPage'));
const ProducerPage = React.lazy(() => import('@/pages/ProducerPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const LibraryPage = React.lazy(() => import('@/pages/LibraryPage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

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
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path={ROUTES.STUDIO} element={<StudioPage />}>
              <Route path="set" element={<MagicSetPage />} />
              <Route path="match" element={<MagicMatchPage />} />
            </Route>
            <Route path={ROUTES.PLAYER} element={<PlayerPage />} />
            <Route path={ROUTES.PRODUCER} element={<ProducerPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.LIBRARY} element={<LibraryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;