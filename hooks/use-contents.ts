import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getContents } from "@/lib/api/broadcast-api"
import type { Content } from "@/lib/broadcast-types"

export function useContents() {
  // Query for fetching contents
  // Ensures that the contents are always up to date
  const {
    data: contents,
    isLoading,
    isError: isErrorContents,
    isRefetching,
    isRefetchError
  } = useQuery<Content[]>({
    queryKey: ["contents"],
    queryFn: () => getContents(),
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData
  })

  if (isErrorContents || isRefetchError) {
    toast.error("Failed to fetch contents. Please try again.")
  }

  return {
    contents,
    isLoadingContents: isLoading,
    isRefetchingContents: isRefetching,
    isErrorContents: isErrorContents || isRefetchError
  }
}
