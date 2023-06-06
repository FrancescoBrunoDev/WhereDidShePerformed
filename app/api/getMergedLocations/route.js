import { NextResponse } from "next/server"

import { GetLocationsWithEventsAndTitle } from "./getMergedLocations"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const performerId = searchParams.get("performerId")
  const eventIds = searchParams.get("eventIds")

  const data = await GetLocationsWithEventsAndTitle(performerId, eventIds)
  const responseBody = JSON.stringify(data)

  return new Response(responseBody, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
