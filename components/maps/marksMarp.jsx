import { useStoreFiltersMap } from "@/store/useStoreFiltersMap"
import { useStoreSettingMap } from "@/store/useStoreSettingMap"
import { Marker } from "react-simple-maps"

export default function MarksMap({ mapConfig }) {
  const [isEuropeMap, isHighQuality] = useStoreSettingMap((state) => [
    state.isEuropeMap,
    state.isHighQuality,
  ])
  const [locationsWithFilterCategory, activeContinents, activeCountries] =
    useStoreFiltersMap((state) => [
      state.locationsWithFilterCategory,
      state.activeContinents,
      state.activeCountries,
    ])

  const scaleRadius = (count) => {
    const minRadius = 2 // Minimum radius value
    const maxRadius = mapConfig.maxRadius || 30 // Maximum radius value (default is 30)
    const scaleFactor = 2 // Scaling factor (adjust as needed)
    const logCount = Math.log10(count + 1) // Logarithm of count value (add 1 to avoid taking log of 0)
    const radius =
      (logCount / scaleFactor) * (maxRadius - minRadius) + minRadius // Map log count value to radius range
    return radius
  }

  const [isHover, setIsHover] = useStoreSettingMap((state) => [
    state.isHover,
    state.setIsHover,
  ])

  // Wait until mapConfig.maxRadius is defined before rendering the component
  if (!mapConfig?.maxRadius) {
    return null
  }

  return (
    <>
      {locationsWithFilterCategory
        .filter((city) => !activeContinents.includes(city.continent))
        .filter((city) => !activeCountries.includes(city.country))
        .map(({ key, coordinates, count, coordinatesCountry, locations }) => {
          const hasEvents = locations.some(
            (location) => location.eventInfo.length > 0
          )
          if (!hasEvents) {
            return null // Skip rendering the city if it has no events
          }
          const transitionDuration =
            Math.floor(Math.random() * 900 + 100) / 2000

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
                    ? isHover === key
                      ? "scale(1.5)"
                      : "scale(0.2)"
                    : "scale(1)",
                }}
                exit={{ scale: 0 }}
                r={scaleRadius(count)}
                fill="currentColor"
                onMouseEnter={() => {
                  setIsHover(key)
                }}
                onMouseLeave={() => {
                  setIsHover(null)
                }}
              />
            </Marker>
          )
        })}
    </>
  )
}
