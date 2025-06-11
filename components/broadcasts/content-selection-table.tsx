"use client"

import { useEffect, useMemo, useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import type { Content } from "@/lib/broadcast-types"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { SortableHeader } from "@/components/ui/sortable-header"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import type { EmailType } from "@/lib/email-types"
import { ContentDetailDialog } from "@/components/broadcasts/content-detail-dialog"

interface ContentSelectionTableProps {
  broadcastTypes: EmailType[]
  emailTypeId?: EmailType["id"]
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
            onCheckedChange={(value: boolean) => {
              if (value) {
                setSelectedRows((prev) => [...prev, row.original.id])
              } else {
                setSelectedRows((prev) => prev.filter((id) => id !== row.original.id))
              }
            }}
            aria-label="Select row"
          />
        )
      },
      {
        accessorKey: "emailType",
        header: ({ column }) => <SortableHeader column={column} title="Email Type" />,
        cell: ({ row }) => (
          <div>{broadcastTypes.find((type) => type.id === row.original.emailType)?.name}</div>
        )
      },
      {
        accessorKey: "contentText",
        header: ({ column }) => <SortableHeader column={column} title="Content" />,
        cell: ({ row }) => <div className="max-w-[300px] truncate">{row.original.contentText}</div>
      },
      {
        accessorKey: "name",
        header: ({ column }) => <SortableHeader column={column} title="Creator" />,
        cell: ({ row }) => <div>{row.original.name}</div>
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <SortableHeader column={column} title="Created At" isNumber />,
        cell: ({ row }) => (
          <div>{dayjs.utc(row.original.createdAt).local().format("D MMM YYYY hh:mm A")}</div>
        )
      },
      {
        id: "actions",
        header: "Details",
        cell: ({ row }) => <ContentDetailDialog content={row.original.content} />
      }
    ],
    [broadcastTypes, selectedRows]
  )

  const tableRowSelection = useMemo(() => {
    return selectedRows.reduce(
      (acc, id) => {
        acc[String(id)] = true
        return acc
      },
      {} as Record<string, boolean>
    )
  }, [selectedRows])

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
