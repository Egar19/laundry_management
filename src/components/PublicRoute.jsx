import { Navigate } from 'react-router-dom';
import { useAuthUser } from '../hooks/auth/useAuthUser';
import Loading from './Loading';

const PublicRoute = ({ children }) => {
  const { data: user, isLoading } = useAuthUser();

  if (isLoading) return <Loading />;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
