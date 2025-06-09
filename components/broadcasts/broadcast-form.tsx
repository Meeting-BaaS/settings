"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { broadcastFormSchema, type BroadcastFormValues } from "@/lib/schemas/broadcast"
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
import { Button } from "@/components/ui/button"
import type { EmailType } from "@/lib/email-types"

interface BroadcastFormProps {
  broadcastTypes: EmailType[]
  values: BroadcastFormValues
  onSubmit: (data: BroadcastFormValues) => void
}

export function BroadcastForm({ broadcastTypes, values, onSubmit }: BroadcastFormProps) {
  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastFormSchema),
    defaultValues: values
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 items-start gap-4 md:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="emailType"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
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
          name="frequency"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Target Audience</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select frequency preference" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Daily">Daily subscribers</SelectItem>
                  <SelectItem value="Weekly">Weekly subscribers</SelectItem>
                  <SelectItem value="Monthly">Monthly subscribers</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end md:col-span-2">
          <Button type="submit" className="w-full md:w-auto">
            Continue
          </Button>
        </div>
      </form>
    </Form>
  )
}
