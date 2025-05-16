import { cache } from "react"
import { getEmailTypes } from "@/lib/api/email-type-api"
import { EmailTypesProvider } from "@/contexts/email-types-context"

// Cache the getEmailTypes call
const getCachedEmailTypes = cache(getEmailTypes)

export default async function EmailPreferencesLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const emailTypes = await getCachedEmailTypes()

  return <EmailTypesProvider emailTypes={emailTypes}>{children}</EmailTypesProvider>
}
