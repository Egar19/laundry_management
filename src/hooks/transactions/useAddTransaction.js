import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTransaction } from '../../api';

export const useAddTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
    },
  });
};
