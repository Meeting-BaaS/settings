import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { redirect } from "next/navigation"

import { getEmailCategories, findEmailTypeById } from "@/components/email-preferences/email-categories"
import { getJwt } from "@/lib/auth"

export default async function EmailPreferencesPage({
  searchParams
}: {
  searchParams: Promise<{ unsubscribe?: string; token?: string }>
}) {
  const { unsubscribe, token } = await searchParams

  // Get JWT for API calls
  const jwt = await getJwt()
  if (!jwt) {
    return <div>Authentication required</div>
  }

  // Fetch email categories
  const emailTypes = await getEmailCategories(jwt)

  // If there's an unsubscribe parameter, handle the unsubscribe flow
  if (unsubscribe) {
    const emailType = findEmailTypeById(emailTypes, unsubscribe)

    // If we found the email type, redirect to its domain page with the token
    // We don't want to redirect to the account domain
    if (emailType && emailType.domain !== "account") {
      redirect(`/email-preferences/${emailType.domain}?unsubscribe=${unsubscribe}${token ? `&token=${token}` : ""}`)
    }
  }

  // If no unsubscribe parameter or invalid email type, show the main preferences page
  return (
    <Suspense
      fallback={
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="size-4 animate-spin stroke-primary" />
        </div>
      }
    >
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold">Email Preferences</h1>
        <p className="text-muted-foreground">
          Manage your email notification preferences for different types of communications from Meeting
          BaaS.
        </p>
      </div>
    </Suspense>
  )
}
