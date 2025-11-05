import { useQuery } from '@tanstack/react-query';
import { getAllExpense } from '../../api';

export const useGetAllExpense = ({ page, limit, search }) => {
  return useQuery({
    queryKey: ['expenses', page, limit, search],
    queryFn: () => getAllExpense({ page, limit, search }),
    keepPreviousData: true,
  });
};