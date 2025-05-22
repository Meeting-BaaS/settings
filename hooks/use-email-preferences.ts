import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getEmailPreferences,
  updateEmailFrequency,
  updateServiceFrequency,
  resendLatestEmail,
  unsubscribeWithToken
} from "@/lib/api/email-api"
import type { EmailDomain, EmailFrequency, EmailPreferences, EmailType } from "@/lib/email-types"
import { getUpdatedDomainFrequency } from "@/components/email-preferences/domain-frequency"
import { useState } from "react"

export function useEmailPreferences() {
  const queryClient = useQueryClient()
  const [resendingEmailIds, setResendingEmailIds] = useState<string[]>([])

  // Query for fetching email preferences
  const { data: preferences, isLoading } = useQuery({
    queryKey: ["email-preferences"],
    queryFn: () => getEmailPreferences(),
    retry: 2,
    refetchOnWindowFocus: true
  })

  // Mutation for updating individual email frequency
  const updatePreferenceMutation = useMutation({
    mutationFn: ({ id, frequency }: { id: string; frequency: EmailFrequency }) => {
      // Update the cache optimistically
      queryClient.setQueryData(["email-preferences"], (old: EmailPreferences) => ({
        ...old,
        [id]: frequency
      }))
      return updateEmailFrequency(id, frequency)
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
    mutationFn: ({
      domain,
      frequency,
      emailTypes
    }: { domain: EmailDomain; frequency: EmailFrequency; emailTypes: EmailType[] }) => {
      // Calculate new preferences before making the API call
      const newPreferences = getUpdatedDomainFrequency(
        domain,
        frequency,
        queryClient.getQueryData(["email-preferences"]) as EmailPreferences,
        emailTypes
      )

      // Update the cache optimistically
      queryClient.setQueryData(["email-preferences"], newPreferences)

      // Make the API call to update the service frequency
      return updateServiceFrequency(domain, frequency)
    },
    onSuccess: () => {
      toast.success("Preferences updated successfully")
    },
    onError: (error, { domain }) => {
      console.error("Failed to update preferences", error)
      // Revert the cache on error
      queryClient.setQueryData(["email-preferences"], (old: EmailPreferences) => {
        return { ...old }
      })
      toast.error(`Failed to update ${domain} preferences. Please try again.`)
    }
  })

  // Mutation for resending latest email
  const resendLatestMutation = useMutation({
    mutationFn: ({
      domain,
      emailId,
      frequency
    }: { domain: EmailDomain; emailId: string; frequency: EmailFrequency }) => {
      setResendingEmailIds((prev) => [...prev, emailId])
      return resendLatestEmail(domain, emailId, frequency)
    },
    onSuccess: (data, { emailId }) => {
      toast.success(data.message || "Latest email will be resent shortly")
      setResendingEmailIds((prev) => prev.filter((id) => id !== emailId))
    },
    onError: (error, { emailId }) => {
      console.error("Failed to resend email", error)
      toast.error("Failed to resend email. Please try again.")
      setResendingEmailIds((prev) => prev.filter((id) => id !== emailId))
    }
  })

  // Mutation for unsubscribing with token
  const unsubscribeMutation = useMutation({
    mutationFn: ({ emailType, token }: { emailType: string; token: string }) =>
      unsubscribeWithToken(emailType, token),
    onSuccess: () => {
      toast.success("Successfully unsubscribed")
      // Invalidate preferences to refresh the data
      queryClient.invalidateQueries({ queryKey: ["email-preferences"] })
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
    isResendingEmail: (emailId: string) =>
      resendLatestMutation.isPending && resendingEmailIds.includes(emailId)
  }
}
