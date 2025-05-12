import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getEmailPreferences,
  updateEmailFrequency,
  resendLatestEmail,
  unsubscribeWithToken,
  batchUpdatePreferences,
  updateServiceFrequency
} from "@/lib/email-api"
import type { EmailDomain, EmailFrequency, EmailPreferences, EmailType } from "@/lib/email-types"
import { useJwt } from "@/hooks/use-jwt"
import { getUpdatedDomainFrequency } from "@/components/email-preferences/domain-frequency"
import { clearEmailTypesCache, getEmailCategories } from "@/components/email-preferences/email-categories"

export function useEmailPreferences() {
  const queryClient = useQueryClient()
  const jwt = useJwt()

  // Query for fetching email preferences
  const { data: preferences, isLoading } = useQuery({
    queryKey: ["email-preferences"],
    queryFn: () => getEmailPreferences(jwt),
    retry: 2,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  // Query for fetching email types
  const { data: emailTypes = [] } = useQuery<EmailType[]>({
    queryKey: ["email-types"],
    queryFn: () => getEmailCategories(jwt),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  // Mutation for updating individual email frequency
  const updatePreferenceMutation = useMutation({
    mutationFn: ({ id, frequency }: { id: string; frequency: EmailFrequency }) => {
      // Update the cache optimistically
      queryClient.setQueryData(["email-preferences"], (old: EmailPreferences) => ({
        ...old,
        [id]: frequency
      }))
      return updateEmailFrequency(jwt, id, frequency)
    },
    onSuccess: () => {
      toast.success("Preference updated successfully")
      // Clear email types cache to ensure we have fresh data
      clearEmailTypesCache()
    },
    onError: (error, { id }) => {
      console.error("Failed to update preference", error)
      // Revert the cache on error
      queryClient.setQueryData(["email-preferences"], (old: EmailPreferences) => ({
        ...old,
        [id]: old[id]
      }))
      toast.error("Failed to update preference. Please try again.")
    }
  })

  // Mutation for updating service-wide frequency
  const updateServiceMutation = useMutation({
    mutationFn: ({ domain, frequency }: { domain: EmailDomain; frequency: EmailFrequency }) => {
      // Calculate new preferences before making the API call
      const newPreferences = getUpdatedDomainFrequency(
        domain,
        frequency,
        queryClient.getQueryData(["email-preferences"]) as EmailPreferences,
        emailTypes
      )

      // Update the cache optimistically
      queryClient.setQueryData(["email-preferences"], newPreferences)

      // Make the API call to update service frequency
      return updateServiceFrequency(jwt, { domain, frequency })
    },
    onSuccess: () => {
      toast.success("Preferences updated successfully")
      // Clear email types cache to ensure we have fresh data
      clearEmailTypesCache()
    },
    onError: (error, { domain }) => {
      console.error("Failed to update preferences", error)
      // Revert the cache on error
      queryClient.setQueryData(["email-preferences"], (old: EmailPreferences) => old)
      toast.error(`Failed to update ${domain} preferences. Please try again.`)
    }
  })

  // Mutation for resending latest email
  const resendLatestMutation = useMutation({
    mutationFn: (emailId: string) => resendLatestEmail(jwt, emailId),
    onSuccess: (data) => {
      toast.success(data.message || "Latest email will be resent shortly")
    },
    onError: (error) => {
      console.error("Failed to resend email", error)
      toast.error("Failed to resend email. Please try again.")
    }
  })

  // Mutation for unsubscribing with token
  const unsubscribeMutation = useMutation({
    mutationFn: ({ emailId, token }: { emailId: string; token: string }) =>
      unsubscribeWithToken(emailId, token),
    onSuccess: () => {
      toast.success("Successfully unsubscribed")
      // Invalidate preferences to refresh the data
      queryClient.invalidateQueries({ queryKey: ["email-preferences"] })
      // Clear email types cache to ensure we have fresh data
      clearEmailTypesCache()
    },
    onError: (error) => {
      console.error("Failed to unsubscribe", error)
      toast.error("Failed to unsubscribe. Please try again.")
    }
  })

  return {
    preferences,
    isLoading,
    updatePreference: updatePreferenceMutation.mutate,
    updateService: updateServiceMutation.mutate,
    resendLatest: resendLatestMutation.mutate,
    unsubscribe: unsubscribeMutation.mutate,
    isUpdating: updatePreferenceMutation.isPending || updateServiceMutation.isPending,
    isResending: resendLatestMutation.isPending,
    isUnsubscribing: unsubscribeMutation.isPending
  }
}
