"use client"

import { useEffect, useMemo, useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import type { Content } from "@/lib/broadcast-types"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import type { EmailType } from "@/lib/email-types"
import { baseContentColumns } from "@/components/broadcasts/content/columns"

interface ContentSelectionTableProps {
  broadcastTypes: EmailType[]
  emailTypeId: EmailType["id"]
  contents: Content[]
  isLoadingContents: boolean
  onBack: (selectedContent: Content["id"][]) => void
  onSend: (selectedContent: Content["id"][]) => void
  selectedContent: Content["id"][]
}

export function ContentSelectionTable({
  broadcastTypes,
  emailTypeId,
  contents,
  isLoadingContents,
  onBack,
  onSend,
  selectedContent
}: ContentSelectionTableProps) {
  const [selectedRows, setSelectedRows] = useState<Content["id"][]>(selectedContent)
  // Update selected rows when selectedContent changes
  useEffect(() => {
    setSelectedRows(selectedContent)
  }, [selectedContent])

  const filteredContents = useMemo(
    () => contents.filter((content) => content.emailType === emailTypeId),
    [contents, emailTypeId]
  )

  const columns: ColumnDef<Content>[] = useMemo(
    () => [
      {
        id: "select",
        cell: ({ row }) => (
          <Checkbox
            checked={selectedRows.includes(row.original.id)}
            onCheckedChange={(value) => {
              const checked = value === true
              if (checked) {
                setSelectedRows((prev) => [...prev, row.original.id])
              } else {
                setSelectedRows((prev) => prev.filter((id) => id !== row.original.id))
              }
            }}
            aria-label="Select row"
          />
        )
      },
      ...baseContentColumns(broadcastTypes)
    ],
    [broadcastTypes, selectedRows]
  )

  const tableRowSelection = useMemo(
    () => Object.fromEntries(selectedRows.map((id) => [String(id), true])),
    [selectedRows]
  )

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={filteredContents}
        noDataMessage={
          isLoadingContents ? "Loading..." : "No content found for this broadcast type."
        }
        parentRowSelection={tableRowSelection}
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" className="grow md:grow-0" onClick={() => onBack(selectedRows)}>
          Back
        </Button>
        <Button
          disabled={selectedRows.length === 0}
          className="grow md:grow-0"
          onClick={() => onSend(selectedRows)}
        >
          Send
        </Button>
      </div>
    </div>
  )
}
