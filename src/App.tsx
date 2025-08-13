import React, { Suspense } from 'react';
import AppRouter from './components/AppRouter';
import ApiStatusIndicator from './components/ApiStatusIndicator';

const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="min-h-screen bg-club-gradient flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
      <p className="text-gray-300">{message}</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ApiStatusIndicator />
      <AppRouter />
    </Suspense>
  );
};

export default App;
