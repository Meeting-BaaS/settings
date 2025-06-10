"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Content, Recipient } from "@/lib/broadcast-types"
import type { EmailFrequency, EmailType } from "@/lib/email-types"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "../ui/alert"
import { useSession } from "@/hooks/use-session"
import { useBroadcastSender } from "@/hooks/use-broadcast-sender"
import { useBroadcastRecipients } from "@/hooks/use-broadcast-recipients"
import { BroadcastStatus } from "./broadcast-status"

interface SendBroadcastDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  emailId: string
  broadcastTypes: EmailType[]
  frequency: EmailFrequency
  selectedContent: Content["id"][]
  subject: string
}

export function SendBroadcastDialog({
  open,
  onOpenChange,
  emailId,
  broadcastTypes,
  frequency,
  selectedContent,
  subject
}: SendBroadcastDialogProps) {
  const session = useSession()
  const [isTestEmailLoading, setIsTestEmailLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const { isLoading: isLoadingRecipients, recipients } = useBroadcastRecipients({
    emailId,
    frequency,
    isOpen: open
  })

  const { isSending, progress, result, sendBroadcastToRecipients, sendTestEmail } =
    useBroadcastSender({
      emailId,
      frequency,
      selectedContent,
      subject
    })

  useEffect(() => {
    if (!open) {
      setShowResults(false)
    }
  }, [open])

  const handleSend = async (retryRecipients?: Recipient[]) => {
    const recipientsToProcess = retryRecipients ?? recipients
    await sendBroadcastToRecipients(recipientsToProcess)
    setShowResults(true)
  }

  const handleTestEmail = async () => {
    if (!session || isTestEmailLoading) return
    const recipient = {
      email: session.user.email,
      firstname: session.user.firstname ?? "",
      lastname: session.user.lastname ?? ""
    }
    setIsTestEmailLoading(true)
    await sendTestEmail(recipient)
    setIsTestEmailLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Broadcast</DialogTitle>
          <DialogDescription className="sr-only">
            Send {broadcastTypes.find((type) => type.id === emailId)?.name} to {recipients.length}{" "}
            recipient(s)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoadingRecipients ? (
            <div className="flex items-center justify-center">
              <Loader2 className="size-4 animate-spin stroke-primary" />
            </div>
          ) : recipients.length === 0 ? (
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
          ) : (
            <>
              <p className="text-muted-foreground text-sm">
                The selected content {selectedContent.length === 1 ? "block" : "blocks"} will be
                sent to {recipients.length} recipient(s). Click{" "}
                <Button
                  variant="link"
                  onClick={handleTestEmail}
                  disabled={isTestEmailLoading}
                  className="h-auto p-0"
                >
                  here {isTestEmailLoading && <Loader2 className="animate-spin" />}
                </Button>{" "}
                to send a test email to yourself.
              </p>
              {showResults && (
                <BroadcastStatus
                  successCount={result.successCount}
                  errorRecipients={result.errorRecipients}
                  onRetry={handleSend}
                />
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSending}>
            Cancel
          </Button>
          {!showResults && (
            <Button onClick={() => handleSend()} disabled={isSending || recipients.length === 0}>
              {isSending ? (
                <>
                  <Loader2 className="animate-spin" />
                  {`Sending... ${progress.current}/${progress.total}`}
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
