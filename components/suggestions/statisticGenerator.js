async function getAPIResponse(eventIds) {
  const url = `https://performance.musiconn.de/api?action=get&event=${eventIds.join(
    "|"
  )}&props=performances|persons&format=json`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  const data = await res.json()
  return data
}

async function getPersonName(id) {
  const url = `https://performance.musiconn.de/api?action=get&person=${id}&props=title&format=json`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch data")
  }

  const data = await response.json()
  return data.person[id]?.title || null
}

function getTopPersons(apiResponse) {
  const topPersons = {
    composers: {},
    performers: {},
    performersByComposer: {},
  }

  const eventIds = apiResponse?.event ? Object.keys(apiResponse.event) : []
  for (const eventId of eventIds) {
    const event = apiResponse.event[eventId]
    const performances = event?.performances || []

    for (const performance of performances) {
      const composers = performance.composers || []
      const persons = performance.persons || []

      for (const composer of composers) {
        const composerId = composer.person
        if (composerId) {
          topPersons.composers[composerId] =
            (topPersons.composers[composerId] || 0) + 1

          for (const person of persons) {
            const personId = person.person
            if (personId) {
              topPersons.performers[personId] =
                (topPersons.performers[personId] || 0) + 1

              if (!(composerId in topPersons.performersByComposer)) {
                topPersons.performersByComposer[composerId] = {}
              }
              topPersons.performersByComposer[composerId][personId] =
                (topPersons.performersByComposer[composerId][personId] || 0) + 1
            }
          }
        }
      }
    }
  }

  return topPersons
}

async function printTopPersons(topPersons) {
  const result = {
    topComposers: [],
    topPerformers: [],
    performersByComposer: [],
  }

  const sortedComposers = Object.entries(topPersons.composers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)

  const composerPromises = sortedComposers.map(async ([composerId, count]) => {
    const composerName = await getPersonName(composerId)
    result.topComposers.push({ composerId, composerName, count })
  })

  const sortedPerformers = Object.entries(topPersons.performers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)

  const performerPromises = sortedPerformers.map(
    async ([performerId, count]) => {
      const performerName = await getPersonName(performerId)
      result.topPerformers.push({ performerId, performerName, count })
    }
  )

  const topPerformersByComposer = topPersons.performersByComposer
  const top30Composers = sortedComposers.map(([composerId]) => composerId)

  const performersByComposerPromises = top30Composers.map(
    async (composerId) => {
      const composerName = await getPersonName(composerId)
      const performers = topPerformersByComposer[composerId]

      if (performers) {
        const sortedPerformers = Object.entries(performers)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 1)

        for (const [performerId, count] of sortedPerformers) {
          const performerName = await getPersonName(performerId)
          result.performersByComposer.push({
            composerId,
            composerName,
            performerId,
            performerName,
            count,
          })
        }
      }
    }
  )

  await Promise.all([
    ...composerPromises,
    ...performerPromises,
    ...performersByComposerPromises,
  ])

  console.log(JSON.stringify(result, null, 2))
}

async function main() {
  const batchSize = 1250
  let batchStart = 1
  let batchEnd = batchSize
  const topPersons = {
    composers: {},
    performers: {},
    performersByComposer: {},
  }

  while (true) {
    const eventIds = Array.from({ length: batchSize }, (_, i) => i + batchStart)
    const apiResponse = await getAPIResponse(eventIds)

    if (apiResponse === null) {
      console.log("Null apiResponse. Exiting the loop.")
      break // Exit the loop if apiResponse is null
    }

    const eventKeys = apiResponse?.event ? Object.keys(apiResponse.event) : []
    if (eventKeys.length === 0) {
      console.log("Empty eventKeys in apiResponse.event. Exiting the loop.")
      break // Exit the loop if eventKeys is empty
    }

    let allEventsNull = true
    for (const eventId of eventKeys) {
      if (apiResponse.event[eventId] !== null) {
        allEventsNull = false
        break
      }
    }

    if (allEventsNull) {
      console.log("All events in apiResponse.event are null. Exiting the loop.")
      break // Exit the loop if all events are null
    }

    const currentTopPersons = getTopPersons(apiResponse)
    for (const composerId in currentTopPersons.composers) {
      if (composerId in topPersons.composers) {
        topPersons.composers[composerId] +=
          currentTopPersons.composers[composerId]
      } else {
        topPersons.composers[composerId] =
          currentTopPersons.composers[composerId]
      }
    }

    for (const performerId in currentTopPersons.performers) {
      if (performerId in topPersons.performers) {
        topPersons.performers[performerId] +=
          currentTopPersons.performers[performerId]
      } else {
        topPersons.performers[performerId] =
          currentTopPersons.performers[performerId]
      }
    }

    for (const composerId in currentTopPersons.performersByComposer) {
      if (!(composerId in topPersons.performersByComposer)) {
        topPersons.performersByComposer[composerId] = {}
      }

      for (const performerId in currentTopPersons.performersByComposer[
        composerId
      ]) {
        if (performerId in topPersons.performersByComposer[composerId]) {
          topPersons.performersByComposer[composerId][performerId] +=
            currentTopPersons.performersByComposer[composerId][performerId]
        } else {
          topPersons.performersByComposer[composerId][performerId] =
            currentTopPersons.performersByComposer[composerId][performerId]
        }
      }
    }

    batchStart += batchSize
    batchEnd += batchSize

    if (eventKeys.length < batchSize) {
      console.log(
        "Number of events in apiResponse.event is less than batchSize. Exiting the loop."
      )
      break
    }
  }

  printTopPersons(topPersons)
}

export default main
