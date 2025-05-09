"use client"

import { AlertCircle } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"

import { useEmailPreferences } from "@/hooks/use-email-preferences"
import type { EmailDomain } from "@/lib/email-types"

interface UnsubscribeDialogProps {
  isOpen: boolean
  onDialogClose: () => void
  emailId: string
  emailName: string
}

export function UnsubscribeDialog({
  isOpen,
  onDialogClose,
  emailId,
  emailName
}: UnsubscribeDialogProps) {
  const { updatePreference, updateService, unsubscribeWithToken } = useEmailPreferences()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const handleConfirmUnsubscribe = () => {
    // If there's a token, unsubscribe with token
    if (token) {
      unsubscribeWithToken({ emailId, token })
    }
    // Check if this is a service-level unsubscribe
    else if (emailId.startsWith("service-")) {
      const domain = emailId.replace("service-", "") as EmailDomain
      updateService({ domain, frequency: "none" })
    } else {
      updatePreference({ id: emailId, frequency: "none" })
    }
    handleClose()
  }

  const handleClose = () => {
    // Clear search params and close dialog
    const params = new URLSearchParams(searchParams.toString())
    params.delete("unsubscribe")
    params.delete("token")
    router.replace(window.location.pathname + (params.toString() ? `?${params.toString()}` : ""), {
      scroll: false
    })
    onDialogClose()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Confirm unsubscribe
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to unsubscribe from <strong>{emailName}</strong> emails? You may
            miss important updates related to your account or service.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmUnsubscribe}>Yes, unsubscribe</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
