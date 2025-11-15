import { useQuery } from '@tanstack/react-query';
import { getExpenseCount } from '../../api';

export const useExpenseCount = () => {
  return useQuery({
    queryKey: ['expense-count'],
    queryFn: getExpenseCount,
  });
};