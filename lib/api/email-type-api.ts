// Get a list of email types and their configuration

import type { EmailType } from "@/lib/email-types"
import { cookies } from "next/headers"

// This is called from RSCs and requires the complete URL + needs the cookies to be passed
export async function getEmailTypes(): Promise<EmailType[]> {
  const jwt = (await cookies()).get("jwt")?.value || ""
  const response = await fetch(`${process.env.API_SERVER_BASEURL}/email/types`, {
    method: "GET",
    headers: {
      Cookie: `jwt=${jwt}`,
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to get email types: ${response.status} ${response.statusText}`)
  }

  return (await response.json()).data as EmailType[]
}
