import { cache } from "react"
import { getEmailTypes } from "@/lib/api/email-type-api"
import EmailPreferencesLayoutClient from "./layout-client"
// Cache the getEmailTypes call
const getCachedEmailTypes = cache(getEmailTypes)

export default async function EmailPreferencesLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const emailTypes = await getCachedEmailTypes()

  return (
    <EmailPreferencesLayoutClient emailTypes={emailTypes}>{children}</EmailPreferencesLayoutClient>
  )
}
