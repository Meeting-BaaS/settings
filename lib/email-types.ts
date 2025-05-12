/**
 * Email Preferences Type Definitions
 *
 * This file contains all types related to email preferences functionality.
 * It serves as a central location for type definitions used across the application.
 */

/**
 * Available email frequency options
 */
export type EmailFrequency = "daily" | "weekly" | "monthly" | "none"

/**
 * Available service/domain categories
 */
export type EmailDomain = "reports" | "announcements" | "developers" | "account"

/**
 * Email type definition as returned by the backend API
 */
export interface EmailType {
  /** Unique identifier for the email type */
  id: string
  /** Display name of the email type */
  name: string
  /** Description of the email content */
  description: string
  /** Which domain/service category this email belongs to */
  domain: EmailDomain
  /** Which frequencies are available for this email type */
  frequencies: EmailFrequency[]
  /** If true, the email cannot be completely disabled */
  required?: boolean
  /** Optional metadata about the email type */
  metadata?: {
    /** Whether this email type supports resending */
    canResend?: boolean
    /** Whether this email type supports batch updates */
    supportsBatch?: boolean
    /** Whether this email type is deprecated */
    deprecated?: boolean
  }
}

/**
 * Single email preference update payload
 */
export interface EmailPreference {
  /** Email type ID to update */
  id: string
  /** New frequency setting */
  frequency: EmailFrequency
}

/**
 * Service-wide frequency update payload
 */
export interface ServiceFrequencyUpdate {
  /** Domain/service to update */
  domain: EmailDomain
  /** New frequency for all emails in this domain */
  frequency: EmailFrequency
}

/**
 * Domain configuration for styling and display
 */
export interface DomainConfig {
  color: string
  badge: string
  name: string
  description: string
  domain: string
  type: EmailDomain
}

/**
 * All email preferences for a user
 */
export type EmailPreferences = Record<string, EmailFrequency>

/**
 * Base API response type
 */
export interface ApiResponse {
  success: boolean
  message?: string
  error?: string
}

/**
 * Service update response
 */
export interface ServiceUpdateResponse extends ApiResponse {
  updatedEmails: string[]
}

/**
 * Resend email response
 */
export interface ResendEmailResponse extends ApiResponse {
  message: string
  queuedAt?: string
}

/**
 * Batch update response
 */
export interface BatchUpdateResponse extends ApiResponse {
  updatedCount: number
  failedUpdates?: Array<{
    id: string
    error: string
  }>
}

/**
 * Service-based email payloads
 */
export interface ProductUpdatePayload {
  title: string
  content: string
  features: string[]
  breakingChanges?: string[]
  releaseDate?: string
}

export interface MaintenancePayload {
  title: string
  content: string
  startTime: string
  endTime: string
  affectedServices: string[]
  severity: "low" | "medium" | "high"
}

export interface CompanyNewsPayload {
  title: string
  content: string
  category: "announcement" | "event" | "partnership" | "other"
  publishDate?: string
}

export interface ApiChangesPayload {
  title: string
  content: string
  version: string
  breakingChanges?: string[]
  migrationGuide?: string
}

export interface DeveloperResourcesPayload {
  title: string
  content: string
  resourceType: "tutorial" | "documentation" | "example" | "other"
  tags: string[]
}

export interface SecurityAlertPayload {
  title: string
  content: string
  severity: "low" | "medium" | "high" | "critical"
  affectedUsers: string[]
  actionRequired: boolean
}

export interface BillingPayload {
  title: string
  content: string
  amount: number
  currency: string
  dueDate?: string
  invoiceId?: string
}

export interface ReportPayload {
  startDate: string
  endDate: string
  metrics: Record<string, number>
  summary: string
  details?: Record<string, any>
}

export interface TokenPayload {
  userId: string
  currentBalance: number
  requiredBalance: number
  service: string
  actionRequired: boolean
}
