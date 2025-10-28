import { useQuery } from "@tanstack/react-query"
import { authUser } from "../../api"

export const useAuthUser = () => {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: authUser,
    retry: false,
  })
}