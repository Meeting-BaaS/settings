/**
 * Mock API implementation for email preferences management.
 * This file provides a temporary implementation using localStorage
 * until the live API endpoints are available.
 */

import type {
  BatchUpdateResponse,
  EmailFrequency,
  EmailPreference,
  EmailPreferences,
  EmailType,
  ResendEmailResponse,
  ServiceFrequencyUpdate,
  ServiceUpdateResponse
} from "@/lib/email-types"

// Constants for localStorage keys
const STORAGE_KEYS = {
  PREFERENCES: "email_preferences"
}

// Initialize default preferences if they don't exist
const DEFAULT_PREFERENCES: EmailPreferences = {
  "usage-reports": "monthly",
  "product-updates": "weekly",
  "maintenance-notifications": "daily",
  "company-news": "monthly",
  "api-changes": "weekly",
  "developer-resources": "monthly",
  "security-alerts": "daily",
  "billing-notifications": "monthly"
}

// Helper functions for localStorage
const getStoredPreferences = (): EmailPreferences => {
  const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES)
  return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES
}

const setStoredPreferences = (preferences: EmailPreferences) => {
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences))
}

// Add a local EMAIL_CATEGORIES array for mock purposes
const EMAIL_CATEGORIES: EmailType[] = [
  {
    id: "usage-reports",
    name: "Usage Reports",
    description: "Monthly reports on your Meeting BaaS usage and statistics.",
    domain: "reports",
    frequencies: ["daily", "weekly", "monthly"]
  },
  {
    id: "product-updates",
    name: "Product Updates",
    description: "New features and improvements to the platform.",
    domain: "announcements",
    frequencies: ["weekly", "monthly"]
  },
  {
    id: "maintenance-notifications",
    name: "Maintenance Notifications",
    description: "Scheduled maintenance and system updates.",
    domain: "announcements",
    frequencies: ["daily"]
  },
  {
    id: "company-news",
    name: "Company News",
    description: "News and announcements about Meeting BaaS.",
    domain: "announcements",
    frequencies: ["monthly"]
  },
  {
    id: "api-changes",
    name: "API Changes",
    description: "Updates and changes to the Meeting BaaS API.",
    domain: "developers",
    frequencies: ["daily", "weekly", "monthly"]
  },
  {
    id: "developer-resources",
    name: "Developer Resources",
    description: "New resources, tutorials and documentation.",
    domain: "developers",
    frequencies: ["daily", "weekly", "monthly"]
  },
  {
    id: "security-alerts",
    name: "Security Alerts",
    description: "Important security notifications about your account.",
    domain: "account",
    frequencies: ["daily"],
    required: true
  },
  {
    id: "billing-notifications",
    name: "Billing Notifications",
    description: "Invoices and payment confirmations.",
    domain: "account",
    frequencies: ["daily", "weekly", "monthly"],
    required: true
  }
]

// Update email frequency for a single email type
export async function updateEmailFrequency(
  userToken: string,
  emailId: string,
  frequency: EmailFrequency
): Promise<{ success: boolean }> {
  const preferences = getStoredPreferences()
  preferences[emailId] = frequency
  setStoredPreferences(preferences)
  return { success: true }
}

// Update frequency for all emails within a service domain
export async function updateServiceFrequency(
  userToken: string,
  data: ServiceFrequencyUpdate
): Promise<ServiceUpdateResponse> {
  const preferences = getStoredPreferences()
  const updatedEmails: string[] = []

  for (const type of EMAIL_CATEGORIES) {
    if (type.domain === data.domain) {
      preferences[type.id] = data.frequency
      updatedEmails.push(type.id)
    }
  }

  setStoredPreferences(preferences)
  return {
    success: true,
    updatedEmails
  }
}

// Unsubscribe from a specific email using unsubscribe token
export async function unsubscribeWithToken(
  emailId: string,
  token: string
): Promise<{ success: boolean }> {
  const preferences = getStoredPreferences()
  preferences[emailId] = "none"
  setStoredPreferences(preferences)
  return { success: true }
}

// Get all email preferences for the user
export async function getEmailPreferences(userToken: string): Promise<EmailPreferences> {
  return getStoredPreferences()
}

// Request to resend the latest email of a specific type
export async function resendLatestEmail(
  userToken: string,
  emailId: string
): Promise<ResendEmailResponse> {
  // In a real implementation, this would trigger an email resend
  // For mock purposes, we'll just return success
  return { success: true, message: "Email queued for delivery" }
}

// Batch update multiple email preferences at once
export async function batchUpdatePreferences(
  userToken: string,
  preferences: EmailPreference[]
): Promise<BatchUpdateResponse> {
  const currentPreferences = getStoredPreferences()

  for (const pref of preferences) {
    currentPreferences[pref.id] = pref.frequency
  }

  setStoredPreferences(currentPreferences)
  return { success: true, updatedCount: preferences.length }
}

// Get a list of available email types and their configuration
export async function getAvailableEmailTypes(userToken: string): Promise<EmailType[]> {
  return EMAIL_CATEGORIES
}
