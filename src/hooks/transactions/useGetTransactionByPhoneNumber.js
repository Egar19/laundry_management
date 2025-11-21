import { useQuery } from "@tanstack/react-query";
import { getTransactionByPhoneNumber } from "../../api";

export const useGetTransactionByPhoneNumber = (no_telp) => {
  return useQuery({
    queryKey: ["trx-by-phone", no_telp],
    queryFn: () => getTransactionByPhoneNumber(no_telp),
    enabled: !!no_telp,
  });
};
