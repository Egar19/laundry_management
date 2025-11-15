import { useQuery } from '@tanstack/react-query';
import { getExpenseMonthlyTotals } from '../../api';

export const useGetExpenseMonthlyTotals = () => {
  return useQuery({
    queryKey: ['transactions-monthly'],
    queryFn: getExpenseMonthlyTotals,
  });
};