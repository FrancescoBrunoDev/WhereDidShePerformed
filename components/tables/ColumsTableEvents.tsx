"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { MoreHorizontal } from "lucide-react"

import { EventTable } from "@/types/database"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ModifierVerificationEventAdmin from "@/components/ModifierVerificationEventAdmin"
import { DataTableColumnHeader } from "@/components/tables/DataTableColumnHeader"

import DeleteButton from "../DeleteButton"

export const columns: ColumnDef<EventTable>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const event = row.original
      return (
        <Link href={`/profile/eventInfo/visualise/${event.uid}`}>
          <p className="rounded-lg p-1 font-bold hover:bg-secondary">
            {event.title}
          </p>
        </Link>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt"))
      const formattedDateCreatedAt = format(createdAt, "MM/dd/yyyy hh:mm")
      return <div>{formattedDateCreatedAt}</div>
    },
  },
  {
    accessorKey: "stateVerification",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State" />
    ),
    cell: ({ row }) => {
      const event = row.original
      return (
        <ModifierVerificationEventAdmin
          eventId={event.uid}
          verificationStatus={event.stateVerification}
        />
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const event = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-40">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <div className="grid grid-cols-1 gap-2">
              <DropdownMenuItem asChild>
                <DeleteButton uid={event.uid} />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/profile/eventInfo/modify/${event.uid}`}
                  className={buttonVariants({
                    className: "w-full",
                    size: "xs",
                    variant: "default",
                  })}
                >
                  edit
                </Link>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={true}>
              Who&apos;s the Creator?
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
