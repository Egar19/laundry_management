import { useQuery } from '@tanstack/react-query';
import { getExportExpenses } from '../../api';

export const useExportExpenses = (mulai, sampai) => {
  return useQuery({
    queryKey: ['export-expenses', mulai, sampai],
    queryFn: () => getExportExpenses(mulai, sampai),
    enabled: !!mulai && !!sampai,
  });
};
