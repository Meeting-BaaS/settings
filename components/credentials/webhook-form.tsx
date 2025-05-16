"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { webhookSchema, type WebhookFormData } from "@/lib/schemas/webhook"
import Link from "next/link"
import { WEBHOOK_TEST_URL } from "@/lib/external-urls"
import { useEffect, useState } from "react"
import { useWebhook } from "@/hooks/use-webhook"
import { Check, Copy, Loader2 } from "lucide-react"
import { updateWebhookUrl } from "@/lib/api/webhook-api"
import { toast } from "sonner"

export function WebhookForm() {
  const [isCopied, setIsCopied] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const { webhookUrl, isLoadingWebhookUrl } = useWebhook()

  const form = useForm<WebhookFormData>({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      webhook_url: ""
    }
  })
  const {
    reset,
    formState: { isDirty }
  } = form

  useEffect(() => {
    if (webhookUrl) {
      reset({ webhook_url: webhookUrl })
    }
  }, [webhookUrl, reset])

  const onSubmit = async (data: WebhookFormData) => {
    if (isUpdating) return
    setIsUpdating(true)
    try {
      await updateWebhookUrl(data.webhook_url)
      toast.success("Webhook url updated successfully.")
      reset({ webhook_url: data.webhook_url })
    } catch (error) {
      console.error("error updating webhook url", error)
      toast.error("Failed to update webhook url. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(form.getValues("webhook_url"))
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (error) {
      console.error("error copying webhook url to clipboard", error)
      toast.error("Failed to copy webhook url. Please try again.")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="webhook_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Your webhook path:
                {isLoadingWebhookUrl && <Loader2 className="size-3 animate-spin stroke-primary" />}
              </FormLabel>
              <FormDescription>
                <span>
                  A webhook is an automated method for receiving real-time notifications. It allows
                  you to receive data as soon as an event occurs, rather than constantly checking
                  for new information.
                </span>
                <br />
                <span>
                  To test your webhook, you can use a tool like{" "}
                  <Button variant="link" asChild className="h-auto p-0">
                    <Link href={WEBHOOK_TEST_URL} target="_blank" rel="noopener noreferrer">
                      {WEBHOOK_TEST_URL}
                    </Link>
                  </Button>
                  . This tool will allow you to create a test webhook and verify its proper
                  functioning.
                </span>
              </FormDescription>
              <div className="relative">
                <FormControl className="relative">
                  <Input placeholder="https://example.com/webhook" {...field} className="pr-10" />
                </FormControl>
                {field.value && (
                  <div className="absolute top-0 right-0">
                    <Button variant="ghost" size="icon" type="button" onClick={copyToClipboard}>
                      {isCopied ? <Check className="stroke-primary" /> : <Copy />}
                    </Button>
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full justify-end md:w-auto">
          <Button type="submit" disabled={!isDirty} className="w-full md:w-auto">
            {isUpdating ? (
              <>
                Saving
                <Loader2 className="animate-spin" />
              </>
            ) : (
              "Save Webhook"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
