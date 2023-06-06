async function queryData(query) {
  const url = `https://performance.musiconn.de/api?action=query&entity=person&person=${query}&sort=1&format=json`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  const { records } = await res.json()
  return records
}

export { queryData }

async function GetCoordinates(locationUid) {
  const url = `https://performance.musiconn.de/api?action=get&location=${locationUid}&props=title|geometries|uid|categories&format=json`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }
  return res.json()
}

export { GetCoordinates }

async function GetLocations(eventIud) {

  const url = `https://performance.musiconn.de/api?action=get&event=${eventIud}&props=locations|dates|categories|title&format=json`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }
  
  return res.json()
}

export { GetLocations }

async function GetPerformances(eventIud) {

  const url = `https://performance.musiconn.de/api?action=get&event=${eventIud}&props=|performances|uid&format=json`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }
  
  return res.json()
}

export { GetPerformances }

async function GetInfoPerson(PersonUid) {
  const url = `https://performance.musiconn.de/api?action=get&person=${PersonUid}&format=json`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  const { person } = await res.json()
  return person
}

export { GetInfoPerson }

async function GetNameComposer(PersonUid) {
  const url = `https://performance.musiconn.de/api?action=get&person=${PersonUid}&props=title&format=json`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  const { person } = await res.json()
  return person
}

export { GetNameComposer }

async function GetEventsDetails(eventIds) {
  const url = `https://performance.musiconn.de/api?action=get&event=${eventIds}&props=uid|&format=json`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  const { event } = await res.json()
  return event
}

export { GetEventsDetails }

async function autocomplete(query) {
  const url = `https://performance.musiconn.de/api?action=autocomplete&title=${query}&entities=person&format=json`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  const autocomplete = await res.json()
  return autocomplete
}

export { autocomplete }
