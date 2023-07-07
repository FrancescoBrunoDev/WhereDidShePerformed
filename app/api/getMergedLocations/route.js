import { NextResponse } from "next/server"

import { GetLocationsWithEventsAndTitle } from "./getMergedLocations"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const performerId = searchParams.get("performerId")
  const eventIds = searchParams.get("eventIds")
  const userId = searchParams.get("userId")

  const idsCandidate = {
    performerId: performerId,
    eventIds: eventIds,
    userId: userId,
  }

  const data = await GetLocationsWithEventsAndTitle(idsCandidate)
  const responseBody = JSON.stringify(data)

  return new Response(responseBody, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
