import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateExpense } from '../../api';

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses']);
    },
  });
};
