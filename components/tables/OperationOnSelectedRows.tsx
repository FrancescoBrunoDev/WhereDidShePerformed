import Link from "next/link"
import { Role, StateVerification } from "@prisma/client"
import { Table } from "@tanstack/react-table"

import DeleteButton from "@/components/DeleteButton"

import UpdateStateVerificationButton from "../UdateStateVerificationButton"
import { buttonVariants } from "../ui/button"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  userRole?: Role
}

export function OperationOnSelectedRows<TData>({
  table,
  userRole,
}: DataTablePaginationProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const uidArrayForDelete = selectedRows.map((row) => (row.original as any).uid)
  const uidArrayForVerification = selectedRows.map((row) => ({
    uid: (row.original as any).uid,
    stateVerification: (row.original as any)
      .stateVerification as StateVerification,
  }))

  const eventsArray = {
    eventId: uidArrayForVerification,
  }

  return (
    <div className="mx-auto">
      <div className="grid grid-cols-2 gap-2 pt-2 items-center">
        <Link
          href={`/profile/eventInfo/new/new`}
          className={buttonVariants({ className: "w-fit" })}
        >
          create a new Event
        </Link>
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <div className="flex gap-2 justify-self-end">
            <UpdateStateVerificationButton
              userRole={userRole}
              uid={eventsArray}
            />

            {uidArrayForDelete.length > 0 && (
              <div className="w-fit">
                <DeleteButton uid={uidArrayForDelete} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
