"use client"

import { Badge } from "@/components/ui/badge"

import { EmailPreference } from "./email-preference-card"
import { getEmailsByDomain } from "./email-categories"
import type { EmailDomain } from "@/lib/email-types"

interface EmailSettingsProps {
  domain: EmailDomain
  onUnsubscribe: (emailId: string, emailName: string) => void
}

export const EmailSettings = ({ domain, onUnsubscribe }: EmailSettingsProps) => {
  const optionalEmails = getEmailsByDomain(domain).filter((e) => !e.required)

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-medium text-lg">Individual Email Settings</h3>
        <Badge variant="outline" className="text-xs">
          {optionalEmails.length} Emails
        </Badge>
      </div>
      <div className="space-y-4">
        {optionalEmails.map((emailType) => (
          <EmailPreference key={emailType.id} emailType={emailType} onUnsubscribe={onUnsubscribe} />
        ))}
      </div>
    </>
  )
}
