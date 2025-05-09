import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getEmailPreferences,
  updateEmailFrequency,
  resendLatestEmail,
  unsubscribeWithToken,
  batchUpdatePreferences
} from "@/lib/mock-email-api"
import type { EmailDomain, EmailFrequency, EmailPreferences } from "@/lib/email-types"
import { useJwt } from "@/hooks/use-jwt"
import { getUpdatedDomainFrequency } from "@/components/email-preferences/domain-frequency"

export function useEmailPreferences() {
  const queryClient = useQueryClient()
  const jwt = useJwt()

  // Query for fetching email preferences
  const { data: preferences, isLoading } = useQuery({
    queryKey: ["email-preferences"],
    queryFn: () => getEmailPreferences(jwt)
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
        queryClient.getQueryData(["email-preferences"]) as EmailPreferences
      )

      // Update the cache optimistically
      queryClient.setQueryData(["email-preferences"], newPreferences)

      // Convert the preferences object to an array format expected by the API
      const preferencesArray = Object.entries(newPreferences).map(([id, frequency]) => ({
        id,
        frequency
      }))

      // Make the API call with the new preferences
      return batchUpdatePreferences(jwt, preferencesArray)
    },
    onSuccess: () => {
      toast.success("Preferences updated successfully")
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
    onSuccess: () => {
      toast.success("Latest email will be resent shortly")
    },
    onError: (error) => {
      console.error("Failed to resend email", error)
      toast.error("Failed to resend email. Please try again.")
    }
  })

  // Mutation for unsubscribing with token
  const unsubscribeWithTokenMutation = useMutation({
    mutationFn: ({ emailId, token }: { emailId: string; token: string }) => {
      // Update the cache optimistically
      queryClient.setQueryData(["email-preferences"], (old: EmailPreferences) => ({
        ...old,
        [emailId]: "none"
      }))
      return unsubscribeWithToken(emailId, token)
    },
    onSuccess: () => {
      toast.success("Successfully unsubscribed from email")
    },
    onError: (error) => {
      console.error("Failed to unsubscribe with token", error)
      // Revert the cache on error
      queryClient.setQueryData(["email-preferences"], (old: EmailPreferences) => old)
      toast.error("Invalid or expired unsubscribe link. Please try again.")
    }
  })

  return {
    preferences,
    isLoading,
    updatePreference: updatePreferenceMutation.mutate,
    updateService: updateServiceMutation.mutate,
    resendLatest: resendLatestMutation.mutate,
    unsubscribeWithToken: unsubscribeWithTokenMutation.mutate,
    unsubscribeWithTokenSuccess: unsubscribeWithTokenMutation.isSuccess
  }
}
