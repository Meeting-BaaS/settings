import { useState, useEffect } from "react"
import { getRecipients } from "@/lib/api/broadcast-api"
import type { Recipient, RecipientParams } from "@/lib/broadcast-types"
import type { EmailFrequency } from "@/lib/email-types"
import { toast } from "sonner"

interface UseBroadcastRecipientsProps {
  emailId: string
  frequency: EmailFrequency
  isOpen: boolean
}

export function useBroadcastRecipients({
  emailId,
  frequency,
  isOpen
}: UseBroadcastRecipientsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [recipients, setRecipients] = useState<Recipient[]>([])

  useEffect(() => {
    if (isOpen) {
      fetchRecipients()
    } else {
      setRecipients([])
    }
  }, [isOpen])

  const fetchRecipients = async () => {
    setIsLoading(true)
    try {
      const params: RecipientParams = {
        emailId,
        frequency
      }
      const data = await getRecipients(params)
      setRecipients(data)
    } catch (error) {
      console.error("Failed to fetch recipients", error)
      toast.error("Failed to fetch recipients")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    recipients
  }
}
