import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-club-gradient flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-8">🎵</div>
        <h1 className="text-4xl font-bold mb-4">404 - Track Not Found</h1>
        <p className="text-gray-300 mb-8 max-w-md">
          Looks like this page got lost in the mix. Let&apos;s get you back to
          the music.
        </p>
        <Link
          to={ROUTES.HOME}
          className="club-button inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
