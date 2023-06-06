import { NextResponse } from "next/server"

import { getCityNameByCoordinates } from "../getCountry"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const coordinates = searchParams.get("coordinates")
  const coordinatePairs = coordinates.split("|")
  const cities = []

  for (const pair of coordinatePairs) {
    const [longitude, latitude] = pair.split(",").map(parseFloat)
    const city = getCityNameByCoordinates(longitude, latitude)

    cities.push(city)
  }

  const responseBody = JSON.stringify(cities)

  return new Response(responseBody, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
