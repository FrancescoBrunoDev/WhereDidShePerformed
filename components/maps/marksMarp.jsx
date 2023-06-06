import { AnimatePresence, motion as m } from "framer-motion"
import { Marker } from "react-simple-maps"

export default function MarksMap({
  locationsData,
  isHighQuality,
  selectedLocationId,
  setSelectedLocationId,
  isHover,
  setIsHover,
  mapConfig,
  filteredDataCountry,
  isEuropeMap,
}) {
  const sigmoid = (x) => {
    return 1 / (1 + Math.exp(-x))
  }

  const scaleRadius = (count) => {
    const minRadius = 2 // Minimum radius value
    const maxRadius = mapConfig.maxRadius || 30 // Maximum radius value (default is 30)
    const scaleFactor = 2 // Scaling factor (adjust as needed)
    const logCount = Math.log10(count + 1) // Logarithm of count value (add 1 to avoid taking log of 0)
    const radius = (logCount / scaleFactor) * (maxRadius - minRadius) + minRadius // Map log count value to radius range
    return radius
  }

  if (!locationsData || !Array.isArray(locationsData)) {
    return null // or some other fallback UI or error handling
  }

  // Wait until mapConfig.maxRadius is defined before rendering the component
  if (!mapConfig?.maxRadius) {
    return null
  }

  return (
    <>
      {filteredDataCountry.map(({ key, coordinates, count, coordinatesCountry }) => {
        const transitionDuration = Math.floor(Math.random() * 900 + 100) / 2000 // Generate a random value between 0.1 and 1
        return (
          <Marker
            id={key}
            coordinates={isEuropeMap ? coordinates : coordinatesCountry}
            key={key}
            className={isHighQuality ? "drop-shadow" : ""}
          >
            <circle
              style={{
                transition: `transform ${transitionDuration}s ease-in-out`,
                transform: isHover
                  ? selectedLocationId === key
                    ? "scale(1.5)"
                    : "scale(0.2)"
                  : "scale(1)",
              }}
              exit={{ scale: 0 }}
              r={scaleRadius(count)}
              fill={
                selectedLocationId === key ? "currentColor" : "currentColor"
              }
              onMouseEnter={() => {
                setSelectedLocationId(key)
                setIsHover(true)
              }}
              onMouseLeave={() => {
                setSelectedLocationId(null)
                setIsHover(false)
              }}
            />
          </Marker>
        )
      })}
    </>
  )
}
