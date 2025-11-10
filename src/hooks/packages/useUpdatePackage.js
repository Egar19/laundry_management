import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePackage } from '../../api';

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePackage,
    onSuccess: () => {
      queryClient.invalidateQueries(['packages']);
    },
  });
};
