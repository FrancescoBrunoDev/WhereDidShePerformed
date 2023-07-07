"use client"

import { useEffect, useState } from "react"

import { User } from "@/types/database"
import { columns } from "@/components/tables/ColumsTableUsers"
import { DataTable } from "@/components/tables/DataTableUsers"

const TableEvents = () => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const user = await fetch("api/get/getAllUsers")
      const userJson = await user.json()
      setUsers(userJson)
    }

    fetchData()
  }, [])

  return (
    <div className="mx-auto w-full">
      <DataTable columns={columns} data={users} />
    </div>
  )
}

export default TableEvents
