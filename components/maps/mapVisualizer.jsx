"user client"

import { useState } from "react"

import MapCamp from "@/components/maps/mapCamp"
import ScrollAreaMap from "@/components/maps/scrollAreaMap"

export default function MapVisualizer({
  locationsData,
  lowestYear,
  highestYear,
  filterHighestYear,
  updateFilterHighestYear,
  isByCity,
  setIsByCity,
  setIsHighQuality,
  isHighQuality,
  isEuropeMap,
  setIsGeoMap,
  changeMap,
  setChangeMap,
  mapUrl,
  setMapUrl,
  expandedLocations,
  searchData,
}) {
  const [selectedLocationId, setSelectedLocationId] = useState(null)
  const [isHover, setIsHover] = useState(false)

  return (
    <section>
      <ScrollAreaMap
        locationsData={locationsData}
        onLocationHover={(locationId) => setSelectedLocationId(locationId)}
        lowestYear={lowestYear}
        highestYear={highestYear}
        filterHighestYear={filterHighestYear}
        updateFilterHighestYear={updateFilterHighestYear}
        setIsHover={setIsHover}
        isByCity={isByCity}
        expandedLocations={expandedLocations}
        searchData={searchData}
      />

      <div>
        {
          <MapCamp
            locationsData={locationsData}
            isHover={isHover}
            setIsHover={setIsHover}
            selectedLocationId={selectedLocationId}
            setSelectedLocationId={setSelectedLocationId}
            setIsByCity={setIsByCity}
            isByCity={isByCity}
            isHighQuality={isHighQuality}
            setIsHighQuality={setIsHighQuality}
            isEuropeMap={isEuropeMap}
            setIsGeoMap={setIsGeoMap}
            changeMap={changeMap}
            setChangeMap={setChangeMap}
            mapUrl={mapUrl}
            setMapUrl={setMapUrl}
          />
        }
      </div>
    </section>
  )
}
