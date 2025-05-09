import type { EmailDomain, EmailType } from "@/lib/email-types"

// TODO: Fetch this from the API instead of hardcoding
export const emailCategories: EmailType[] = [
  // Reports (reports.meetingbaas.com)
  {
    id: "usage-reports",
    name: "Usage Reports",
    description: "Monthly reports on your Meeting BaaS usage and statistics.",
    domain: "reports",
    frequencies: ["daily", "weekly", "monthly"]
  },

  // Announcements (announcements.meetingbaas.com)
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

  // Developers (developers.meetingbaas.com)
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

  // Account notifications (required)
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

// Group email types by domain
export const getEmailsByDomain = (domain: EmailDomain) => {
  return emailCategories.filter((email) => email.domain === domain)
}

// Find email type by ID
export const findEmailTypeById = (id: string) => {
  return emailCategories.find((type) => type.id === id)
}
