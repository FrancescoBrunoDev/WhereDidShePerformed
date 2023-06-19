import { useEffect, useState } from "react"
import { AnimatePresence, motion as m } from "framer-motion"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

import MarksMap from "./marksMarp"
import MenuMap from "./menuMap"

const geoUrl =
  "/maps/europe.json"

const worldUrl =
  "/maps/world.json"

export default function MapCamp({
  locationsData,
  isHover,
  setIsHover,
  selectedLocationId,
  setSelectedLocationId,
  isHighQuality,
  setIsHighQuality,
  isEuropeMap,
  setIsGeoMap,
  changeMap,
  setChangeMap,
  mapUrl,
  setMapUrl,
  thereIsMoreInWorld,
  thereIsMoreInWorldPopup,
  filteredDataCountry,
}) {
  // handle map switch
  // map size based on screen size
  const [mapConfig, setMapConfig] = useState({
    scale: isEuropeMap ? 850 : 150,
    center: isEuropeMap ? [-3, 0] : [-60, 0],
    maxRadius: isEuropeMap ? 10 : 5,
  })

  useEffect(() => {
    // Update the map URL based on the current map type
    setMapUrl(isEuropeMap ? geoUrl : worldUrl)
  }, [isEuropeMap])

  useEffect(() => {
    const updateMapConfig = () => {
      // Get the width of the screen
      const screenWidth = window.innerWidth

      // Calculate the scale, center, and maxZoom based on the screen width and isEuropeMap value
      let newScale, newCenter, newMaxZoom
      let newMaxRadius = mapConfig.maxRadius
      let newIsHighQuality = isHighQuality

      if (isEuropeMap) {
        if (screenWidth < 768) {
          newScale = 900
          newCenter = [6, 0]
          newMaxRadius = 20
        } else if (screenWidth < 1024) {
          newScale = 850
          newCenter = [6, 3]
          newMaxRadius = 8
        } else if (screenWidth < 1280) {
          newScale = 600
          newCenter = [-7, 0]
        } else if (screenWidth < 1536) {
          newScale = 850
          newCenter = [-5, 2]
          newMaxRadius = 10
        } else {
          newScale = 850
          newCenter = [-5, 2]
          newMaxRadius = 10
        }

        // Check the number of points and update the isHighQuality state
        if (locationsData?.length < 50) {
          newIsHighQuality = true
        } else {
          newIsHighQuality = false
        }
        // Different configuration for non-Europe Map
        // Adjust these values according to your requirements
      } else {
        if (screenWidth < 768) {
          newScale = 150
          newCenter = [0, 0]
          newMaxRadius = 8
        } else if (screenWidth < 1024) {
          newScale = 150
          newCenter = [0, 0]
          newMaxRadius = 7
        } else if (screenWidth < 1280) {
          newScale = 110
          newCenter = [-100, 0]
          newMaxRadius = 5
        } else if (screenWidth < 1536) {
          newScale = 130
          newCenter = [-80, 0]
          newMaxRadius = 5
        } else {
          newScale = 150
          newCenter = [-60, 0]
          newMaxRadius = 5
        }
      }

      // Update the map configuration state
      setMapConfig({
        scale: newScale,
        center: newCenter,
        maxRadius: newMaxRadius,
      })
      setIsHighQuality(newIsHighQuality)
    }

    // Call the updateMapConfig function initially and add a resize event listener
    updateMapConfig()
    window.addEventListener("resize", updateMapConfig)

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateMapConfig)
    }
  }, [isEuropeMap, locationsData?.length, mapConfig.maxRadius])

  const { scale, center } = mapConfig

  return (
    <>
      <div className="container flex justify-end">
        <div
          className="fixed bottom-11 z-20
         lg:top-40"
        >
          <MenuMap
            setChangeMap={setChangeMap}
            changeMap={changeMap}
            setIsGeoMap={setIsGeoMap}
            setIsHighQuality={setIsHighQuality}
            isHighQuality={isHighQuality}
            isEuropeMap={isEuropeMap}
            thereIsMoreInWorld={thereIsMoreInWorld}
            thereIsMoreInWorldPopup={thereIsMoreInWorldPopup}
          />
        </div>
      </div>
      <>
        <AnimatePresence initial={false} mode="wait">
          <m.div
            className="fixed bottom-0 top-32 z-[-1] h-[80vh]"
            key={changeMap}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ComposableMap
              className="h-[80vh] w-screen"
              projection={isEuropeMap ? "geoAzimuthalEquidistant" : undefined}
              projectionConfig={{
                rotate: isEuropeMap ? [-10.0, -52.0, 0] : [-10, 0, 0],
                center: center,
                scale: scale,
              }}
            >
              <Geographies
                geography={mapUrl}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="0.7"
                      geography={geo}
                    />
                  ))
                }
              </Geographies>{" "}
              
              <MarksMap
                locationsData={locationsData}
                isHighQuality={isHighQuality}
                selectedLocationId={selectedLocationId}
                setSelectedLocationId={setSelectedLocationId}
                isHover={isHover}
                setIsHover={setIsHover}
                mapConfig={mapConfig}
                filteredDataCountry={filteredDataCountry}
                isEuropeMap={isEuropeMap}
              />
            </ComposableMap>
          </m.div>
        </AnimatePresence>
      </>
    </>
  )
}
