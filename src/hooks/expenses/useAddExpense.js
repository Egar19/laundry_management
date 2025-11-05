import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addExpense } from '../../api';

export const useAddExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses']);
    },
  });
};
