"use client"

import { useEmailPreferences } from "@/hooks/use-email-preferences"
import type { DomainConfig, EmailType } from "@/lib/email-types"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { getDomainFrequency } from "@/components/email-preferences/domain-frequency"
import { DomainHeader } from "@/components/email-preferences/domain-header"
import { ServiceWideControls } from "@/components/email-preferences/service-wide-controls"
import { EmailSettings } from "@/components/email-preferences/email-settings"
import { UnsubscribedState } from "@/components/email-preferences/unsubscribed-state"
import { EmailPreference } from "@/components/email-preferences/email-preference-card"
import { AccountSection } from "@/components/email-preferences/account-section"
import { UnsubscribeDialog } from "@/components/email-preferences/unsubscribe-dialog"
import { getEmailsByDomain } from "@/components/email-preferences/email-categories"

type ConfirmDialog = {
  isOpen: boolean
  emailId: string
  emailName: string
}
const defaultConfirmDialog: ConfirmDialog = {
  isOpen: false,
  emailId: "",
  emailName: ""
}

export default function DomainEmailPreferences({
  domainConfig,
  unsubscribeEmailType,
  token,
  emailTypes
}: {
  domainConfig: DomainConfig
  unsubscribeEmailType?: EmailType
  token?: string
  emailTypes: EmailType[]
}) {
  const { preferences, isLoading, updateService, unsubscribe } = useEmailPreferences()

  // If there's an unsubscribe parameter, show the confirm dialog
  let initialConfirmDialog = { ...defaultConfirmDialog }
  if (unsubscribeEmailType && token) {
    initialConfirmDialog = {
      isOpen: true,
      emailId: unsubscribeEmailType.id,
      emailName: unsubscribeEmailType.name
    }
  }

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>(initialConfirmDialog)

  // Handle unsubscribe confirmation
  const handleUnsubscribe = () => {
    if (confirmDialog.emailId && token) {
      unsubscribe({ emailId: confirmDialog.emailId, token })
    }
    setConfirmDialog(defaultConfirmDialog)
  }

  // If preferences haven't loaded yet, show loading state
  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="size-4 animate-spin stroke-primary" />
      </div>
    )
  }

  const domainFrequency = getDomainFrequency(domainConfig.type, preferences, emailTypes)
  const domainEmails = getEmailsByDomain(emailTypes, domainConfig.type)

  return (
    <>
      <DomainHeader config={domainConfig} />
      {domainConfig.type !== "account" ? (
        <>
          <ServiceWideControls
            domainConfig={domainConfig}
            emailTypes={domainEmails}
            onUnsubscribe={(emailId: string, emailName: string) =>
              setConfirmDialog({
                isOpen: true,
                emailId,
                emailName
              })
            }
          />

          {domainFrequency !== "none" ? (
            <EmailSettings
              domain={domainConfig.type}
              emailTypes={domainEmails}
              onUnsubscribe={(emailId: string, emailName: string) =>
                setConfirmDialog({
                  isOpen: true,
                  emailId,
                  emailName
                })
              }
            />
          ) : (
            <div className="space-y-4">
              <UnsubscribedState
                domainConfig={domainConfig}
                onResubscribe={() =>
                  updateService({ domain: domainConfig.type, frequency: "monthly" })
                }
              />
              {/* Always show required emails, even when domain is set to 'none' */}
              {domainEmails
                .filter((email) => email.required)
                .map((emailType) => (
                  <EmailPreference
                    key={emailType.id}
                    emailType={emailType}
                    onUnsubscribe={(emailId: string, emailName: string) =>
                      setConfirmDialog({
                        isOpen: true,
                        emailId,
                        emailName
                      })
                    }
                  />
                ))}
            </div>
          )}
        </>
      ) : (
        <AccountSection
          domain={domainConfig.type}
          emailTypes={domainEmails}
          onUnsubscribe={(emailId: string, emailName: string) =>
            setConfirmDialog({
              isOpen: true,
              emailId,
              emailName
            })
          }
        />
      )}

      {/* Confirmation Dialog */}
      <UnsubscribeDialog
        isOpen={confirmDialog.isOpen}
        onDialogClose={() => setConfirmDialog(defaultConfirmDialog)}
        onConfirm={handleUnsubscribe}
        emailId={confirmDialog.emailId}
        emailName={confirmDialog.emailName}
      />
    </>
  )
}
