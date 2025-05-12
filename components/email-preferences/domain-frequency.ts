import type { EmailDomain, EmailFrequency, EmailPreferences, EmailType } from "@/lib/email-types"
import { getEmailsByDomain } from "@/components/email-preferences/email-categories"

// Function to check if all emails in a domain have the same frequency setting
export const getDomainFrequency = (
  domain: EmailDomain,
  preferences: EmailPreferences | undefined,
  emailTypes: EmailType[]
): EmailFrequency | "mixed" => {
  // Edge case: Handle missing preferences or invalid domain
  if (!preferences || !domain) return "none"

  // Only consider non-required emails for domain frequency
  const emailsInDomain = getEmailsByDomain(emailTypes, domain).filter((e) => !e.required)

  // If there are no non-required emails in this domain, return 'none'
  if (emailsInDomain.length === 0) return "none"

  const firstFreq = preferences[emailsInDomain[0].id]
  // Edge case: Handle missing frequency for first email
  if (!firstFreq) return "none"

  const allSame = emailsInDomain.every((e) => preferences[e.id] === firstFreq)

  return allSame ? firstFreq : "mixed"
}

/**
 * Update the frequency for all emails in a domain.
 * This has a fallback mechanism to pick the next available frequency in the hierarchy.
 * If no higher frequency is available, it will use the last available frequency.
 * @param domain - The domain to update
 * @param frequency - The frequency to set
 * @param old - The old preferences
 * @param emailTypes - The list of all email types
 * @returns The new preferences
 */
export const getUpdatedDomainFrequency = (
  domain: EmailDomain,
  frequency: EmailFrequency,
  old: EmailPreferences,
  emailTypes: EmailType[]
) => {
  const newPreferences = { ...old }
  const emailsInDomain = getEmailsByDomain(emailTypes, domain)

  // Define frequency hierarchy
  const frequencyHierarchy: EmailFrequency[] = ["daily", "weekly", "monthly"]

  for (const emailType of emailsInDomain) {
    // Skip required emails if the requested frequency is "none"
    if (emailType.required && frequency === "none") continue

    // If the requested frequency is "none", set it to "none"
    if (frequency === "none") {
      newPreferences[emailType.id] = "none"
      continue
    }

    // If the requested frequency is available, use it
    if (emailType.frequencies.includes(frequency)) {
      newPreferences[emailType.id] = frequency
      continue
    }

    // Find the next available frequency in the hierarchy
    const requestedIndex = frequencyHierarchy.indexOf(frequency)
    if (requestedIndex === -1) continue

    // Find the next available frequency that's higher in the hierarchy
    let foundFrequency = false
    for (let i = requestedIndex; i < frequencyHierarchy.length; i++) {
      const nextFrequency = frequencyHierarchy[i]
      if (emailType.frequencies.includes(nextFrequency)) {
        newPreferences[emailType.id] = nextFrequency
        foundFrequency = true
        break
      }
    }

    // If no higher frequency was found, use the last available frequency
    if (!foundFrequency) {
      const lastAvailableFrequency = emailType.frequencies[emailType.frequencies.length - 1]
      newPreferences[emailType.id] = lastAvailableFrequency
    }
  }

  return newPreferences
}
