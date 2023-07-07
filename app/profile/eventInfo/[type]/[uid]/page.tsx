"use client"

import { Suspense } from "react"

import EventInfoCardModifier from "@/components/create/EventInfoCardModifier"
import EventInfoCardVisualiser from "@/components/create/EventInfoCardVisualiser"

const Page = async ({ params }: { params: { type: string; uid: string } }) => {
  const type = params.type
  const uid = params.uid
  return (
    <Suspense>
      {type === "modify" && <EventInfoCardModifier uid={uid} type={type} />}
      {type === "new" && <EventInfoCardModifier uid={uid} type={type} />}
      {type === "visualise" && <EventInfoCardVisualiser uid={uid} />}
    </Suspense>
  )
}

export default Page
