import type { ContentFormValues } from "../schemas/content"

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
