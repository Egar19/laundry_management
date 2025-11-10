import { useQuery } from "@tanstack/react-query";
import { getCustomerCount } from "../../api";

export const useCustomerCount = () => {
  return useQuery({
    queryKey: ['customer-count'],
    queryFn: () => getCustomerCount(),
  });
};