import axios from "axios";

import {
  BatchUpdateResponse,
  EmailFrequency,
  EmailPreference,
  EmailPreferences,
  EmailType,
  ResendEmailResponse,
  ServiceFrequencyUpdate,
  ServiceUpdateResponse,
} from "./email-types";

// =================================================================
// MOCK IMPLEMENTATION - TO BE REPLACED WITH REAL API ENDPOINTS LATER
// =================================================================
// TODO: Replace these mock implementations with actual API calls to your backend
// Each function has a console.log that shows what data is being sent/received
// Search for "[MOCK]" to find all the places that need to be updated with real API calls
// =================================================================

// Update email frequency for a single email type
export async function updateEmailFrequency(
  userToken: string,
  emailId: string,
  frequency: EmailFrequency
): Promise<{ success: boolean }> {
  // MOCK IMPLEMENTATION - Replace with actual API call
  console.log(
    `[MOCK API] updateEmailFrequency: Setting ${emailId} to ${frequency}`
  );
  console.log(`[MOCK API] Auth token: ${userToken}`);

  // In production, this would call your backend API
  // TODO: Replace with actual API endpoint
  try {
    return (
      await axios({
        method: "POST",
        url: `/api/email-preferences/${emailId}`,
        data: { frequency },
        headers: {
          Authorization: userToken,
        },
      })
    ).data;
  } catch (error) {
    console.error("[MOCK API] Error in updateEmailFrequency:", error);
    // For the mock implementation, we're simulating a successful response
    // In production, you should remove this and let the error propagate
    return { success: true };
  }
}

// Update frequency for all emails within a service domain
export async function updateServiceFrequency(
  userToken: string,
  data: ServiceFrequencyUpdate
): Promise<ServiceUpdateResponse> {
  // MOCK IMPLEMENTATION - Replace with actual API call
  console.log(
    `[MOCK API] updateServiceFrequency: Setting all ${data.domain} emails to ${data.frequency}`
  );
  console.log(`[MOCK API] Auth token: ${userToken}`);

  // In production, this would call your backend API
  // TODO: Replace with actual API endpoint
  try {
    return (
      await axios({
        method: "POST",
        url: `/api/email-preferences/service/${data.domain}`,
        data: { frequency: data.frequency },
        headers: {
          Authorization: userToken,
        },
      })
    ).data;
  } catch (error) {
    console.error("[MOCK API] Error in updateServiceFrequency:", error);
    // For the mock implementation, we're simulating a successful response with fake data
    return {
      success: true,
      updatedEmails: [`${data.domain}-1`, `${data.domain}-2`],
    };
  }
}

// Unsubscribe from a specific email using unsubscribe token
export async function unsubscribeWithToken(
  emailId: string,
  token: string
): Promise<{ success: boolean }> {
  // MOCK IMPLEMENTATION - Replace with actual API call
  console.log(`[MOCK API] unsubscribeWithToken: Unsubscribing from ${emailId}`);
  console.log(`[MOCK API] Token: ${token}`);

  // In production, this would validate the token and unsubscribe the user
  // TODO: Replace with actual API endpoint
  try {
    return (
      await axios({
        method: "POST",
        url: `/api/email-preferences/unsubscribe`,
        data: {
          emailId,
          token,
        },
      })
    ).data;
  } catch (error) {
    console.error("[MOCK API] Error in unsubscribeWithToken:", error);
    // For the mock implementation, we're simulating a successful response
    return { success: true };
  }
}

// Get all email preferences for the user
export async function getEmailPreferences(
  userToken: string
): Promise<EmailPreferences> {
  // MOCK IMPLEMENTATION - Replace with actual API call
  console.log("[MOCK API] getEmailPreferences: Fetching user preferences");
  console.log(`[MOCK API] Auth token: ${userToken}`);

  // In production, this would fetch real preferences from your backend
  // TODO: Replace with actual API endpoint
  try {
    return (
      await axios({
        method: "GET",
        url: `/api/email-preferences`,
        headers: {
          Authorization: userToken,
        },
      })
    ).data;
  } catch (error) {
    console.error("[MOCK API] Error in getEmailPreferences:", error);
    // For the mock implementation, we're simulating a response with fake data
    return {
      "usage-reports": "monthly",
      "product-updates": "weekly",
      "maintenance-notifications": "daily",
      "company-news": "monthly",
      "api-changes": "weekly",
      "developer-resources": "monthly",
      "security-alerts": "daily",
      "billing-notifications": "monthly",
    };
  }
}

