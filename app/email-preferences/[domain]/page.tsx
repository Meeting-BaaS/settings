import { Suspense } from "react"
import { Loader2 } from "lucide-react"

import DomainEmailPreferences from "@/components/email-preferences"
import { getDomainConfig } from "@/components/email-preferences/domains"
import { getEmailCategories, findEmailTypeById } from "@/components/email-preferences/email-categories"
import { getJwt } from "@/lib/auth"

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

  // Get JWT for API calls
  const jwt = await getJwt()
  if (!jwt) {
    return <div>Authentication required</div>
  }

  // Fetch email categories
  const emailTypes = await getEmailCategories(jwt)

  // If there's an unsubscribe parameter, handle the unsubscribe flow
  if (unsubscribe && token) {
    const emailType = findEmailTypeById(emailTypes, unsubscribe)

    // If we found the email type, return the page with unsubscribed email type and token
    if (emailType && emailType.domain !== "account") {
      return (
        <Suspense
          fallback={
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="size-4 animate-spin stroke-primary" />
            </div>
          }
        >
          <DomainEmailPreferences
            domainConfig={domainConfig}
            unsubscribeEmailType={emailType}
            token={token}
            emailTypes={emailTypes}
          />
        </Suspense>
      )
    }
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="size-4 animate-spin stroke-primary" />
        </div>
      }
    >
      <DomainEmailPreferences domainConfig={domainConfig} emailTypes={emailTypes} />
    </Suspense>
  )
}
