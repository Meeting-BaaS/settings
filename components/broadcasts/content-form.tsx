"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contentFormSchema, type ContentFormValues } from "@/lib/schemas/content"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Editor } from "@/components/ui/editor"
import { Button } from "@/components/ui/button"
import type { EmailType } from "@/lib/email-types"
import { useState } from "react"
import { saveContent } from "@/lib/api/broadcast-api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface ContentFormProps {
  broadcastTypes: EmailType[]
}

export function ContentForm({ broadcastTypes }: ContentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      emailType: "",
      content: "",
      contentText: ""
    }
  })

  const onSubmit = async (data: ContentFormValues) => {
    setIsLoading(true)
    try {
      await saveContent(data)
      toast.success("Content saved successfully")
      form.reset()
    } catch (error) {
      console.error(error)
      toast.error("Failed to save content")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="emailType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full md:w-1/2 lg:w-1/3">
                    <SelectValue placeholder="Select email type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {broadcastTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Editor value={field.value} onChange={field.onChange} className="min-h-[200px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isLoading}
            aria-disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" /> Saving...
              </>
            ) : (
              "Save Content"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
