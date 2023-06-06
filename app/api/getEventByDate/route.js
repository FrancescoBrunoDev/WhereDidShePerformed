import { NextResponse } from "next/server"

import { main } from "./EventByDateFinder"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const startDateString = searchParams.get("startDateString")
  const endDateString = searchParams.get("endDateString")


  const data = await main(startDateString, endDateString)
  console.log(data, "data")
  const responseBody = JSON.stringify(data)

  return new Response(responseBody, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
