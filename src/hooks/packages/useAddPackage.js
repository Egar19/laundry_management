import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addPackage } from '../../api';

export const useAddPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPackage,
    onSuccess: () => {
      queryClient.invalidateQueries(['packages']);
    },
  });
};
