import { useQuery } from '@tanstack/react-query';
import { getAllTransactions } from '../../api';

export const useGetAllTransactions = ({ page, limit, search, status }) => {
  return useQuery({
    queryKey: ['transactions', page, limit, search, status],
    queryFn: () =>
      getAllTransactions({
        page,
        limit,
        search,
        status,
      }),
    keepPreviousData: true,
  });
};