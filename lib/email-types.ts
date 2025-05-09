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
 * Email type definition as stored in the database
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
 * API responses
 */
export interface ApiResponse {
  success: boolean
}

export interface ServiceUpdateResponse extends ApiResponse {
  updatedEmails: string[]
}

export interface ResendEmailResponse extends ApiResponse {
  message: string
}

export interface BatchUpdateResponse extends ApiResponse {
  updatedCount: number
}
