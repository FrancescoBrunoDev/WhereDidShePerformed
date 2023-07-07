"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { User } from "@/types/database"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Icons } from "../icons"
import { DataTableColumnHeader } from "./DataTableColumnHeader"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "eventVerifications",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="pending" />
    ),
    cell: ({ row }) => {
      interface stateVerification {
        stateVerification: string
        eventId: number
      }

      const stateVerification = row.getValue(
        "eventVerifications"
      ) as stateVerification[]

      const howManyPending = stateVerification.filter(
        (state) => state.stateVerification === "PENDING"
      ).length

      return (
        <div className="flex justify-start">
          <div className="flex w-10 items-center justify-end gap-1">
            {howManyPending > 0 ? howManyPending : null}
            <Icons.status
              className={`${
                howManyPending > 0 ? "fill-orange-500" : "fill-green-600"
              } h-3 w-3 stroke-none`}
            />
          </div>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <div className="grid grid-cols-1 gap-2">
              <DropdownMenuItem asChild>
                {/*                 <DeleteButton uid={event.uid} /> */}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                {/*                 <Link
                  href={`/profile/eventInfo/${event.uid}`}
                  className={buttonVariants({
                    className: "w-full",
                    size: "xs",
                    variant: "default",
                  })}
                >
                  edit
                </Link> */}
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/profile/eventUser/${user.id}`}>view events user</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
