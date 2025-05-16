"use client"

import { ApiKey } from "./api-key"
import { WebhookForm } from "./webhook-form"

interface CredentialsProps {
  apiKey: string
}

export default function Credentials({ apiKey }: CredentialsProps) {
  return (
    <div className="flex flex-col gap-8">
      <ApiKey apiKey={apiKey} />
      <WebhookForm />
    </div>
  )
}
