import type { DomainConfig, EmailFrequency, EmailType } from "@/lib/email-types"
import { cn } from "@/lib/utils"
import { RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"

interface EmailFrequencyRadioProps {
  frequency: EmailFrequency
  currentFrequency: EmailFrequency | undefined
  domainConfig?: DomainConfig
  emailType?: EmailType
}

export const EmailFrequencyRadio = ({
  frequency,
  currentFrequency,
  domainConfig,
  emailType
}: EmailFrequencyRadioProps) => {
  const id = domainConfig
    ? `service-${domainConfig.type}-${frequency}`
    : `${emailType?.id}-${frequency}`
  return (
    <label
      key={frequency}
      className={cn(
        "flex cursor-pointer items-center space-x-2 rounded-md border bg-transparent p-4 transition-colors hover:bg-muted/80",
        currentFrequency === frequency
          ? "border-primary ring-2 ring-primary"
          : "border-muted-foreground/10"
      )}
      htmlFor={id}
    >
      <RadioGroupItem value={frequency} id={id} />
      <Label htmlFor={id} className="cursor-pointer font-medium text-sm">
        {frequency}
      </Label>
    </label>
  )
}
