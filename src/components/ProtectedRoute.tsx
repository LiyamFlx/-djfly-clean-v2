import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from '@/store';
import { ROUTES } from '@/constants/routes';

const ProtectedRoute = () => {
  const { session } = useAuthState();

  if (!session) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
