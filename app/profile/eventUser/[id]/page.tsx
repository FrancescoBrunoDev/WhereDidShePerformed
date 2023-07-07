"use client"

import { useParams } from "next/navigation"

import TableEvents from "@/components/tables/TableEvents"

const Page = ({}) => {
  const params = useParams()
  const id = params.id

  // devi fare una API per verificare se l'utente è admin ma in realtà la API è già protetta

  return (
    <div className="h-fit">
      <TableEvents userId={id} />
    </div>
  )
}

export default Page
