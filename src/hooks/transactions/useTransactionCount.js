import { useQuery } from '@tanstack/react-query';
import { getTransactionCount } from '../../api';

export const useTransactionCount = () => {
  return useQuery({
    queryKey: ['transaction-count'],
    queryFn: getTransactionCount,
  });
};
