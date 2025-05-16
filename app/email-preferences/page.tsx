import { cache } from "react"
import { redirect } from "next/navigation"

import { findEmailTypeById } from "@/components/email-preferences/email-categories"
import { getEmailTypes } from "@/lib/email-type-api"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { domains } from "@/components/email-preferences/domains"
import { DomainHeader } from "@/components/email-preferences/domain-header"
import Link from "next/link"

// Cache the getEmailTypes call
const getCachedEmailTypes = cache(getEmailTypes)

export default async function EmailPreferencesPage({
  searchParams
}: {
  searchParams: Promise<{ unsubscribe?: string; token?: string }>
}) {
  const { unsubscribe, token } = await searchParams
  // Get email types
  const emailTypes = await getCachedEmailTypes()

  // If there's an unsubscribe parameter, handle the unsubscribe flow
  if (unsubscribe) {
    const emailType = findEmailTypeById(emailTypes, unsubscribe)

    // If we found the email type, redirect to its domain page with the token
    // We don't want to redirect to the account domain
    if (emailType && emailType.domain !== "Account") {
      redirect(
        `/email-preferences/${emailType.domain.toLowerCase()}?unsubscribe=${unsubscribe}${token ? `&token=${token}` : ""}`
      )
    }
  }

  // If no unsubscribe parameter or invalid email type, show the main preferences page
  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="block px-1 md:hidden" />
          <h1 className="font-bold text-3xl">Email Preferences</h1>
        </div>
        <p className="mt-1 text-muted-foreground">
          Manage your email notification preferences for different types of communications from
          Meeting BaaS.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {domains.map((domain) => (
          <Link href={`/email-preferences/${domain.type.toLowerCase()}`} key={domain.type}>
            <DomainHeader config={domain} className="transition-colors hover:border-primary" />
          </Link>
        ))}
      </div>
    </>
  )
}
