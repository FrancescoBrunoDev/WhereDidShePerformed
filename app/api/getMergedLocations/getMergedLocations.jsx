import {
  GetCoordinates,
  GetEventsDetails,
  GetInfoPerson,
  GetLocations,
} from "@/app/api/musiconn"

import { getCityNameByCoordinates } from "../getCountryName/getCountry"

const countryCodeCoordinates = require("./country-codes-coordinates.json")

export async function GetListOfEvent(id) {
  let event = {}
  const eventsNumbers = id.events.map((event) => event.event)

  const chunkSize = 1300
  const chunks = []

  for (let i = 0; i < eventsNumbers.length; i += chunkSize) {
    const chunk = eventsNumbers.slice(i, i + chunkSize)
    chunks.push(chunk)
  }

  const eventPromises = chunks.map((chunk) => GetLocations(chunk.join("|")))

  const chunkEvents = await Promise.all(eventPromises)

  event = chunkEvents.reduce((mergedEvent, chunkEvent) => {
    Object.assign(mergedEvent, chunkEvent.event) // Use Object.assign() to merge objects efficiently
    return mergedEvent
  }, {})

  return event
}

export async function GetLocationsWithEventsAndTitle(performerId, eventIds) {
  const { decompress } = require("shrink-string")
  let id = null

  if (performerId) {
    // fetch info person and event
    id = await GetInfoPerson(performerId)
    id = id[performerId]
  } else if (eventIds) {
    // decode eventIds
    const dencoded = decodeURIComponent(eventIds)
    const decompressed = await decompress(dencoded)
    const eventIdsArray = decompressed.split("-")
    const uidString = eventIdsArray.join("|")
    const batches = []
    for (let i = 0; i < uidString.length; i += 1000) {
      const batch = uidString.slice(i, i + 1000)
      batches.push(batch)
    }
    const fetchPromises = batches.map((batch) => GetEventsDetails(batch))
    const fetchResults = await Promise.all(fetchPromises)

    const events = []
    for (const fetchResult of fetchResults) {
      if (fetchResult !== null) {
        const validObjects = Object.values(fetchResult).filter(
          (obj) => obj !== null
        )
        const batchEvents = validObjects.map(({ uid }) => ({
          event: uid,
        }))
        events.push(...batchEvents)
      }
    }
    id = {
      events: events,
    }
  }

  const event = await GetListOfEvent(id)

  if (!event) {
    const locationUid = []
    return locationUid
  }

  // make a string of unique locationUids
  const locationUid = [
    ...new Set(
      Object.values(event)
        .flatMap((obj) => obj.locations)
        .filter(
          (locationObj) => locationObj && locationObj.location !== undefined
        ) // Check if locationObj exists before accessing its location property
        .map((locationObj) => locationObj.location)
    ),
  ].join("|")

  // make an array of objects with eventId and locationId
  const eventLocations = []
  Object.keys(event).forEach((eventId) => {
    const categories = event[eventId]?.categories[0]?.label ?? null
    const locations = event[eventId].locations
    const date = event[eventId]?.dates[0]?.date ?? null
    const title = event[eventId]?.title ?? null
    if (locations && locations.length > 0) {
      locations
        .filter(
          (locationObj) => locationObj && locationObj.location !== undefined
        )
        .forEach((locationObj) => {
          const locationId = locationObj.location
          const eventLocation = {
            eventId: parseInt(eventId),
            locationId,
            date,
            categories,
            title,
          }
          eventLocations.push(eventLocation)
        })
    } else {
      const eventLocation = {
        eventId: parseInt(eventId),
        locationId: 0,
        date,
        categories,
        title,
      }
      eventLocations.push(eventLocation)
    }
  })

  // GET COORDINATES
  const data = await GetCoordinates(locationUid)
  // Create a map to store location data with associated event IDs and dates
  const locationMap = {}
  for (const eventLocation of eventLocations) {
    const categories = data.location[eventLocation.locationId]?.categories
    const locationId = eventLocation.locationId
    const locationInfo = data.location[locationId]
    const title = locationInfo ? locationInfo.title : null
    const coordinates =
      locationInfo &&
      locationInfo.geometries &&
      locationInfo.geometries[0] &&
      locationInfo.geometries[0].geo
        ? locationInfo.geometries[0].geo
        : null
    const eventId = eventLocation.eventId
    const date = eventLocation.date
    const eventCategory = eventLocation.categories
    const eventTitle = eventLocation.title

    if (title && coordinates) {
      if (!locationMap[locationId]) {
        locationMap[locationId] = {
          locationId,
          title,
          coordinates: [coordinates[1], coordinates[0]],
          eventInfo: [],
          categories: categories || [],
        }
      }
      if (eventId) {
        locationMap[locationId].eventInfo.push({
          eventId,
          date,
          eventCategory,
          eventTitle,
        })
      } else {
        locationMap[locationId].eventInfo.push({
          eventId: null,
          date,
          eventCategory,
          eventTitle,
        })
      }
    }
  }

  // Convert the map to an array of locations with event counts and dates

  const locationsWithCount = Object.values(locationMap).map((location) => {
    return {
      ...location,
      count: location.eventInfo.length,
    }
  })

  // organise by city
  const titlesWithSameCity = {}
  const locationsWithSameCity = []
  let key = 1
  const coordinatePairs = []

  for (const location of locationsWithCount) {
    const { coordinates } = location
    coordinatePairs.push(`${coordinates[1]},${coordinates[0]}`)
  }

  const cityData = await getCityNameFromCoordinatesAPI(coordinatePairs)

  for (let i = 0; i < cityData.length; i++) {
    const cityName = cityData[i]
    const location = locationsWithCount[i]
    const coordinatesCountry = [
      countryCodeCoordinates.ref_country_codes.find(
        (country) => country.alpha3 === cityName.country?.countryCode3
      )?.longitude,
      countryCodeCoordinates.ref_country_codes.find(
        (country) => country.alpha3 === cityName.country?.countryCode3
      )?.latitude,
    ]
    if (!titlesWithSameCity[cityName.name]) {
      titlesWithSameCity[cityName.name] = {
        count: 0, // Updated property name to count
        locations: [],
        coordinates: [cityName.longitude, cityName.latitude],
        country: cityName.country?.name,
        coordinatesCountry,
        continent: cityName.country?.continent,
      }
    }

    titlesWithSameCity[cityName.name].locations.push(location)
    titlesWithSameCity[cityName.name].count += location.count // Updated property name to count
    titlesWithSameCity[cityName.name].coordinates = [
      cityName.longitude,
      cityName.latitude,
    ]
    titlesWithSameCity[cityName.name].country = cityName.country?.name
    titlesWithSameCity[cityName.name].continent = cityName.country?.continent
    titlesWithSameCity[cityName.name].coordinatesCountry = coordinatesCountry
    key++
  }

  /*   console.log(titlesWithSameCity) */

  for (const city in titlesWithSameCity) {
    const {
      count,
      locations,
      coordinates,
      country,
      continent,
      coordinatesCountry,
    } = titlesWithSameCity[city]

    const countLocations = locations.length
    locationsWithSameCity.push({
      key,
      city,
      count, // Updated property name to count
      countLocations,
      locations,
      coordinates: coordinates,
      country,
      coordinatesCountry,
      continent,
    })
    key++
  }

  return locationsWithSameCity
}

async function getCityNameFromCoordinatesAPI(coordinates) {
  const cities = []

  for (const pair of coordinates) {
    const [longitude, latitude] = pair.split(",").map(parseFloat)
    const city = getCityNameByCoordinates(longitude, latitude)

    cities.push(city)
  }

  return cities
}
