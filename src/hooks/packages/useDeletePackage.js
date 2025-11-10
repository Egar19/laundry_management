import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePackage } from '../../api';

export const useDeletePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePackage,
    onSuccess: () => {
      queryClient.invalidateQueries(['packages']);
    },
  });
};
