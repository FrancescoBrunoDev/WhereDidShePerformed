"use client"

import { useParams } from "next/navigation"

import CloseModal from "@/components/CloseModal"
import TableEvents from "@/components/tables/TableEvents"

const Page = () => {
  const params = useParams()
  const id = params.id
  console.log(params, "params")
  return (
    <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-all duration-100">
      <div className="container mx-auto flex h-full max-w-fit items-center">
        <div className="relative max-h-[90vh] w-fit rounded-lg border bg-background px-2 pb-4 pt-8">
          <div className="absolute right-4 top-4">
            <CloseModal />
          </div>
          <div className="h-full overflow-y-auto p-2">
            <TableEvents userId={id} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
