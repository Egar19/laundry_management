import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleDeactivateUser } from '../../api';

export const useToggleDeactivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleDeactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};