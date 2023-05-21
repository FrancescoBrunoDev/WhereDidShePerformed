"use client"

import { Suspense, useEffect, useState } from "react"
import { motion as m } from "framer-motion"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  checkCategoryAvailability,
  filterLocationsData,
} from "@/components/list/filterLocationsData"
import { GetLocationsWithEventsAndTitle } from "@/components/maps/getMergedLocations"

import { GetInfoPerson } from "../api/musiconn"
import List from "./list"
import Loading from "./loading"
import MapVisualizer from "./mapVisualizer"

const geoUrl =
  "https://raw.githubusercontent.com/leakyMirror/map-of-europe/27a335110674ae5b01a84d3501b227e661beea2b/TopoJSON/europe.topojson"

const worldUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

export default function Composer({ params }) {
  const [locationsData, setLocationsData] = useState([])
  const [id, setId] = useState(null)
  const [isByCity, setIsByCity] = useState(true) // Track the current map type

  const [mapUrl, setMapUrl] = useState(geoUrl) // Initial map URL is geoUrl
  const [isHighQuality, setIsHighQuality] = useState(true) // Track the current map type
  const [isEuropeMap, setIsGeoMap] = useState(true) // Track the current map type
  const [changeMap, setChangeMap] = useState(0) // Track if the map is changed
  const [expandedLocations, setExpandedLocations] = useState(false) // Track if the composer is expanded
  const [concerts, setConcerts] = useState(true) // Track if the concerts-filter are triggered
  const [musicTheater, setMusicTheater] = useState(true) // Track if the musicTheater-filter are triggered
  const [religiousEvent, setReligiousEvent] = useState(true) // Track if the religiousEvent-filter are triggered
  const [season, setSeason] = useState(true) // Track if the season-filter are triggered
  const [areAllFiltersDeactivated, setAreAllFiltersDeactivated] =
    useState(false)

  const [isConcertCategoryAvailable, setIsConcertCategoryAvailable] =
    useState(true)
  const [isMusicTheaterCategoryAvailable, setIsMusicTheaterCategoryAvailable] =
    useState(true)
  const [
    isReligiousEventCategoryAvailable,
    setIsReligiousEventCategoryAvailable,
  ] = useState(true)
  const [isSeasonCategoryAvailable, setIsSeasonCategoryAvailable] =
    useState(true)

  const handleFilterChange = () => {
    if (
      (!concerts || !isConcertCategoryAvailable) &&
      (!musicTheater || !isMusicTheaterCategoryAvailable) &&
      (!religiousEvent || !isReligiousEventCategoryAvailable) &&
      (!season || !isSeasonCategoryAvailable)
    ) {
      setAreAllFiltersDeactivated(true)
    } else {
      setAreAllFiltersDeactivated(false)
    }
  }

  useEffect(() => {
    handleFilterChange()
  }, [
    concerts,
    musicTheater,
    religiousEvent,
    season,
    isConcertCategoryAvailable,
    isMusicTheaterCategoryAvailable,
    isReligiousEventCategoryAvailable,
    isSeasonCategoryAvailable,
  ])

  const { performerId } = params

  useEffect(() => {
    async function fetchData() {
      const data = await GetLocationsWithEventsAndTitle(id)
      setLocationsData(data)
    }

    if (id) {
      fetchData()
    }
  }, [id])

  useEffect(() => {
    async function getData() {
      const data = await GetInfoPerson(performerId)
      setId(data[performerId])
    }
    getData()
  }, [performerId])

  let highestYear = null
  let lowestYear = null

  if (locationsData.length > 0) {
    locationsData.forEach(({ locations }) => {
      if (locations) {
        locations.forEach(({ eventInfo }) => {
          if (eventInfo) {
            eventInfo.forEach(({ date }) => {
              const year = Number(date.substr(0, 4))

              if (highestYear === null || year > highestYear) {
                highestYear = year
              }

              if (lowestYear === null || year < lowestYear) {
                lowestYear = year
              }
            })
          }
        })
      }
    })
  }

  let filterLowestYear = lowestYear

  const [filterHighestYear, setFilterHighestYear] = useState([highestYear])

  const updateFilterHighestYear = (newValue) => {
    setFilterHighestYear(newValue)
  }

  const filteredLocationsDataTimeLine = locationsData
    .map((city) => {
      if (city.locations) {
        const filteredLocations = city.locations
          .map((location) => {
            const filteredEventInfo = (location.eventInfo || []).filter(
              ({ date }) => {
                const year = Number(date.substr(0, 4))
                return year >= filterLowestYear && year <= filterHighestYear
              }
            )

            return {
              ...location,
              eventInfo: filteredEventInfo,
              count: filteredEventInfo.length,
            }
          })
          .filter((location) => {
            return location.eventInfo.length > 0
          })

        return {
          ...city,
          locations: filteredLocations,
        }
      }

      return city
    })
    .filter((city) => {
      return city.locations && city.locations.length > 0
    })

  // Calculate the count of all filteredEventInfo items across all locations
  const totalCount = filteredLocationsDataTimeLine.reduce(
    (sum, { count }) => sum + count,
    0
  )

  const [filteredLocationsData, setFilteredLocationsData] = useState(
    filteredLocationsDataTimeLine
  )

  useEffect(() => {
    filterLocationsData(
      expandedLocations,
      concerts,
      musicTheater,
      religiousEvent,
      season,
      id,
      filteredLocationsDataTimeLine,
      setFilteredLocationsData
    )

    const seasonAvailable = checkCategoryAvailability(locationsData, 1)
    setIsSeasonCategoryAvailable(seasonAvailable)

    const concertAvailable = checkCategoryAvailability(locationsData, 2)
    setIsConcertCategoryAvailable(concertAvailable)

    const religiousEventAvailable = checkCategoryAvailability(locationsData, 3)
    setIsReligiousEventCategoryAvailable(religiousEventAvailable)

    const musicTheaterAvailable = checkCategoryAvailability(locationsData, 4)
    setIsMusicTheaterCategoryAvailable(musicTheaterAvailable)
  }, [
    expandedLocations,
    concerts,
    musicTheater,
    religiousEvent,
    season,
    id,
    filteredLocationsDataTimeLine,
    setFilteredLocationsData,
  ])

  return (
    <m.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      className="relative"
    >
      <div className="container">
        {id && (
          <h1 className="fixed top-16 z-10 w-fit lg:w-96 text-3xl md:text-4xl font-black lg:top-32">
            {id.title}
          </h1>
        )}
      </div>
      <Tabs defaultValue="map">
        <div className="fixed bottom-10 z-20 flex w-full justify-center lg:top-16">
          <div className="flex justify-center shadow-lg lg:shadow-none">
            <TabsList className="z-10">
              <TabsTrigger value="map">map</TabsTrigger>
              <TabsTrigger value="list">list</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="map">
          <TabsContent value="map">
            <Suspense fallback={<Loading />}>
              <MapVisualizer
                locationsData={filteredLocationsData}
                lowestYear={lowestYear}
                highestYear={highestYear}
                filterHighestYear={filterHighestYear}
                updateFilterHighestYear={updateFilterHighestYear}
                isByCity={isByCity}
                setIsByCity={setIsByCity}
                isHighQuality={isHighQuality}
                setIsHighQuality={setIsHighQuality}
                isEuropeMap={isEuropeMap}
                setIsGeoMap={setIsGeoMap}
                changeMap={changeMap}
                setChangeMap={setChangeMap}
                mapUrl={mapUrl}
                setMapUrl={setMapUrl}
              />
            </Suspense>
          </TabsContent>
        </m.div>
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="list">
          <TabsContent value="list">
            <Suspense fallback={<Loading />}>
              {filteredLocationsData && (
                <List
                  filteredLocationsData={filteredLocationsData}
                  setExpandedLocations={setExpandedLocations}
                  setConcerts={setConcerts}
                  setMusicTheater={setMusicTheater}
                  setReligiousEvent={setReligiousEvent}
                  setSeason={setSeason}
                  isConcertCategoryAvailable={isConcertCategoryAvailable}
                  isMusicTheaterCategoryAvailable={
                    isMusicTheaterCategoryAvailable
                  }
                  isReligiousEventCategoryAvailable={
                    isReligiousEventCategoryAvailable
                  }
                  isSeasonCategoryAvailable={isSeasonCategoryAvailable}
                  concerts={concerts}
                  musicTheater={musicTheater}
                  religiousEvent={religiousEvent}
                  season={season}
                  areAllFiltersDeactivated={areAllFiltersDeactivated}
                  expandedLocations={expandedLocations}
                />
              )}
            </Suspense>
          </TabsContent>
        </m.div>
      </Tabs>
    </m.section>
  )
}
