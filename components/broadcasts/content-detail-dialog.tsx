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
          // biome-ignore lint/security/noDangerouslySetInnerHtml: This is sanitised content from the backend
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(content ?? "")
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
