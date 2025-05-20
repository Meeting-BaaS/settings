import { cache } from "react"
import DomainEmailPreferences from "@/components/email-preferences"
import { getDomainConfig } from "@/components/email-preferences/domains"
import { findEmailTypeById } from "@/components/email-preferences/email-categories"
import { getEmailTypes } from "@/lib/api/email-type-api"

// Cache the getEmailTypes call
const getCachedEmailTypes = cache(getEmailTypes)

export default async function DomainPage({
  params,
  searchParams
}: {
  params: Promise<{ domain: string }>
  searchParams: Promise<{ unsubscribe?: string; token?: string }>
}) {
  const { domain } = await params
  const { unsubscribe, token } = await searchParams
  const domainConfig = getDomainConfig(domain)

  if (!domainConfig) {
    return <div>Invalid email preferences category</div>
  }

  // Fetch email types
  const emailTypes = await getCachedEmailTypes()

  // If there's an unsubscribe parameter, handle the unsubscribe flow
  if (unsubscribe && token) {
    const emailType = findEmailTypeById(emailTypes, unsubscribe)

    // If we found the email type, return the page with unsubscribed email type and token
    if (emailType && emailType.domain !== "Account") {
      return (
        <DomainEmailPreferences
          domainConfig={domainConfig}
          unsubscribeEmailType={emailType}
          token={token}
          emailTypes={emailTypes}
        />
      )
    }
  }

  return <DomainEmailPreferences domainConfig={domainConfig} emailTypes={emailTypes} />
}
