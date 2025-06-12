import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getContents } from "@/lib/api/broadcast-api"
import type { Content } from "@/lib/broadcast-types"
import { useEffect } from "react"

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

  useEffect(() => {
    if (isErrorContents || isRefetchError) {
      toast.error("Failed to fetch contents. Please try again.")
    }
  }, [isErrorContents, isRefetchError])

  return {
    contents,
    isLoadingContents: isLoading,
    isRefetchingContents: isRefetching,
    isErrorContents: isErrorContents || isRefetchError
  }
}
