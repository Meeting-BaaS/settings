"use client"

import { RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { RadioGroup } from "@/components/ui/radio-group"

import { useEmailPreferences } from "@/hooks/use-email-preferences"
import type { EmailFrequency, EmailType } from "@/lib/email-types"
import { Button } from "@/components/ui/button"
import { EmailFrequencyRadio } from "./email-frequency-radio"

interface EmailPreferenceProps {
  emailType: EmailType
  onUnsubscribe: (emailId: string, emailName: string) => void
}

export const EmailPreference = ({ emailType, onUnsubscribe }: EmailPreferenceProps) => {
  const { preferences, updatePreference, resendLatest } = useEmailPreferences()

  const currentFrequency = preferences?.[emailType.id]
  const isSelectable =
    !emailType.required || (emailType.required && emailType.frequencies.length > 1)

  const handleFrequencyChange = (frequency: EmailFrequency) => {
    // Same frequency selection
    if (currentFrequency === frequency) {
      return
    }
    // required emails
    if (emailType.required && frequency === "none") {
      toast.error(`${emailType.name} notifications cannot be disabled.`)
      return
    }

    // Unsubscribe confirmation
    if (frequency === "none") {
      onUnsubscribe(emailType.id, emailType.name)
      return
    }

    // Update preference
    updatePreference({ id: emailType.id, frequency })
  }

  const handleResendLatest = () => {
    resendLatest(emailType.id)
  }

  return (
    <Card
      key={emailType.id}
      className={isSelectable ? "transition-colors hover:border-primary/50" : ""}
    >
      <CardHeader className="gap-0 py-0">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{emailType.name}</h4>
            {emailType.required && (
              <Badge variant="primary" className="text-xs">
                Required
              </Badge>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            type="button"
            onClick={handleResendLatest}
            className="text-primary hover:text-primary"
            aria-label={`Resend latest ${emailType.name} email`}
          >
            <RefreshCw className="size-3" />
            Resend Latest
          </Button>
        </div>
        <CardDescription className="mt-1 text-muted-foreground text-sm">
          {emailType.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="mb-2 block font-medium text-sm">Email Frequency</div>
        <RadioGroup
          value={currentFrequency}
          onValueChange={(value) => handleFrequencyChange(value as EmailFrequency)}
          className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {emailType.frequencies.map((frequency) => (
            <EmailFrequencyRadio
              key={frequency}
              frequency={frequency}
              currentFrequency={currentFrequency ?? "none"}
              emailType={emailType}
            />
          ))}
          {!emailType.required && (
            <EmailFrequencyRadio
              frequency="none"
              currentFrequency={currentFrequency ?? "none"}
              emailType={emailType}
            />
          )}
        </RadioGroup>

        {currentFrequency !== "none" && (
          <p className="text-muted-foreground text-xs">
            You will receive {currentFrequency} emails.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
