import {
  GetCoordinates,
  GetLocations,
  GetNameComposer,
  GetPerformances,
} from "@/app/api/musiconn"

export async function GetListOfEvent(id, usePerformances = false) {
  let event = {}
  console.log(id, "id")
  const eventsNumbers = id.events.map((event) => event.event)
  if (eventsNumbers.length > 500) {
    const chunkSize = 500
    const chunks = []

    for (let i = 0; i < eventsNumbers.length; i += chunkSize) {
      const chunk = eventsNumbers.slice(i, i + chunkSize)
      chunks.push(chunk)
    }

    const eventPromises = chunks.map((chunk) =>
      usePerformances
        ? GetPerformances(chunk.join("|"))
        : GetLocations(chunk.join("|"))
    )

    const chunkEvents = await Promise.all(eventPromises)

    event = chunkEvents.reduce(
      (mergedEvent, chunkEvent) => ({
        ...mergedEvent,
        ...chunkEvent.event,
      }),
      {}
    )
  } else {
    const result = await (usePerformances
      ? GetPerformances(eventsNumbers.join("|"))
      : GetLocations(eventsNumbers.join("|")))
    event = result.event
  }

  return event
}

export async function GetExpandedEventWithPerformances(id, locationsData) {
  const event = await GetListOfEvent(id, true)

  const expandedLocationsPerformance = locationsData.map((location) => {
    return {
      ...location,
      locations: location.locations.map((locationObj) => {
        return {
          ...locationObj,
          eventInfo: locationObj.eventInfo.map((eventInfo) => {
            const uid = event[eventInfo.eventId]
            return {
              ...eventInfo,
              eventData: uid,
            }
          }),
        }
      }),
    }
  })

  let composerNumbers = []

  expandedLocationsPerformance.forEach((location) => {
    location.locations.forEach((locationObj) => {
      locationObj.eventInfo.forEach((eventInfo) => {
        eventInfo.eventData.performances?.forEach((performance) => {
          performance.composers?.forEach((composer) => {
            if (composer.person) {
              composerNumbers.push(composer.person)
            }
          })
        })
      })
    })
  })

  const composerNumbersSet = new Set(composerNumbers)
  const composerNumbersString = Array.from(composerNumbersSet).join("|")
  const composerNames = await GetNameComposer(composerNumbersString)

  expandedLocationsPerformance.forEach((location) => {
    location.locations.forEach((locationObj) => {
      locationObj.eventInfo.forEach((eventInfo) => {
        const composerNamesSet = new Set()

        eventInfo.eventData.performances?.forEach((performance) => {
          performance.composers?.forEach((composer) => {
            if (composer.person) {
              const composerName = composerNames[composer.person]
              composer.person = {
                id: composer.person,
                name: composerName,
              }
              composerNamesSet.add(composerName)
            }
          })

          eventInfo.composerNamesArray = Array.from(composerNamesSet)
          eventInfo.composerNamesString =
            eventInfo.composerNamesArray.join(", ")
        })
      })
    })
  })

  return expandedLocationsPerformance
}

export async function GetLocationsWithEventsAndTitle(id, eventIds) {
  // get event
  const event = await GetListOfEvent(id)

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
    if (locations && locations.length > 0) {
      locations
        .filter(
          (locationObj) => locationObj && locationObj.location !== undefined
        )
        .forEach((locationObj) => {
          eventLocations.push({
            eventId: parseInt(eventId),
            locationId: locationObj.location,
            date: date,
            categories: categories,
          })
        })
    } else {
      eventLocations.push({
        eventId: parseInt(eventId),
        locationId: 0,
        date: date,
        categories: categories,
      })
    }
  })

  // GET COORDINATES
  const data = await GetCoordinates(locationUid)
  // Create a map to store location data with associated event IDs and dates
  const locationMap = {}
  for (const eventLocation of eventLocations) {
    const parents = data.location[eventLocation.locationId]?.parents
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

    if (title && coordinates) {
      if (!locationMap[locationId]) {
        locationMap[locationId] = {
          locationId,
          title,
          coordinates: [coordinates[1], coordinates[0]],
          eventInfo: [],
          parents: parents || [],
          categories: categories || [],
        }
      }
      if (eventId) {
        locationMap[locationId].eventInfo.push({
          eventId,
          date,
          eventCategory,
        })
      } else {
        locationMap[locationId].eventInfo.push({
          eventId: null,
          date,
          eventCategory,
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

  const titlesWithSameCity = {}
  const locationsWithSameCity = []
  let key = 1

  for (const location of locationsWithCount) {
    const { title, coordinates } = location
    const match = title.match(/\((.*?)\)/) // Find text within parentheses

    if (match && match[1]) {
      const city = match[1]

      if (!titlesWithSameCity[city]) {
        titlesWithSameCity[city] = {
          count: 0, // Updated property name to count
          locations: [],
          coordinates: [0, 0],
        }
      }

      titlesWithSameCity[city].locations.push(location)
      titlesWithSameCity[city].count += location.count // Updated property name to count
      titlesWithSameCity[city].coordinates[0] += coordinates[0]
      titlesWithSameCity[city].coordinates[1] += coordinates[1]
    } else {
      // Handle locations without a city match
      const newCity = location.title

      if (!titlesWithSameCity[newCity]) {
        titlesWithSameCity[newCity] = {
          count: 0, // Updated property name to count
          locations: [],
          coordinates: [0, 0],
        }
      }

      titlesWithSameCity[newCity].locations.push(location)
      titlesWithSameCity[newCity].count += location.count // Updated property name to count
      titlesWithSameCity[newCity].coordinates[0] += coordinates[0]
      titlesWithSameCity[newCity].coordinates[1] += coordinates[1]

      key++
    }
  }

  for (const city in titlesWithSameCity) {
    const { count, locations, coordinates } = titlesWithSameCity[city]
    const countLocations = locations.length
    const averageCoordinates = [
      coordinates[0] / countLocations,
      coordinates[1] / countLocations,
    ]
    locationsWithSameCity.push({
      key,
      city,
      count, // Updated property name to count
      countLocations,
      locations,
      coordinates: averageCoordinates,
    })
    key++
  }

  return locationsWithSameCity
}
