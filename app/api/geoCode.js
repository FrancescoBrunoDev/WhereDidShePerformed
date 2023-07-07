async function autocompleteGeo(searchTerm) {
  const url = `https://geocode.maps.co/search?q=${searchTerm}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  const autocomplete = await res.json()
  return autocomplete
}

export { autocompleteGeo }

