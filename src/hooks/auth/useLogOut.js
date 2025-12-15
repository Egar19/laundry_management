import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logOutUser } from '../../api';

export const useLogOut = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logOutUser,
    onSuccess: async () => {
      
      queryClient.removeQueries({ queryKey: ['auth-user'] });
      queryClient.removeQueries({ queryKey: ['current-user'] });

      queryClient.clear();

      navigate('/login', { replace: true });
    },
  });
};
