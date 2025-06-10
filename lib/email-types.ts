/**
 * Email Preferences Type Definitions
 *
 * This file contains all types related to email preferences functionality.
 * It serves as a central location for type definitions used across the application.
 */

/**
 * Available email frequency options
 */
export type EmailFrequency = "Daily" | "Weekly" | "Monthly" | "Never"

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
  /** Which domain/service category this email belongs to */
  domain: EmailDomain
  /** If true, the email cannot be completely disabled */
  required: boolean
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
 * Error type for mutation errors
 */
export interface MutationError extends Error {
  previousState?: EmailPreferences
}

/**
 * Error type for resend errors
 */
export interface ResendError extends Error {
  nextAvailableAt?: string
}
