"use client"

import { EmailTypesProvider } from "@/contexts/email-types-context"
import type { EmailType } from "@/lib/email-types"

export default function EmailPreferencesLayoutClient({
  children,
  emailTypes
}: {
  children: React.ReactNode
  emailTypes: EmailType[]
}) {
  return <EmailTypesProvider emailTypes={emailTypes}>{children}</EmailTypesProvider>
}
