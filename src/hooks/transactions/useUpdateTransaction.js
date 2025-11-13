import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTransaction } from '../../api';

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
    },
  });
};
