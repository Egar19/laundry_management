import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteExpense } from '../../api';

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses']);
    },
  });
};
