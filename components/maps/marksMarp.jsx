import { AnimatePresence, motion as m } from "framer-motion"
import { Marker } from "react-simple-maps"

export default function MarksMap({
  locationsData,
  isByCity,
  isHighQuality,
  selectedLocationId,
  setSelectedLocationId,
  isHover,
  setIsHover,
  mapConfig,
}) {
  const sigmoid = (x) => {
    return 1 / (1 + Math.exp(-x))
  }

  const scaleRadius = (count) => {
    const minRadius = 1
    const maxRadius = mapConfig?.maxRadius || 10 // Use optional chaining to access maxRadius
    const scaleFactor = 5
    const x = (count - scaleFactor) / scaleFactor
    const radius = sigmoid(x) * (maxRadius - minRadius) + minRadius
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
      {locationsData.map(({ key, locationId, coordinates, count }) => {
        const transitionDuration = Math.floor(Math.random() * 900 + 100) / 2000 // Generate a random value between 0.1 and 1
        {
          isByCity ? key : locationId
        }
        return (
          <Marker
            id={isByCity ? key : locationId}
            coordinates={coordinates}
            key={isByCity ? key : locationId}
            className={isHighQuality ? "drop-shadow" : ""}
          >
            <AnimatePresence mode={"wait"}>
              <m.circle
                layout
                initial={{ scale: 0 }}
                animate={
                  isHover
                    ? (
                        isByCity
                          ? selectedLocationId === key
                          : selectedLocationId === locationId
                      )
                      ? { scale: 1.5 }
                      : { scale: 0.2 }
                    : { scale: 1 }
                }
                transition={{
                  duration: transitionDuration,
                  delay: transitionDuration,
                }}
                key={isByCity ? key : locationId}
                exit={{ scale: 0 }}
                r={scaleRadius(count)}
                fill={
                  isByCity
                    ? selectedLocationId === key
                      ? "currentColor"
                      : "currentColor"
                    : selectedLocationId === locationId
                    ? "currentColor"
                    : "currentColor"
                }
                onMouseEnter={() => {
                  setSelectedLocationId(isByCity ? key : locationId)
                  setIsHover(true)
                }}
                onMouseLeave={() => {
                  setSelectedLocationId(null)
                  setIsHover(false)
                }}
              />
            </AnimatePresence>
          </Marker>
        )
      })}
    </>
  )
}
