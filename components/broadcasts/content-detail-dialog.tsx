import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import DOMPurify from "dompurify"
import type { Content } from "@/lib/broadcast-types"
import { cn } from "@/lib/utils"

export function ContentDetailDialog({ content }: { content: Content["content"] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Content Details</DialogTitle>
        </DialogHeader>
        <div
          // Same styles as the editor
          className={cn(
            "p-4",
            "[&_.h1]:text-3xl [&_.h2]:text-2xl [&_.h3]:text-xl [&_.h4]:text-lg [&_.h5]:text-base [&_.h6]:text-sm",
            "[&_.ul]:my-2 [&_.ul]:list-disc [&_.ul]:pl-6",
            "[&_.ol]:my-2 [&_.ol]:list-decimal [&_.ol]:pl-6",
            "[&_.blockquote]:mt-2 [&_.blockquote]:border-border [&_.blockquote]:border-l-2 [&_.blockquote]:pl-4 [&_.blockquote]:italic",
            "[&_.code]:rounded [&_.code]:bg-muted [&_.code]:px-1 [&_.code]:py-0.5 [&_.code]:font-mono [&_.code]:text-sm",
            "[&_.pre]:mt-2 [&_.pre]:whitespace-break-spaces [&_.pre]:rounded-md [&_.pre]:bg-muted [&_.pre]:p-4 [&_.pre]:font-mono [&_.pre]:text-sm",
            "[&_.a]:text-primary [&_.a]:underline [&_.a]:underline-offset-4 [&_.a]:hover:text-primary/80"
          )}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: This is sanitised content from the backend
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(content ?? "")
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
