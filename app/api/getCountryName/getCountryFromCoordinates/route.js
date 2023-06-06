import { NextResponse } from "next/server"

import { getCountryFromCoordinates } from "../getCountry"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const longitude = searchParams.get("longitude")
  const latitude = searchParams.get("latitude")

  const country = getCountryFromCoordinates(longitude, latitude)

  const responseBody = JSON.stringify(country)
  console.log(responseBody)
  return new Response(responseBody, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
