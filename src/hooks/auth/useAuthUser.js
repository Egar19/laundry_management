import { useQuery } from '@tanstack/react-query';
import { authUser } from '../../api';

export const useAuthUser = () => {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: authUser,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
