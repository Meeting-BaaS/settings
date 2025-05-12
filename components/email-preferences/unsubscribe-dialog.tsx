"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface UnsubscribeDialogProps {
  isOpen: boolean
  onDialogClose: () => void
  onConfirm: () => void
  emailId: string
  emailName: string
}

export const UnsubscribeDialog = ({
  isOpen,
  onDialogClose,
  onConfirm,
  emailId,
  emailName
}: UnsubscribeDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onDialogClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsubscribe from {emailName}?</AlertDialogTitle>
          <AlertDialogDescription>
            You will no longer receive {emailName} emails. You can resubscribe at any time from your
            email preferences.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onDialogClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Unsubscribe</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
