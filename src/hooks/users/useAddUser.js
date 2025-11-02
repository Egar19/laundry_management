import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addUser } from '../../api';

export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      console.log('berhasil menambahkan user');
    },
  });
};