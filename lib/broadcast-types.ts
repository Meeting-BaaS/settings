import type { EmailFrequency, EmailType } from "@/lib/email-types"

export type Content = {
  id: number
  emailType: EmailType["id"]
  content: string
  contentText: string
  createdAt: string
  accountId: string
  name: string
}

export type RecipientParams = {
  emailId: EmailType["id"]
  frequency: EmailFrequency
}

export type Recipient = {
  email: string
  firstname: string
  lastname: string
}

export type BroadcastParams = {
  emailId: EmailType["id"]
  frequency: EmailFrequency
  subject: string
  contentIds: Content["id"][]
  recipient: Recipient
}
