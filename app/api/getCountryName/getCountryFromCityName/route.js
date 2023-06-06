import { NextResponse } from "next/server"

import { getCountryFromCityName } from "../getCountry"

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const cityNamesParam = searchParams.get("cityName"); // Retrieve the city names parameter as a string
  
    // Split the city names using the "|" separator
    const cityNames = cityNamesParam ? cityNamesParam.split("|") : [];
  
    const countries = getCountryFromCityName(cityNames);
  
    const responseBody = JSON.stringify(countries);
    console.log(responseBody);
    return new Response(responseBody, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
