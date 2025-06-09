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
import { ContentDetailDialog } from "./content-detail-dialog"

interface ContentSelectionTableProps {
  broadcastTypes: EmailType[]
  emailTypeId?: EmailType["id"]
  contents: Content[]
  isLoadingContents: boolean
  onBack: () => void
  onSend: (selectedContent: Content["id"][]) => void
}

export function ContentSelectionTable({
  broadcastTypes,
  emailTypeId,
  contents,
  isLoadingContents,
  onBack,
  onSend
}: ContentSelectionTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const filteredContents = useMemo(
    () => contents.filter((content) => content.emailType === emailTypeId),
    [contents, emailTypeId]
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to reset the selected rows when the email type changes
  useEffect(() => {
    setSelectedRows([])
  }, [emailTypeId])

  const columns: ColumnDef<Content>[] = useMemo(
    () => [
      {
        id: "select",
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value: boolean) => {
              row.toggleSelected(value)
              setSelectedRows((prev) =>
                value ? [...prev, row.original.id] : prev.filter((id) => id !== row.original.id)
              )
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
        header: ({ column }) => <SortableHeader column={column} title="Created At" />,
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
    [broadcastTypes]
  )

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={filteredContents}
        noDataMessage={
          isLoadingContents ? "Loading..." : "No content found for this broadcast type."
        }
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" className="grow md:grow-0" onClick={onBack}>
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
