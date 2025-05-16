// Meeting BaaS environment prefix for app URLs. For lower environments, it would be something like pre-prod-
// It would be empty for prod.
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || ""

// Chat App
export const AI_CHAT_URL = `https://chat.${environment}meetingbaas.com`

// Meeting BaaS home page
export const MEETING_BAAS_HOMEPAGE_URL = "https://meetingbaas.com"

// Terms of use
export const TERMS_AND_CONDITIONS_URL = "https://meetingbaas.com/terms-and-conditions"

// Privacy policy
export const PRIVACY_POLICY_URL = "https://meetingbaas.com/privacy"

// Utility
export const SETTINGS_URL = `https://${environment}meetingbaas.com`
export const LOGS_URL = `${SETTINGS_URL}/logs`
export const CREDENTIALS_URL = `${SETTINGS_URL}/credentials`
export const CONSUMPTION_URL = `${SETTINGS_URL}/usage`
export const BILLING_URL = `${SETTINGS_URL}/billing`

// Github
export const GITHUB_REPO_URL = "https://github.com/Meeting-Baas/settings"
