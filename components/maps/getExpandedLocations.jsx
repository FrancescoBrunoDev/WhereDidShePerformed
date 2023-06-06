import {
  GetEventsDetails,
  GetNameComposer,
  GetPerformances,
} from "@/app/api/musiconn"

export async function GetListOfEvent(id) {
  let event = {}
  const eventsNumbers = id.events.map((event) => event.event)

  const chunkSize = 1200
  const chunks = []

  for (let i = 0; i < eventsNumbers?.length; i += chunkSize) {
    const chunk = eventsNumbers.slice(i, i + chunkSize)
    chunks.push(chunk)
  }

  const eventPromises = chunks.map((chunk) => GetPerformances(chunk.join("|")))

  const chunkEvents = await Promise.all(eventPromises)

  event = chunkEvents.reduce((mergedEvent, chunkEvent) => {
    Object.assign(mergedEvent, chunkEvent.event) // Use Object.assign() to merge objects efficiently
    return mergedEvent
  }, {})

  return event
}

export async function GetExpandedEventWithPerformances(
  id,
  locationsData,
  eventIds
) {
  const { decompress } = require("shrink-string")
  let _id = null

  if (id !== null) {
    _id = id
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
    _id = {
      events: events,
    }
  }

  const event = await GetListOfEvent(_id)

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
        for (const performance of eventInfo.eventData.performances || []) {
          for (const composer of performance.composers || []) {
            if (composer.person) {
              composerNumbers.push(composer.person)
            }
          }
        }
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
