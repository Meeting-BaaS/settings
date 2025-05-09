import type { DomainConfig } from "@/lib/email-types"

export const domains: DomainConfig[] = [
  {
    type: "reports",
    color: "bg-blue-500",
    badge:
      "text-blue-500 border-blue-200 bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
    name: "Reports",
    description: "Reports and metrics about your Meeting BaaS usage.",
    domain: "reports.meetingbaas.com"
  },
  {
    type: "announcements",
    color: "bg-green-500",
    badge:
      "text-green-500 border-green-200 bg-green-100 dark:border-green-800 dark:bg-green-950 dark:text-green-400",
    name: "Announcements",
    description: "Product updates and important announcements.",
    domain: "announcements.meetingbaas.com"
  },
  {
    type: "developers",
    color: "bg-purple-500",
    badge:
      "text-purple-500 border-purple-200 bg-purple-100 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-400",
    name: "Developer Updates",
    description: "API updates and developer resources.",
    domain: "developers.meetingbaas.com"
  },
  {
    type: "account",
    color: "bg-red-500",
    badge:
      "text-red-500 border-red-200 bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
    name: "Account",
    description: "Required notifications related to your account.",
    domain: "account.meetingbaas.com"
  }
]

export const getDomainConfig = (domain: string) => {
  return domains.find((d) => d.type === domain)
}
