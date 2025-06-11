import type { ContentFormValues } from "@/lib/schemas/content"
import type { BroadcastParams, Content, Recipient, RecipientParams } from "@/lib/broadcast-types"

export async function saveContent(data: ContentFormValues) {
  const response = await fetch("/api/email/admin/content", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to save content: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function getContents(): Promise<Content[]> {
  const response = await fetch("/api/email/admin/content")

  if (!response.ok) {
    throw new Error(`Failed to get contents: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()

  return json.data
}

export async function getRecipients(params: RecipientParams): Promise<Recipient[]> {
  const queryParams = new URLSearchParams()
  queryParams.append("emailId", params.emailId)
  queryParams.append("frequency", params.frequency)

  if (params.botCountLessThan) {
    queryParams.append("botCountLessThan", params.botCountLessThan)
  }
  if (params.lastBotMoreThanDays) {
    queryParams.append("lastBotMoreThanDays", params.lastBotMoreThanDays)
  }

  const response = await fetch(`/api/email/admin/recipients?${queryParams.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to get recipients: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()

  return json.data
}

export async function sendBroadcast(data: BroadcastParams) {
  const response = await fetch("/api/email/admin/send-email", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to send broadcast: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
