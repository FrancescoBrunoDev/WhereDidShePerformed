import { isAfter, isBefore, parseISO, isSameDay } from "date-fns"

async function GetEventByDates(eventIds) {
  const url = `https://performance.musiconn.de/api?action=get&event=${eventIds.join(
    "|"
  )}&props=dates|uid&format=json`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  const event = await res.json()
  return event
}

export { GetEventByDates }

// async function that collects all the dates and select them by day
async function FilterEventsByDates(eventIds, startDateString, endDateString) {
  const events = eventIds.event
  const filteredEvents = []

  const startDate = parseISO(startDateString)
  const endDate = parseISO(endDateString)

  for (const eventId in events) {
    if (events[eventId]?.dates) {
      const eventDates = events[eventId].dates
      for (const dateObj of eventDates) {
        const eventDate = parseISO(dateObj.date)
        if (isAfter(eventDate, startDate) && isBefore(eventDate, endDate) || isSameDay(eventDate, startDate) || isSameDay(eventDate, endDate)) {
          filteredEvents.push(events[eventId])
          break
        }
      }
    }
  }
  
  const filteredData = {
    filteredEvents: filteredEvents,
    startDate: startDate,
    endDate: endDate
  };

  return filteredData;
}

export { FilterEventsByDates }


async function main(startDateString, endDateString) {
  const batchSize = 1300
  let batchStart = 1
  let batchEnd = batchSize
  const filteredEvents = []

  while (true) {
    const eventIds = Array.from({ length: batchSize }, (_, i) => i + batchStart)

    const apiResponse = await GetEventByDates(eventIds)

    if (apiResponse === null) {
      console.log("Null apiResponse. Exiting the loop.")
      break
    }

    const eventKeys = apiResponse?.event ? Object.keys(apiResponse.event) : []
    if (eventKeys.length === 0) {
      console.log("Empty eventKeys in apiResponse.event. Exiting the loop.")
      break
    }

    let atLeastOneEventNotNull = false
    for (const eventId of eventKeys) {
      if (apiResponse.event[eventId] !== null) {
        atLeastOneEventNotNull = true
        break
      }
    }

    if (!atLeastOneEventNotNull) {
      console.log("All events in apiResponse.event are null. Exiting the loop.")
      break
    }

    const filteredData = await FilterEventsByDates(apiResponse, startDateString, endDateString)
    filteredEvents.push(...filteredData.filteredEvents)

    batchStart = batchEnd + 1
    batchEnd += batchSize
  }

  const filteredData = {
    filteredEvents: filteredEvents,
    startDate: startDateString,
    endDate: endDateString
  };

  return filteredData; // Return the filtered events array
}

export { main }

