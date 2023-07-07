export function linkMaker(title) {
  const itemMatch = title.match(
    /(\d{1,2})\.(\d{1,2})\.(\d{4})(?:, (\d{1,2}):(\d{2}))?$/
  )
  const personMatch = title.match(/(.+?)\s*\(([^)]+)\)/)

  if (itemMatch) {
    const [, day, month, year, hours, minutes] = itemMatch
    const itemString = `-${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`
    const timeString =
      hours && minutes ? `-${hours.padStart(2, "0")}-${minutes}` : ""
    const titleWithoutItem = title.replace(
      /,\s*\d{1,2}\.\d{1,2}\.\d{4}(?:, \d{1,2}:\d{2})?$/,
      ""
    )
    const cleanedTitleLink = `${titleWithoutItem
      .toLowerCase()
      .replace(/[^\w\säöüß-]/g, "")
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/\s+/g, "-")
      .replace(/-{2,}/g, "-")}${itemString}${timeString}`
    return cleanedTitleLink
  }

  if (personMatch) {
    const [, lastName, firstName] = personMatch
    const cleanedTitleLink = `${lastName
      .toLowerCase()
      .replace(/[^\w\säöüß-]/g, "")
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/\s+/g, "-")}-${firstName
      .toLowerCase()
      .replace(/[^\w\säöüß-]/g, "")
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/\s+/g, "-")}`
    return cleanedTitleLink
  }

  const cleanedTitleLink = title
    .toLowerCase()
    .replace(/[^\w\säöüß-]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, "-")
  return cleanedTitleLink
}
