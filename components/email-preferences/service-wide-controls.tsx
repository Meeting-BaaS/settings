"use client"

import { Info } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup } from "@/components/ui/radio-group"

import { useEmailPreferences } from "@/hooks/use-email-preferences"
import type { DomainConfig, EmailDomain, EmailFrequency, EmailType } from "@/lib/email-types"
import { cn } from "@/lib/utils"
import { EmailFrequencyRadio } from "./email-frequency-radio"
import { getDomainFrequency } from "./domain-frequency"

const frequencies: EmailFrequency[] = ["daily", "weekly", "monthly", "none"]

interface ServiceWideControlsProps {
  domainConfig: DomainConfig
  emailTypes: EmailType[]
  onUnsubscribe: (emailId: string, emailName: string) => void
}

export const ServiceWideControls = ({
  domainConfig,
  emailTypes,
  onUnsubscribe
}: ServiceWideControlsProps) => {
  const { preferences, updateService } = useEmailPreferences()
  const optionalEmails = emailTypes.filter((e) => !e.required)

  if (optionalEmails.length <= 1) return null

  const domainFrequency = getDomainFrequency(domainConfig.type, preferences, emailTypes)

  const handleServiceSubscription = (frequency: EmailFrequency) => {
    if (frequency === "none") {
      onUnsubscribe(`service-${domainConfig.type}`, `all optional ${domainConfig.name}`)
      return
    }
    updateService({ domain: domainConfig.type, frequency })
  }

  return (
    <Card className="mb-8 dark:bg-baas-neutral-500/30">
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className={cn("h-6 w-2 rounded-full", `bg-${domainConfig.color}`)} />
          <h3 className="font-medium text-lg">Service-wide Frequency</h3>
        </div>

        <p className="mb-4 text-muted-foreground text-sm">
          Control how often you receive all optional {domainConfig.name.toLowerCase()} in a single
          place. This will affect all non-required emails in this category.
        </p>

        <RadioGroup
          value={domainFrequency === "mixed" ? undefined : domainFrequency}
          onValueChange={(value) => handleServiceSubscription(value as EmailFrequency)}
          className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {frequencies.map((frequency) => (
            <EmailFrequencyRadio
              key={frequency}
              frequency={frequency}
              currentFrequency={domainFrequency === "mixed" ? undefined : domainFrequency}
              domainConfig={domainConfig}
            />
          ))}
        </RadioGroup>

        {domainFrequency !== "none" && domainFrequency !== "mixed" && (
          <Alert className="mt-4" variant="info">
            <Info className="size-4" />
            <AlertDescription>
              You will receive {domainFrequency} emails for all optional {domainConfig.name.toLowerCase()}{" "}
              notifications.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
