import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../../api';

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id_pengguna, nama, peran }) =>
      updateUser(id_pengguna, { nama, peran }),

    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },

    onError: (error) => {
      console.error('Gagal mengubah data pengguna:', error.message);
    },
  });
};
