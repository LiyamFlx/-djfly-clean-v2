import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-club-gradient flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-electric-blue hover:bg-electric-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-blue/50 transition-colors duration-200"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
