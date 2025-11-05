import { useQuery } from "@tanstack/react-query"
import { getAllCustomer } from "../../api"

export const useGetAllCustomer = (page, limit, search) => {
  return useQuery({
    queryKey: ['customers', page, limit, search],
    queryFn: () => getAllCustomer({page, limit, search}),
    keepPreviousData: true
  })
}