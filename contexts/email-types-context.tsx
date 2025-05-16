import { createContext } from "react"
import type { EmailType } from "@/lib/email-types"

type EmailTypesContextType = {
  emailTypes: EmailType[]
}

export const EmailTypesContext = createContext<EmailTypesContextType | undefined>(undefined)

export function EmailTypesProvider({
  children,
  emailTypes
}: { children: React.ReactNode; emailTypes: EmailType[] }) {
  return <EmailTypesContext.Provider value={{ emailTypes }}>{children}</EmailTypesContext.Provider>
}
