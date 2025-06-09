import type {
  EmailDomain,
  EmailFrequency,
  ResendError,
  EmailPreferences,
  ResendEmailResponse,
  ServiceUpdateResponse
} from "@/lib/email-types"

// Update email frequency for a single email type
export async function updateEmailFrequency(
  emailId: string,
  frequency: EmailFrequency
): Promise<{ success: boolean }> {
  const response = await fetch(`/api/email/preferences/${emailId}`, {
    method: "POST",
    body: JSON.stringify({ frequency }),
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to update email frequency: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Update frequency for all emails within a service domain
export async function updateServiceFrequency(
  domain: EmailDomain,
  frequency: EmailFrequency
): Promise<ServiceUpdateResponse> {
  const response = await fetch("/api/email/preferences/service", {
    method: "POST",
    body: JSON.stringify({ frequency, domain }),
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to update service frequency: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Get all email preferences for the user
export async function getEmailPreferences(): Promise<EmailPreferences> {
  const response = await fetch("/api/email/preferences", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to get email preferences: ${response.status} ${response.statusText}`)
  }
  const data = await response.json()
  return data.preferences
}

// Request to resend the latest email of a specific type
export async function resendLatestEmail(
  domain: EmailDomain,
  emailId: string,
  frequency: EmailFrequency
): Promise<ResendEmailResponse> {
  const response = await fetch(`/api/email/resend/${domain.toLowerCase()}/${emailId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ frequency })
  })

  if (response.status === 429) {
    const data = await response.json()
    const error = new Error("Too many requests")
    // Attach the next available at to the error
    ;(error as ResendError).nextAvailableAt = data.nextAvailableAt
    throw error
  }

  if (!response.ok) {
    throw new Error(`Failed to resend latest email: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
