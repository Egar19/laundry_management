import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logOutUser } from '../../api';

export const useLogOut = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logOutUser,
    onSuccess: () => {
      navigate('/login', { replace: true });
    },
  });
};
