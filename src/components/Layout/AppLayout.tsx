import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MainNav from './MainNav';
import Footer from './Footer';
import { ROUTES } from '@/constants/routes';

const AppLayout: React.FC = () => {
  const location = useLocation();
  
  // Hide nav/footer on certain pages for immersive experience
  const hideNavigation = [ROUTES.PLAYER].includes(location.pathname as any);
  
  return (
    <div className="min-h-screen bg-club-gradient flex flex-col">
      {!hideNavigation && <MainNav />}
      
      <main className={`flex-1 ${!hideNavigation ? 'pt-16' : ''}`}>
        <Outlet />
      </main>
      
      {!hideNavigation && <Footer />}
    </div>
  );
};

export default AppLayout;