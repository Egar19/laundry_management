import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCustomer } from '../../api';

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient(); 

  return useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers'])
    },
  });
};