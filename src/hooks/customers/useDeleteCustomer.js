import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteCustomer } from "../../api";

export const useDeleteCustomer = () => {
  const  queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers'])
    }
  })
}