import { Navigate } from 'react-router-dom';
import { useAuthUser } from '../hooks/auth/useAuthUser';
import { useCurrentUser } from '../hooks/auth/useGetCurrentUser';
import Loading from './Loading';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { data: user, isLoading, isError } = useAuthUser();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();

  if (isLoading || userLoading) {
    return <Loading />;
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.peran)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
