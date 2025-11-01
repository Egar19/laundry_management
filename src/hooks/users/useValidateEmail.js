import { useQuery } from '@tanstack/react-query';
import { validateUniqueEmail } from '../../api';

export const useValidateEmail = (email) => {
  return useQuery({
    queryKey: ['validateEmail', email],
    queryFn: validateUniqueEmail,
    enabled: !!email,
  });
};