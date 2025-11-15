import { useQuery } from '@tanstack/react-query';
import { getTransactionMonthlyTotals } from '../../api';

export const useGetTransactionMonthlyTotals = () => {
  return useQuery({
    queryKey: ['transaction-totals'],
    queryFn: getTransactionMonthlyTotals,
  });
};
