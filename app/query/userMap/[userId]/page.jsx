import { Suspense } from "react"

import Dashboard from "@/components/dashboard"

//export a main function with jsut the childrens inside
export default function main({ params }) {
  return (
    <Suspense>
      <Dashboard params={params} />
    </Suspense>
  )
}
