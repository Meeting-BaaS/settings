import axios from "axios"

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

// Base API URL - replace with your actual API URL in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.meetingbaas.com"

// Helper to get auth headers
const getAuthHeaders = (userToken: string) => ({
  Authorization: `Bearer ${userToken}`,
  "Content-Type": "application/json"
})

// Update email frequency for a single email type
export async function updateEmailFrequency(
  userToken: string,
  emailId: string,
  frequency: EmailFrequency
): Promise<{ success: boolean }> {
  const response = await axios({
    method: "POST",
    url: `${API_BASE_URL}/email/preferences/${emailId}`,
    data: { frequency },
    headers: getAuthHeaders(userToken)
  })
  return response.data
}

// Update frequency for all emails within a service domain
export async function updateServiceFrequency(
  userToken: string,
  data: ServiceFrequencyUpdate
): Promise<ServiceUpdateResponse> {
  const response = await axios({
    method: "POST",
    url: `${API_BASE_URL}/email/preferences/service/${data.domain}`,
    data: { frequency: data.frequency },
    headers: getAuthHeaders(userToken)
  })
  return response.data
}

// Unsubscribe from a specific email using unsubscribe token
export async function unsubscribeWithToken(
  emailId: string,
  token: string
): Promise<{ success: boolean }> {
  const response = await axios({
    method: "POST",
    url: `${API_BASE_URL}/email/preferences/unsubscribe`,
    data: {
      emailId,
      token
    }
  })
  return response.data
}

// Get all email preferences for the user
export async function getEmailPreferences(userToken: string): Promise<EmailPreferences> {
  const response = await axios({
    method: "GET",
    url: `${API_BASE_URL}/email/preferences`,
    headers: getAuthHeaders(userToken)
  })
  return response.data
}

// Request to resend the latest email of a specific type
export async function resendLatestEmail(
  userToken: string,
  emailId: string
): Promise<ResendEmailResponse> {
  const response = await axios({
    method: "POST",
    url: `${API_BASE_URL}/email/${emailId}/resend`,
    headers: getAuthHeaders(userToken)
  })
  return response.data
}

// Batch update multiple email preferences at once
export async function batchUpdatePreferences(
  userToken: string,
  preferences: EmailPreference[]
): Promise<BatchUpdateResponse> {
  const response = await axios({
    method: "POST",
    url: `${API_BASE_URL}/email/preferences/batch`,
    data: { preferences },
    headers: getAuthHeaders(userToken)
  })
  return response.data
}

// Get a list of available email types and their configuration
export async function getAvailableEmailTypes(userToken: string): Promise<EmailType[]> {
  const response = await axios({
    method: "GET",
    url: `${API_BASE_URL}/email/types`,
    headers: getAuthHeaders(userToken)
  })
  return response.data
}

// Service-based email sending endpoints (for admin/ops use)
export const emailServiceEndpoints = {
  // Announcements
  sendProductUpdate: (userToken: string, data: any) =>
    axios.post(`${API_BASE_URL}/email/announcements/product_updates`, data, {
      headers: getAuthHeaders(userToken)
    }),
  sendMaintenanceNotification: (userToken: string, data: any) =>
    axios.post(`${API_BASE_URL}/email/announcements/maintenance`, data, {
      headers: getAuthHeaders(userToken)
    }),
  sendCompanyNews: (userToken: string, data: any) =>
    axios.post(`${API_BASE_URL}/email/announcements/company_news`, data, {
      headers: getAuthHeaders(userToken)
    }),

  // Developer
  sendApiChanges: (userToken: string, data: any) =>
    axios.post(`${API_BASE_URL}/email/developer/api_changes`, data, {
      headers: getAuthHeaders(userToken)
    }),
  sendDeveloperResources: (userToken: string, data: any) =>
    axios.post(`${API_BASE_URL}/email/developer/resources`, data, {
      headers: getAuthHeaders(userToken)
    }),

  // Account
  sendSecurityAlert: (userToken: string, data: any) =>
    axios.post(`${API_BASE_URL}/email/account/security`, data, {
      headers: getAuthHeaders(userToken)
    }),
  sendBillingNotification: (userToken: string, data: any) =>
    axios.post(`${API_BASE_URL}/email/account/billing`, data, {
      headers: getAuthHeaders(userToken)
    }),

  // Reports
  sendWeeklyReport: (userToken: string, data: any) =>
    axios.post(`${API_BASE_URL}/email/weekly_report`, data, {
      headers: getAuthHeaders(userToken)
    }),
  sendPaymentActivation: (userToken: string, data: any) =>
    axios.post(`${API_BASE_URL}/email/payment_activation`, data, {
      headers: getAuthHeaders(userToken)
    }),
  sendInsufficientTokens: (userToken: string, data: any) =>
    axios.post(`${API_BASE_URL}/email/insufficient_tokens`, data, {
      headers: getAuthHeaders(userToken)
    })
}
