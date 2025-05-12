import { getAvailableEmailTypes } from "@/lib/email-api"
import type { EmailDomain, EmailType } from "@/lib/email-types"

// Cache for email types to avoid repeated API calls
let emailTypesCache: EmailType[] | null = null

// Fetch email types from the API
export async function getEmailCategories(userToken: string): Promise<EmailType[]> {
  // Return cached value if available
  if (emailTypesCache) {
    return emailTypesCache
  }

  try {
    // Fetch from API
    const types = await getAvailableEmailTypes(userToken)
    // Cache the result
    emailTypesCache = types
    return types
  } catch (error) {
    console.error("Failed to fetch email types:", error)
    // Return empty array on error
    return []
  }
}

// Group email types by domain
export const getEmailsByDomain = (types: EmailType[], domain: EmailDomain) => {
  return types.filter((email) => email.domain === domain)
}

// Find email type by ID
export const findEmailTypeById = (types: EmailType[], id: string) => {
  return types.find((type) => type.id === id)
}

// Clear the cache (useful when preferences are updated)
export const clearEmailTypesCache = () => {
  emailTypesCache = null
}
