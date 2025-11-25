import { useQuery } from '@tanstack/react-query';
import { getExportTransactions } from '../../api';

export const useExportTransactions = (mulai, sampai) => {
  return useQuery({
    queryKey: ['export-transaksi', mulai, sampai],
    queryFn: () => getExportTransactions(mulai, sampai),
    enabled: !!mulai && !!sampai,
  });
};
