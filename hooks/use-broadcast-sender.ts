import { useState } from "react"
import { sendBroadcast } from "@/lib/api/broadcast-api"
import type { Recipient, Content } from "@/lib/broadcast-types"
import { toast } from "sonner"
import type { EmailFrequency } from "@/lib/email-types"

const BATCH_SIZE = 20

interface UseBroadcastSenderProps {
  emailId: string
  frequency: EmailFrequency
  selectedContent: Content["id"][]
}

interface BroadcastProgress {
  current: number
  total: number
}

interface BroadcastResult {
  successCount: number
  errorRecipients: Recipient[]
}

export function useBroadcastSender({
  emailId,
  frequency,
  selectedContent
}: UseBroadcastSenderProps) {
  const [isSending, setIsSending] = useState(false)
  const [progress, setProgress] = useState<BroadcastProgress>({ current: 0, total: 0 })
  const [result, setResult] = useState<BroadcastResult>({ successCount: 0, errorRecipients: [] })

  const sendBroadcastToRecipients = async (recipients: Recipient[]) => {
    if (recipients.length === 0 || isSending) return

    setIsSending(true)
    const batches = Math.ceil(recipients.length / BATCH_SIZE)
    setProgress({ current: 0, total: recipients.length })
    setResult({ successCount: 0, errorRecipients: [] })

    try {
      let currentSuccessCount = 0
      const currentErrorRecipients: Recipient[] = []

      for (let i = 0; i < batches; i++) {
        const start = i * BATCH_SIZE
        const end = Math.min(start + BATCH_SIZE, recipients.length)
        const batchRecipients = recipients.slice(start, end)

        const promises = batchRecipients.map((recipient) =>
          sendBroadcast({
            emailId,
            contentIds: selectedContent,
            recipient,
            frequency
          })
        )

        const results = await Promise.allSettled(promises)
        results.forEach((r, index) => {
          if (r.status === "fulfilled") {
            currentSuccessCount++
          } else {
            currentErrorRecipients.push(batchRecipients[index])
          }
        })
        setProgress((prev) => ({ ...prev, current: prev.current + currentSuccessCount }))
      }

      setResult({
        successCount: currentSuccessCount,
        errorRecipients: currentErrorRecipients
      })
    } catch (error) {
      toast.error("Failed to send broadcast")
    } finally {
      setIsSending(false)
    }
  }

  const sendTestEmail = async (recipient: Recipient) => {
    try {
      await sendBroadcast({
        emailId,
        contentIds: selectedContent,
        recipient,
        frequency
      })
      toast.success("Test email sent successfully")
      return true
    } catch (error) {
      toast.error("Failed to send test email")
      return false
    }
  }

  return {
    isSending,
    progress,
    result,
    sendBroadcastToRecipients,
    sendTestEmail
  }
}
