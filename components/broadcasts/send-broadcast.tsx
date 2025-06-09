"use client"

import { useState } from "react"
import type { EmailFrequency, EmailType } from "@/lib/email-types"
import { BroadcastForm } from "./broadcast-form"
import { ContentSelectionTable } from "@/components/broadcasts/content-selection-table"
import { SendBroadcastDialog } from "./send-broadcast-dialog"
import type { BroadcastFormValues } from "@/lib/schemas/broadcast"
import type { Content } from "@/lib/broadcast-types"
import { useContents } from "@/hooks/use-contents"
import { AnimatePresence, motion } from "motion/react"

interface SendBroadcastProps {
  broadcastTypes: EmailType[]
}

const initialBroadcastFormValues: BroadcastFormValues = {
  emailType: "",
  frequency: "Daily"
}

export function SendBroadcast({ broadcastTypes }: SendBroadcastProps) {
  const { contents, isLoadingContents } = useContents()

  const [step, setStep] = useState<"form" | "content">("form")
  const [broadcastFormValues, setBroadcastFormValues] = useState<BroadcastFormValues>(
    initialBroadcastFormValues
  )
  const [selectedContent, setSelectedContent] = useState<Content["id"][]>([])
  const [showSendDialog, setShowSendDialog] = useState(false)

  const handleFormSubmit = (data: BroadcastFormValues) => {
    setBroadcastFormValues(data)
    setStep("content")
  }

  const handleContentBack = () => {
    setStep("form")
  }

  const handleSend = (selectedContent: Content["id"][]) => {
    setSelectedContent(selectedContent)
    setShowSendDialog(true)
  }

  const stepComponent = () => {
    switch (step) {
      case "form":
        return (
          <BroadcastForm
            broadcastTypes={broadcastTypes}
            values={broadcastFormValues}
            onSubmit={handleFormSubmit}
          />
        )
      case "content":
        return (
          <ContentSelectionTable
            broadcastTypes={broadcastTypes}
            emailTypeId={broadcastFormValues?.emailType}
            contents={contents ?? []}
            isLoadingContents={isLoadingContents}
            onBack={handleContentBack}
            onSend={handleSend}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -5 }}
          transition={{ duration: 0.3 }}
        >
          {stepComponent()}
        </motion.div>
      </AnimatePresence>

      <SendBroadcastDialog
        open={showSendDialog}
        onOpenChange={setShowSendDialog}
        emailId={broadcastFormValues.emailType}
        broadcastTypes={broadcastTypes}
        frequency={broadcastFormValues.frequency as EmailFrequency}
        selectedContent={selectedContent}
      />
    </>
  )
}
