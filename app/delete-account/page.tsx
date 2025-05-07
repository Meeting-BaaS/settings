"use client"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function DeleteAccountPage() {
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleRequestDeletion = () => {
    // In a real app, you would send an API request
    // Here we'll just show a success message
    
    // Create mailto link
    const subject = encodeURIComponent("Account Deletion Request")
    const body = encodeURIComponent("I would like to request my account to be deleted. Please process this request at your earliest convenience.")
    const mailtoLink = `mailto:hello@meetingbaas.com?subject=${subject}&body=${body}`
    
    // Open email client
    window.open(mailtoLink, "_blank")
    
    toast.success("Email client opened. Please send the email to request account deletion.")
    setShowConfirmation(false)
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Delete Account</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Permanently delete your Meeting BaaS account and all associated data.
        </p>
      </div>
      
      <div className="mt-6 space-y-6">
        <div className="bg-destructive/10 border border-destructive rounded-md p-4">
          <h2 className="text-lg font-semibold text-destructive mb-2">Warning: This action cannot be undone</h2>
          <p className="text-sm mb-4">
            Deleting your account will:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm mb-4">
            <li>Permanently delete all your data from our systems</li>
            <li>Cancel all subscriptions and active services</li>
            <li>Remove access to all Meeting BaaS features</li>
            <li>Cannot be reversed or recovered</li>
          </ul>
          
          <p className="text-sm mb-4">
            To delete your account, you'll need to send an email to our support team to verify your identity and process the request.
          </p>
          
          {!showConfirmation ? (
            <Button 
              variant="destructive" 
              onClick={() => setShowConfirmation(true)}
            >
              Request Account Deletion
            </Button>
          ) : (
            <div className="space-y-4 border border-destructive p-4 rounded-md">
              <p className="text-sm font-medium">
                Are you absolutely sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleRequestDeletion}
                >
                  Yes, Send Deletion Request
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
} 