"user client"

import { useEffect, useState } from "react"

import MapCamp from "@/components/maps/mapCamp"
import ScrollAreaMap from "@/components/maps/scrollAreaMap"

export default function MapVisualizer({
  locationsData,
  lowestYear,
  highestYear,
  filterHighestYear,
  updateFilterHighestYear,
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
  thereIsMoreInWorld,
  thereIsMoreInWorldPopup,
  filteredDataContinent,
  filteredDataCountry,
  handleSwitchToggleContinent,
  handleSwitchToggleCountry,
  activeContinents,
  activeCountries,
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
        expandedLocations={expandedLocations}
        searchData={searchData}
        thereIsMoreInWorld={thereIsMoreInWorld}
        isEuropeMap={isEuropeMap}
        filteredDataContinent={filteredDataContinent}
        filteredDataCountry={filteredDataCountry}
        handleSwitchToggleContinent={handleSwitchToggleContinent}
        handleSwitchToggleCountry={handleSwitchToggleCountry}
        activeContinents={activeContinents}
        activeCountries={activeCountries}
      />

      <div>
        <MapCamp
          locationsData={locationsData}
          isHover={isHover}
          setIsHover={setIsHover}
          selectedLocationId={selectedLocationId}
          setSelectedLocationId={setSelectedLocationId}
          isHighQuality={isHighQuality}
          setIsHighQuality={setIsHighQuality}
          isEuropeMap={isEuropeMap}
          setIsGeoMap={setIsGeoMap}
          changeMap={changeMap}
          setChangeMap={setChangeMap}
          mapUrl={mapUrl}
          setMapUrl={setMapUrl}
          thereIsMoreInWorld={thereIsMoreInWorld}
          thereIsMoreInWorldPopup={thereIsMoreInWorldPopup}
          filteredDataCountry={filteredDataCountry}
        />
      </div>
    </section>
  )
}
