import { EmailTypesContext } from "@/contexts/email-types-context"
import { useContext } from "react"

export function useEmailTypes() {
  const context = useContext(EmailTypesContext)
  if (context === undefined) {
    throw new Error("useEmailTypes must be used within an EmailTypesProvider")
  }
  return context
}
