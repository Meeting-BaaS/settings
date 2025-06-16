import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { EmailType } from "@/lib/email-types"

interface NoRecipientsAlertProps {
  broadcastTypes: EmailType[]
  emailId: string
}

export function NoRecipientsAlert({ broadcastTypes, emailId }: NoRecipientsAlertProps) {
  return (
    <Alert variant="destructive" className="border-destructive">
      <AlertCircle className="size-4" />
      <AlertDescription>
        <div>
          No recipients have subscribed to receive{" "}
          <span className="font-bold">
            {broadcastTypes.find((type) => type.id === emailId)?.name}
          </span>{" "}
          on this frequency.
        </div>
      </AlertDescription>
    </Alert>
  )
}