// Request to resend the latest email of a specific type
export async function resendLatestEmail(
  userToken: string,
  emailId: string
): Promise<ResendEmailResponse> {
  // MOCK IMPLEMENTATION - Replace with actual API call
  console.log(
    `[MOCK API] resendLatestEmail: Resending latest ${emailId} email`
  );
  console.log(`[MOCK API] Auth token: ${userToken}`);

  // In production, this would trigger an email resend from your backend
  // TODO: Replace with actual API endpoint
  try {
    return (
      await axios({
        method: "POST",
        url: `/api/email/${emailId}/resend`,
        headers: {
          Authorization: userToken,
        },
      })
    ).data;
  } catch (error) {
    console.error("[MOCK API] Error in resendLatestEmail:", error);
    // For the mock implementation, we're simulating a successful response
    return { success: true, message: "Email queued for delivery" };
  }
}

// Batch update multiple email preferences at once
export async function batchUpdatePreferences(
  userToken: string,
  preferences: EmailPreference[]
): Promise<BatchUpdateResponse> {
  // MOCK IMPLEMENTATION - Replace with actual API call
  console.log(
    `[MOCK API] batchUpdatePreferences: Updating ${preferences.length} preferences`
  );
  console.log(`[MOCK API] Auth token: ${userToken}`);
  console.log(`[MOCK API] Preferences: ${JSON.stringify(preferences)}`);

  // In production, this would update multiple preferences at once in your backend
  // TODO: Replace with actual API endpoint
  try {
    return (
      await axios({
        method: "POST",
        url: `/api/email-preferences/batch`,
        data: { preferences },
        headers: {
          Authorization: userToken,
        },
      })
    ).data;
  } catch (error) {
    console.error("[MOCK API] Error in batchUpdatePreferences:", error);
    // For the mock implementation, we're simulating a successful response
    return { success: true, updatedCount: preferences.length };
  }
}

// Get a list of available email types and their configuration
export async function getAvailableEmailTypes(
  userToken: string
): Promise<EmailType[]> {
  // MOCK IMPLEMENTATION - Replace with actual API call
  console.log(
    "[MOCK API] getAvailableEmailTypes: Fetching email types configuration"
  );
  console.log(`[MOCK API] Auth token: ${userToken}`);

  // In production, this would fetch the email types configuration from your backend
  // TODO: Replace with actual API endpoint
  try {
    return (
      await axios({
        method: "GET",
        url: `/api/email-types`,
        headers: {
          Authorization: userToken,
        },
      })
    ).data;
  } catch (error) {
    console.error("[MOCK API] Error in getAvailableEmailTypes:", error);
    // For the mock implementation, we're returning a default configuration
    // This should match the EMAIL_TYPES array in page.tsx
    return [
      {
        id: "usage-reports",
        name: "Usage Reports",
        description:
          "Monthly reports on your Meeting BaaS usage and statistics.",
        domain: "reports",
        frequencies: ["daily", "weekly", "monthly"],
      },
      {
        id: "product-updates",
        name: "Product Updates",
        description: "New features and improvements to the platform.",
        domain: "announcements",
        frequencies: ["weekly", "monthly"],
      },
      {
        id: "maintenance-notifications",
        name: "Maintenance Notifications",
        description: "Scheduled maintenance and system updates.",
        domain: "announcements",
        frequencies: ["daily"],
      },
      {
        id: "company-news",
        name: "Company News",
        description: "News and announcements about Meeting BaaS.",
        domain: "announcements",
        frequencies: ["monthly"],
      },
      {
        id: "api-changes",
        name: "API Changes",
        description: "Updates and changes to the Meeting BaaS API.",
        domain: "developers",
        frequencies: ["daily", "weekly", "monthly"],
      },
      {
        id: "developer-resources",
        name: "Developer Resources",
        description: "New resources, tutorials and documentation.",
        domain: "developers",
        frequencies: ["daily", "weekly", "monthly"],
      },
      {
        id: "security-alerts",
        name: "Security Alerts",
        description: "Important security notifications about your account.",
        domain: "account",
        frequencies: ["daily"],
        required: true,
      },
      {
        id: "billing-notifications",
        name: "Billing Notifications",
        description: "Invoices and payment confirmations.",
        domain: "account",
        frequencies: ["daily", "weekly", "monthly"],
        required: true,
      },
    ];
  }
}
