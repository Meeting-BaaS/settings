import { redirect } from "next/navigation"

import { findEmailTypeById } from "@/components/email-preferences/email-categories"

export default async function EmailPreferencesPage({
  searchParams
}: {
  searchParams: Promise<{ unsubscribe?: string; token?: string }>
}) {
  const { unsubscribe, token } = await searchParams

  // If there's an unsubscribe parameter, handle the unsubscribe flow
  if (unsubscribe) {
    const emailType = findEmailTypeById(unsubscribe)

    // If we found the email type, redirect to its domain page with the token
    // We don't want to redirect to the account domain
    if (emailType && emailType.domain !== "account") {
      const redirectUrl = token
        ? `/email-preferences/${emailType.domain}?unsubscribe=${unsubscribe}&token=${token}`
        : `/email-preferences/${emailType.domain}`

      redirect(redirectUrl)
    }
  }

  // Default redirect to reports domain
  redirect("/email-preferences/reports")
}
