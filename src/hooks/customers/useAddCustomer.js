import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addCustomer } from "../../api"

export const useAddCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers'])
    }
  })
}