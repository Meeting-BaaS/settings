import DomainEmailPreferences from "@/components/email-preferences"
import { getDomainConfig } from "@/components/email-preferences/domains"
import { findEmailTypeById } from "@/components/email-preferences/email-categories"

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

  // If there's an unsubscribe parameter, handle the unsubscribe flow
  if (unsubscribe && token) {
    const emailType = findEmailTypeById(unsubscribe)

    // If we found the email type, return the page with unsubscribed email type and token
    if (emailType && emailType.domain !== "account") {
      return (
        <DomainEmailPreferences
          domainConfig={domainConfig}
          unsubscribeEmailType={emailType}
          token={token}
        />
      )
    }
  }

  return <DomainEmailPreferences domainConfig={domainConfig} />
}
