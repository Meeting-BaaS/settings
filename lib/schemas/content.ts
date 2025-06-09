import { z } from "zod"

export const contentFormSchema = z
  .object({
    emailType: z.string().min(1, "Please select a broadcast type"),
    content: z.string().min(1, "Please enter content"),
    contentText: z.string().optional().nullable()
  })
  .refine(
    (data) => {
      if (data.contentText?.trim()) {
        return true
      }
      return false
    },
    {
      message: "Please enter content",
      path: ["content"]
    }
  )

export type ContentFormValues = z.infer<typeof contentFormSchema>
