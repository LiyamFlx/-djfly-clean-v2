import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MainNav from './MainNav';
import Footer from './Footer';
import { ROUTES } from '@/constants/routes';

// Pages where navigation should be hidden for an immersive experience
const IMMERSIVE_PAGES: string[] = [
  ROUTES.PLAYER,
  // Add other immersive pages here
];

const AppLayout: React.FC = () => {
  const { pathname } = useLocation();

  // Check if navigation should be hidden for the current route
  const shouldHideNavigation = React.useMemo(
    () => IMMERSIVE_PAGES.some((route) => pathname.startsWith(route)),
    [pathname]
  );

  return (
    <div className="min-h-screen bg-black-gradient flex flex-col">
      {!shouldHideNavigation && <MainNav />}

      <main
        className={`flex-1 transition-all duration-300 ${
          !shouldHideNavigation ? 'pt-16' : ''
        }`}
      >
        <Outlet />
      </main>

      {!shouldHideNavigation && <Footer />}
    </div>
  );
};

export default React.memo(AppLayout);
